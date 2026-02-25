import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../../../common/jwt/services/jwt.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class BackupGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sudoToken = request.headers['x-sudo-token'];

    if (!sudoToken || typeof sudoToken !== 'string') {
      throw new UnauthorizedException('Missing Sudo Token');
    }

    try {
      // Use the custom JwtService which uses JWT_ACCESS_TOKEN_SECRET internally
      const payload = this.jwtService.verify(sudoToken);

      if (!payload.sudo || payload.type !== 'sudo') {
        throw new UnauthorizedException('Invalid Sudo Token Type');
      }

      // Attach user info to request
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      request.user = { ...(request.user || {}), ...payload };
      return true;
    } catch {
      throw new UnauthorizedException('Sudo Token Invalid or Expired');
    }
  }
}
