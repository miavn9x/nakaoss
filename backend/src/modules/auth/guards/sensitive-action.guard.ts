import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from 'src/common/jwt/services/jwt.service';

/**
 * Guard bảo vệ các hành động nhạy cảm (Sudo Mode)
 * Yêu cầu phải có x-sudo-token trong header
 */
@Injectable()
export class SensitiveActionGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const sudoToken = request.headers['x-sudo-token'] as string;

    if (!sudoToken) {
      throw new ForbiddenException({
        message: 'Hành động này yêu cầu xác thực Admin (Sudo Mode)',
        errorCode: 'REQUIRE_SUDO_MODE',
      });
    }

    try {
      const payload: any = this.jwtService.verify(sudoToken);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!payload.sudo || payload.type !== 'sudo') {
        throw new Error('Invalid sudo token');
      }
      return true;
    } catch {
      throw new ForbiddenException({
        message: 'Phiên làm việc Admin (Sudo Mode) đã hết hạn. Vui lòng xác thực lại.',
        errorCode: 'REQUIRE_SUDO_MODE',
      });
    }
  }
}
