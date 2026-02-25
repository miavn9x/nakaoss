import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BackupService } from './backup.service';
import { GoogleDriveService } from './google-drive.service';
import { ConfigService } from '@nestjs/config';
import { LicenseService } from '../../license/license.service';

@Injectable()
export class BackupScheduleService {
  private readonly logger = new Logger(BackupScheduleService.name);

  constructor(
    private readonly backupService: BackupService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly configService: ConfigService,
    private readonly licenseService: LicenseService,
  ) {}

  // Chạy vào lúc 2 giờ sáng mỗi ngày
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleCron() {
    this.logger.log('Starting scheduled backup to Google Drive...');

    // 1. Kiểm tra License
    const isLicenseValid = await this.licenseService.checkLicense();
    if (!isLicenseValid) {
      this.logger.warn(
        'Scheduled backup skipped: License is invalid or expired. Please activate your license to use this feature.',
      );
      return;
    }

    const folderId = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');
    if (!folderId) {
      this.logger.error(
        'GOOGLE_DRIVE_FOLDER_ID not found in environment variables. Scheduled backup skipped.',
      );
      return;
    }

    try {
      const { stream, filename } = this.backupService.getBackupStream();

      await this.googleDriveService.uploadFileStream(stream, filename, folderId);

      // Giữ lại 7 bản backup gần nhất
      await this.googleDriveService.deleteOldBackups(folderId, 7);

      this.logger.log('Scheduled backup completed successfully.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Scheduled backup failed: ${message}`);
    }
  }
}
