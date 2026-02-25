import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { License, LicenseSchema } from './schemas/license.schema';
import { LicenseGuard } from './guards/license.guard';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: License.name, schema: LicenseSchema }]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [LicenseController],
  providers: [LicenseService, LicenseGuard],
  exports: [LicenseService, LicenseGuard],
})
export class LicenseModule {}
