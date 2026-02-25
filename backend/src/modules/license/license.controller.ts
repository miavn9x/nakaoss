import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { LicenseService, ActivationResponse } from './license.service';
import { JwtAuthGuard } from '../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/constants/user-role.enum';
import { Throttle } from '@nestjs/throttler';
import { OptionalJwtAuthGuard } from '../../common/jwt/guards/optional-jwt.guard';
import { JwtPayload } from '../../common/jwt/types/jwt.type';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post('activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async activate(@Body('key') key: string): Promise<ActivationResponse> {
    return this.licenseService.activateOutput(key);
  }

  @Get('status')
  @UseGuards(OptionalJwtAuthGuard)
  async status(@Req() req: RequestWithUser) {
    const info = await this.licenseService.getLicenseInfo();
    const isAdmin = req.user?.roles?.includes(UserRole.ADMIN);

    if (info && !isAdmin) {
      // Mask sensitive info for non-admins
      if (info.licenseeEmail) {
        const [user, domain] = info.licenseeEmail.split('@');
        info.licenseeEmail = `${user.substring(0, 2)}***@${domain}`;
      }
      if (info.licenseeName) {
        info.licenseeName = `${info.licenseeName.substring(0, 2)}***`;
      }
      // Hide raw response details
      info.rawResponse = undefined;
    }

    return {
      active: !!info,
      license: info,
    };
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove() {
    return this.licenseService.removeLicense();
  }
}
