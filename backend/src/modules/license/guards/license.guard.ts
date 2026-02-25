import { Injectable, CanActivate, ForbiddenException } from '@nestjs/common';
import { LicenseService } from '../license.service';

@Injectable()
export class LicenseGuard implements CanActivate {
  constructor(private readonly licenseService: LicenseService) {}

  async canActivate(): Promise<boolean> {
    const isValid = await this.licenseService.checkLicense();
    if (!isValid) {
      throw new ForbiddenException('License Missing or Invalid. Please activate your product.');
    }
    return true;
  }
}
