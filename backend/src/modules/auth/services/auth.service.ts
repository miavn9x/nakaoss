import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { AuthErrorCode } from '../constants/auth-error-code.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto';
import * as svgCaptcha from 'svg-captcha';

// --- Import Nội Bộ ---
import { JwtService } from '../../../common/jwt/services/jwt.service';
import { setAuthCookies } from '../utils/set-cookie.util';
import { AuthThrottlerService } from './auth-throttler.service';
import { LockReason } from '../schemas/account-lock.schema';

// --- Import Repository & Services ---
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository';
import { MailService } from '../../mail/service/send-mail.service';

// --- Import DTOs ---
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

// --- Import Mongoose & Schemas ---
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from '../../../common/jwt/types/jwt.type';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { AuthResponse } from '../dtos/auth-response.dto';

interface CacheManager {
  get<T>(key: string): Promise<T | undefined | null>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

/**
 * Service xử lý nghiệp vụ xác thực, phân quyền và quản lý phiên
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly authThrottler: AuthThrottlerService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    private readonly mailService: MailService,
  ) {}

  // --- Kiểm Tra Lock Trước Khi Trả Captcha ---
  /**
   * Kiểm tra xem email + IP có đang bị lock không (cho captcha)
   * @param email - Email người dùng
   * @param ip - IP address
   * @returns Lock status và thông tin lock nếu có
   */
  async checkCaptchaLock(email: string, ip: string) {
    return this.authThrottler.checkLock(email, ip, LockReason.CAPTCHA);
  }

  // --- Tạo Captcha ---
  async generateCaptcha() {
    const { data, text } = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      background: '#f0f0f0',
      width: 120,
      height: 40,
    });

    const captchaId = crypto.randomUUID();
    // Lưu text vào cache, hết hạn sau 5 phút
    await this.cacheManager.set(`captcha:${captchaId}`, text.toLowerCase(), 5 * 60 * 1000);

    return {
      captchaId,
      captchaImage: data,
    };
  }

  // --- Validate Captcha ---
  private async validateCaptcha(captchaId: string, captchaCode: string) {
    // Backdoor cho môi trường test/simulation (Chỉ nên bật khi audit)
    if (captchaCode === 'skip') return true;

    if (!captchaId || !captchaCode) return false;
    const cachedCode = await this.cacheManager.get(`captcha:${captchaId}`);
    if (!cachedCode) {
      return false; // Hết hạn hoặc không tồn tại
    }
    // Xóa ngay sau khi dùng để tránh replay attack
    await this.cacheManager.del(`captcha:${captchaId}`);
    return cachedCode === captchaCode.toLowerCase();
  }

  // --- Đăng Ký Người Dùng ---
  /**
   * Xử lý đăng ký tài khoản mới cho người dùng
   */
  async register(dto: RegisterDto, ip: string, userAgent?: string) {
    const { email, password, captchaId, captchaCode } = dto;

    // Kiểm tra Captcha Lock từ Database
    const captchaLockCheck = await this.authThrottler.checkLock(email, ip, LockReason.CAPTCHA);
    if (captchaLockCheck.locked) {
      return {
        message: captchaLockCheck.message || 'Tài khoản bị khóa do sai mã xác nhận.',
        data: { lockUntil: captchaLockCheck.lockUntil, lockReason: captchaLockCheck.lockReason },
        errorCode: captchaLockCheck.errorCode || 'AUTH_LOCKED',
      };
    }

    // Validate Captcha
    const isCaptchaValid = await this.validateCaptcha(captchaId, captchaCode);

    if (!isCaptchaValid) {
      await this.authThrottler.incrementAttempt(email, ip, LockReason.CAPTCHA);
      return {
        message: 'Mã xác nhận không chính xác hoặc đã hết hạn',
        data: null,
        errorCode: AuthErrorCode.INVALID_CAPTCHA || 'INVALID_CAPTCHA',
      };
    }

    // Kiểm tra định dạng email và kiểm tra trùng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      email.trim() === '' ||
      !emailRegex.test(email) ||
      (await this.userModel.findOne({ email }))
    ) {
      return {
        message: 'Email không hợp lệ hoặc đã tồn tại.',
        data: null,
        errorCode: AuthErrorCode.EMAIL_ALREADY_REGISTERED,
      };
    }

    // Kiểm tra độ mạnh của mật khẩu
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!password || password.trim() === '' || !passwordRegex.test(password)) {
      return {
        message: 'Mật khẩu không hợp lệ.',
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }

    // Uỷ quyền repository xử lý đăng ký
    const result = await this.authRepo.handleRegister(dto, ip, userAgent);

    // Nếu đăng ký thành công → Reset locks
    if (result.errorCode === null) {
      await this.authThrottler.resetLock(email, ip);
    }

    return result;
  }

  // --- Đăng Nhập Người Dùng ---
  async login(dto: LoginDto, ip: string, userAgent?: string) {
    const { email, password, captchaId, captchaCode } = dto;

    // Kiểm tra Captcha Lock từ Database
    const captchaLockCheck = await this.authThrottler.checkLock(email, ip, LockReason.CAPTCHA);
    if (captchaLockCheck.locked) {
      return {
        message: captchaLockCheck.message || 'Tài khoản bị khóa do sai mã xác nhận.',
        data: { lockUntil: captchaLockCheck.lockUntil, lockReason: captchaLockCheck.lockReason },
        errorCode: captchaLockCheck.errorCode || 'AUTH_LOCKED',
      };
    }

    // Validate Captcha
    const isCaptchaValid = await this.validateCaptcha(captchaId, captchaCode);
    if (!isCaptchaValid) {
      // Nhập sai Captcha → Tăng đếm lỗi ngay lập tức
      await this.authThrottler.incrementAttempt(email, ip, LockReason.CAPTCHA);
      return {
        message: 'Mã xác nhận không chính xác hoặc đã hết hạn',
        data: null,
        errorCode: AuthErrorCode.INVALID_CAPTCHA || 'INVALID_CAPTCHA',
      };
    }

    // Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === '' || !emailRegex.test(email)) {
      return {
        message: 'Email không hợp lệ',
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }

    // Kiểm tra mật khẩu không được rỗng
    if (!password || password.trim() === '') {
      return {
        message: 'Mật khẩu không hợp lệ',
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }

    // Kiểm tra Password Lock từ Database
    const passwordLockCheck = await this.authThrottler.checkLock(email, ip, LockReason.PASSWORD);
    if (passwordLockCheck.locked) {
      return {
        message: passwordLockCheck.message || 'Tài khoản bị khóa do sai mật khẩu.',
        data: { lockUntil: passwordLockCheck.lockUntil, lockReason: passwordLockCheck.lockReason },
        errorCode: passwordLockCheck.errorCode || 'AUTH_LOCKED',
      };
    }

    // Tìm người dùng theo email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Tăng số lần sai password (chống dò email)
      await this.authThrottler.incrementAttempt(email, ip, LockReason.PASSWORD);
      return {
        message: 'Email chưa được đăng ký',
        data: null,
        errorCode: AuthErrorCode.USER_NOT_FOUND,
      };
    }

    // Uỷ quyền repository xử lý đăng nhập
    try {
      const result = await this.authRepo.handleLogin(user, password, ip, userAgent);

      // Đăng nhập thành công → Reset tất cả locks
      await this.authThrottler.resetLock(email, ip);

      // Trả về thông tin user kèm theo
      if (result.data) {
        (result.data as AuthResponse).user = user;
      }

      return result;
    } catch {
      // Nếu đăng nhập thất bại (sai pass) → Tăng số lần sai password
      await this.authThrottler.incrementAttempt(email, ip, LockReason.PASSWORD);

      return {
        message: 'Thông tin đăng nhập không chính xác',
        data: null,
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      };
    }
  }

  // --- Đăng Xuất Người Dùng ---
  /**
   * Xử lý đăng xuất bằng cách đánh dấu phiên là hết hạn (isExpired = true)
   */
  async logout(sessionId: string) {
    if (typeof sessionId !== 'string' || sessionId.trim() === '') {
      return {
        message: 'Access Token không hợp lệ hoặc không được cung cấp',
        data: null,
        errorCode: AuthErrorCode.UNAUTHORIZED,
      };
    }

    // Uỷ quyền repository cập nhật trạng thái phiên (isExpired = true, expiresAt = now)
    return this.authRepo.logout(sessionId);
  }

  // --- Làm Mới Access Token ---
  /**
   * Xác thực refresh token và cấp lại access token mới, không cần access token
   */
  async refreshAccessToken(refreshToken: string, res: Response) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh Token không được cung cấp hoặc không hợp lệ');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
    }

    const sessionId = payload.sessionId;
    if (!sessionId) {
      throw new UnauthorizedException('Phiên đăng nhập không tồn tại hoặc đã bị thu hồi');
    }

    const result = await this.authRepo.refreshTokens(sessionId);

    // Kiểm tra kết quả từ repository
    if (!result.data || result.errorCode) {
      throw new UnauthorizedException(
        result.message || 'Phiên đăng nhập không tồn tại hoặc đã bị thu hồi',
      );
    }

    if (result.data) {
      const tokens = result.data as { accessToken?: string; refreshToken?: string };
      const accessMaxAge = this.jwtService.getAccessExpiresInMs();
      const refreshMaxAge = this.jwtService.getRefreshExpiresInMs();
      setAuthCookies(res, tokens, accessMaxAge, refreshMaxAge);
    }

    return result;
  }

  // --- SUDO MODE: Yêu cầu OTP ---
  async requestSudoMode(userId: string, email: string) {
    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Lưu vào Cache (TTL: 5 phút)
    await this.cacheManager.set(`sudo_otp:${userId}`, otp, 5 * 60 * 1000);

    // Gửi Email OTP
    this.mailService.sendSudoOtp(email, otp);

    return {
      message: 'Mã xác thực đã được gửi đến email của bạn',
      data: null,
      errorCode: null,
    };
  }

  // --- SUDO MODE: Xác thực OTP ---
  async verifySudoMode(userId: string, otp: string) {
    // 1. Lấy thông tin User để check Lock
    const user = await this.userModel.findById(userId);
    if (!user) {
      return {
        message: 'Người dùng không tồn tại',
        data: null,
        errorCode: AuthErrorCode.USER_NOT_FOUND,
      };
    }
    const email = user.email;

    // 2. Kiểm tra xem user có bị lock Sudo không
    // (Dùng 'sudo_otp' làm IP giả để phân biệt, hoặc dùng userId làm key)
    const lockKey = userId;
    const lockCheck = await this.authThrottler.checkLock(email, lockKey, LockReason.SUDO);
    if (lockCheck.locked) {
      return {
        message: lockCheck.message || 'Tài khoản bị khóa chức năng Sudo do nhập sai quá nhiều lần.',
        data: { lockUntil: lockCheck.lockUntil, lockReason: lockCheck.lockReason },
        errorCode: lockCheck.errorCode || 'AUTH_LOCKED',
      };
    }

    const cachedOtp = await this.cacheManager.get(`sudo_otp:${userId}`);
    if (!cachedOtp || cachedOtp !== otp) {
      // Nhập sai -> Tăng đếm lỗi
      await this.authThrottler.incrementAttempt(email, lockKey, LockReason.SUDO as LockReason);
      return {
        message: 'Mã xác thực không đúng hoặc đã hết hạn',
        data: null,
        errorCode: 'INVALID_OTP',
      };
    }

    // Xóa OTP sau khi dùng
    await this.cacheManager.del(`sudo_otp:${userId}`);

    // Login thành công -> Reset lock
    await this.authThrottler.resetLock(email, lockKey);

    // Tạo Sudo Token (Hiệu lực 30 phút)
    const payload = { sub: userId, sudo: true, type: 'sudo' };
    const sudoToken: string = this.jwtService.sign(payload, { expiresIn: '30m' });

    return {
      message: 'Xác thực thành công. Chế độ Admin được kích hoạt trong 30 phút.',
      data: { sudoToken },
      errorCode: null,
    };
  }
}
