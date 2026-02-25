import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Ip,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// --- Import Guard & Decorator ---
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

// --- Import Dịch Vụ ---
import { JwtService } from 'src/common/jwt/services/jwt.service';
import { JwtPayload } from 'src/common/jwt/types/jwt.type';
import { AuthService } from 'src/modules/auth/services/auth.service';

// --- Import DTOs ---
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { RegisterDto } from 'src/modules/auth/dtos/register.dto';

// --- Import Kiểu Dữ Liệu ---
import { StandardResponse } from 'src/common/interfaces/response.interface';
import { AuthResponse } from 'src/modules/auth/dtos/auth-response.dto';

// --- Import Utility ---
import { setAuthCookies } from 'src/modules/auth/utils/set-cookie.util';

/**
 * AuthController - Quản Lý Xác Thực
 */
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng Ký Người Dùng
   * Rate limit: 10 lần/phút
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: StandardResponse<AuthResponse> = await this.authService.register(
      dto,
      ip,
      userAgent,
    );

    if (result.errorCode) {
      if (result.errorCode === 'AUTH_LOCKED') throw new BadRequestException(result);
      throw new BadRequestException(result.message);
    }

    if (result.data) {
      const tokens = result.data as { accessToken?: string; refreshToken?: string };
      const accessMaxAge = this.jwtService.getAccessExpiresInMs();
      const refreshMaxAge = this.jwtService.getRefreshExpiresInMs();
      setAuthCookies(res, tokens, accessMaxAge, refreshMaxAge);
    }

    return {
      message: result.message,
      data: null, // Không trả data token trong body nếu đã set cookie (hoặc tùy strategy)
      errorCode: result.errorCode,
    };
  }

  /**
   * Đăng Nhập Người Dùng
   * Rate limit: 15 lần/phút
   */
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: StandardResponse<AuthResponse> = await this.authService.login(dto, ip, userAgent);

    if (result.errorCode) {
      if (result.errorCode === 'AUTH_LOCKED') throw new BadRequestException(result);
      throw new UnauthorizedException(result.message);
    }

    if (result.data) {
      const tokens = result.data as { accessToken?: string; refreshToken?: string };
      const accessMaxAge = this.jwtService.getAccessExpiresInMs();
      const refreshMaxAge = this.jwtService.getRefreshExpiresInMs();
      setAuthCookies(res, tokens, accessMaxAge, refreshMaxAge);
    }

    return {
      message: result.message,
      data: null,
      errorCode: result.errorCode,
    };
  }

  /**
   * Đăng Xuất Người Dùng
   */
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    const result: StandardResponse<AuthResponse> = await this.authService.logout(user.sessionId);

    if (result.data?.shouldClearCookie) {
      const isProd = process.env.NODE_ENV === 'production';
      const forceSecure = process.env.FORCE_SECURE_COOKIE === 'true';
      const useSecure = isProd || forceSecure;
      const sameSiteValue = useSecure ? 'none' : 'lax';

      const cookieOptions = {
        httpOnly: true,
        secure: useSecure,
        sameSite: sameSiteValue as 'none' | 'lax' | 'strict',
        path: '/',
      };

      res.clearCookie('refreshToken', cookieOptions);
      res.clearCookie('accessToken', cookieOptions);
    }

    return {
      message: result.message,
      data: {},
      errorCode: result.errorCode,
    };
  }

  /**
   * Làm Mới Access Token (Sử dụng Refresh Token từ Cookie)
   */
  @HttpCode(HttpStatus.OK)
  @Post('re-access-token')
  async refreshAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken as string;
    const result: StandardResponse<AuthResponse> = await this.authService.refreshAccessToken(
      refreshToken,
      res,
    );

    return {
      message: result.message,
      data: null,
      errorCode: result.errorCode,
    };
  }

  /**
   * Lấy mã Captcha (Kiểm tra IP lock trước khi trả về)
   */
  @Post('captcha')
  @HttpCode(HttpStatus.OK)
  async getCaptcha(@Body('email') email?: string, @Ip() ip?: string) {
    // Nếu có email/IP -> Kiểm tra xem có đang bị khóa không
    if (ip) {
      const lockCheck = await this.authService.checkCaptchaLock(email || '', ip);

      if (lockCheck.locked) {
        throw new BadRequestException({
          message: lockCheck.message || 'Tài khoản tạm thời bị khóa.',
          data: null,
          errorCode: 'AUTH_LOCKED',
          lockInfo: {
            locked: true,
            lockUntil: lockCheck.lockUntil,
            lockReason: lockCheck.lockReason,
            lockCount: lockCheck.lockCount,
          },
        });
      }
    }

    const result = await this.authService.generateCaptcha();
    return {
      message: 'Lấy captcha thành công',
      data: result,
      errorCode: null,
      lockInfo: { locked: false },
    };
  }

  /**
   * Yêu cầu OTP cho chế độ Sudo (Admin)
   */
  @UseGuards(JwtAuthGuard)
  @Post('sudo/request')
  @HttpCode(HttpStatus.OK)
  async requestSudo(@CurrentUser() user: JwtPayload) {
    return this.authService.requestSudoMode(user.sub, user.email);
  }

  /**
   * Xác thực OTP Sudo Mode
   */
  @UseGuards(JwtAuthGuard)
  @Post('sudo/verify')
  @HttpCode(HttpStatus.OK)
  async verifySudo(@CurrentUser() user: JwtPayload, @Body('otp') otp: string) {
    const result = await this.authService.verifySudoMode(user.sub, otp);
    if (result.errorCode) {
      throw new BadRequestException(result);
    }
    return result;
  }
}
