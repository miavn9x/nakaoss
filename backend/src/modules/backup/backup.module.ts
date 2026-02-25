import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule as CommonJwtModule } from '../../common/jwt/jwt.module';
import { BackupController } from './controllers/backup.controller';
import { BackupService } from './services/backup.service';
import { BackupGuard } from './guards/backup.guard';
import { GoogleDriveService } from './services/google-drive.service';
import { BackupScheduleService } from './services/backup-schedule.service';
import { ConfigModule } from '@nestjs/config';

import { LicenseModule } from '../license/license.module';

@Module({
  imports: [
    LicenseModule,
    CommonJwtModule,
    ConfigModule,
    ScheduleModule.forRoot(),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/temp';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10GB
    }),
  ],
  controllers: [BackupController],
  providers: [BackupService, BackupGuard, GoogleDriveService, BackupScheduleService],
})
export class BackupModule {}
