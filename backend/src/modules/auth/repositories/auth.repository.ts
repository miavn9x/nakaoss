// --- Import Mongoose ---
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';
// --- Import Hashing ---
import * as argon2 from 'argon2';
// --- Import Services ---
import { JwtService } from 'src/common/jwt/services/jwt.service';
// --- Import DTOs ---
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';
// --- Import Schemas ---
import { AuthErrorCode } from 'src/modules/auth/constants/auth-error-code.enum';
import { AuthSession, AuthSessionDocument } from 'src/modules/auth/schemas/auth.schema';
import { createTokenAndSession } from 'src/modules/auth/utils/token-session.util';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';
// --- Import UA Parser ---
import { UAParser } from 'ua-parser-js';

// --- AUTH REPOSITORY ---
export class AuthRepository {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(AuthSession.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // Helper method to parse User Agent
  private parseUserAgent(userAgent?: string):
    | {
        browser: Record<string, string>;
        os: Record<string, string>;
        device: Record<string, string>;
      }
    | undefined {
    if (!userAgent) return undefined;
    try {
      const parser = new UAParser(userAgent);
      const result = parser.getResult();

      const cleanObject = (obj: Record<string, string | undefined>) => {
        return Object.fromEntries(
          Object.entries(obj).filter(([, v]) => v != null && v !== ''),
        ) as Record<string, string>;
      };

      return {
        browser: cleanObject({
          name: result.browser.name,
          version: result.browser.version,
        }),
        os: cleanObject({
          name: result.os.name,
          version: result.os.version,
        }),
        device: cleanObject({
          vendor: result.device.vendor,
          model: result.device.model,
          type: result.device.type,
        }),
      };
    } catch {
      return undefined;
    }
  }

  // --- ĐĂNG KÝ NGƯỜI DÙNG ---
  async handleRegister(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const { email, password, firstName, lastName, phoneNumber, address } = dto;

    // Parse User-Agent để lưu thông tin thiết bị
    const parsedUa = this.parseUserAgent(userAgent);
    const formattedUserAgent =
      parsedUa?.browser?.name && parsedUa?.os?.name
        ? `${parsedUa.browser.name} / ${parsedUa.os.name}`
        : userAgent || 'Unknown';

    // Mã hoá mật khẩu với Argon2
    const hashed = await argon2.hash(password, { type: argon2.argon2id });

    // Tạo người dùng mới
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const user = (await this.userModel.create({
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      password: hashed,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      roles: ['user'] as any,
      isEmailVerified: false,
      loyaltyPoints: 0,
      membershipTier: 'Bronze',
      registrationIp: ipAddress,
      registrationUserAgent: formattedUserAgent,
    } as any)) as unknown as UserDocument;

    // Cập nhật thời gian đăng nhập và lưu Session
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (user as any).lastLoginAt = new Date();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await (user as any).save();

    const { accessToken, refreshToken } = await createTokenAndSession({
      user,
      jwtService: this.jwtService,
      authSessionModel: this.authSessionModel,
      ipAddress,
      userAgent: userAgent,
      device: parsedUa?.device,
      os: parsedUa?.os,
      browser: parsedUa?.browser,
    });

    return {
      message: 'Đăng ký thành công',
      data: { accessToken, refreshToken },
      errorCode: null,
    };
  }

  // --- ĐĂNG NHẬP NGƯỜI DÙNG ---
  async handleLogin(user: UserDocument, password: string, ipAddress?: string, userAgent?: string) {
    // Kiểm tra mật khẩu
    const userWithPassword = await this.userModel.findById(user._id).select('+password');

    const isPasswordValid =
      userWithPassword && (await argon2.verify(userWithPassword.password, password));
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const parsedUa = this.parseUserAgent(userAgent);

    // Cập nhật lần đăng nhập cuối
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (user as any).lastLoginAt = new Date();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await (user as any).save();

    // Tạo Token và Session mới
    const { accessToken, refreshToken } = await createTokenAndSession({
      user,
      jwtService: this.jwtService,
      authSessionModel: this.authSessionModel,
      ipAddress,
      userAgent: userAgent,
      device: parsedUa?.device,
      os: parsedUa?.os,
      browser: parsedUa?.browser,
    });

    // Giới hạn 3 phiên đăng nhập đồng thời (xóa phiên cũ nhất)
    const activeSessions = await this.authSessionModel
      .find({ userId: user._id, isExpired: false })
      .sort({ loginAt: 1 });

    if (activeSessions.length >= 3) {
      const oldest = activeSessions[0];
      await this.authSessionModel.updateOne(
        { _id: oldest._id },
        { isExpired: true, expiresAt: new Date() },
      );
    }

    return {
      message: 'Đăng nhập thành công',
      data: { accessToken, refreshToken },
      errorCode: null,
    };
  }

  // --- ĐĂNG XUẤT ---
  /**
   * Đăng xuất người dùng: Thu hồi phiên đăng nhập
   */
  async logout(sessionId: string) {
    const result = await this.authSessionModel.updateOne(
      { sessionId },
      { isExpired: true, expiresAt: new Date() },
    );

    if (!result || result.modifiedCount === 0) {
      return {
        message: 'Phiên đăng nhập không tồn tại hoặc đã hết hạn',
        data: null,
        errorCode: AuthErrorCode.SESSION_NOT_FOUND,
      };
    }

    return {
      message: 'Đăng xuất thành công',
      data: { shouldClearCookie: true },
      errorCode: null,
    };
  }

  // --- LÀM MỚI TOKEN ---
  /**
   * Cấp lại Access Token mới từ Refresh Token
   */
  async refreshTokens(sessionId: string) {
    const session = await this.authSessionModel.findOne({
      sessionId,
      isExpired: false, // Chỉ refresh khi phiên còn hiệu lực
    });

    if (!session || session.expiresAt < new Date()) {
      return {
        message: session
          ? 'Refresh Token không hợp lệ hoặc đã hết hạn'
          : 'Phiên đăng nhập không tồn tại hoặc đã bị thu hồi',
        data: null,
        errorCode: session ? AuthErrorCode.INVALID_REFRESH_TOKEN : AuthErrorCode.SESSION_NOT_FOUND,
      };
    }

    const user = await this.userModel.findById(session.userId);
    if (!user) {
      return {
        message: 'Người dùng không tồn tại',
        data: null,
        errorCode: AuthErrorCode.USER_NOT_FOUND,
      };
    }

    const payload = {
      sub: user._id.toString(),
      sessionId,
      email: user.email,
      roles: user.roles,
    };

    const { accessToken, refreshToken: newRefreshToken } = this.jwtService.signTokens(payload);

    session.refreshToken = newRefreshToken;
    session.lastRefreshedAt = new Date();
    await session.save();

    return {
      message: 'Làm mới token thành công',
      data: { accessToken, refreshToken: newRefreshToken },
      errorCode: null,
    };
  }
}
