import {
  Controller,
  Get,
  Res,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BackupService } from '../services/backup.service';
import { BackupGuard } from '../guards/backup.guard';
import { GoogleDriveService } from '../services/google-drive.service';
import { ConfigService } from '@nestjs/config';

import { BackupResponseDto } from '../dtos/backup-response.dto';
import { LicenseGuard } from '../../license/guards/license.guard';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

@Controller('backup')
@UseGuards(LicenseGuard)
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly googleDriveService: GoogleDriveService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload-to-drive')
  @UseGuards(JwtAuthGuard, RolesGuard, BackupGuard)
  @Roles(UserRole.ADMIN)
  async uploadToDrive(): Promise<BackupResponseDto> {
    const folderId = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');
    if (!folderId) {
      throw new BadRequestException('GOOGLE_DRIVE_FOLDER_ID is not configured in .env');
    }

    try {
      const { stream, filename } = this.backupService.getBackupStream();
      await this.googleDriveService.uploadFileStream(stream, filename, folderId);
      return { success: true, message: 'Đã tải bản backup lên Google Drive thành công.' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Upload to Drive failed: ${msg}`);
    }
  }

  // --- Luồng Xác thực OAuth 2.0 ---

  @Get('auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  googleAuth(@Res() res: Response) {
    try {
      console.log('--- Bắt đầu luồng OAuth Redirect ---');
      const url = this.googleDriveService.getAuthUrl();
      console.log('Redirecting to:', url);
      return res.redirect(url);
    } catch (error) {
      console.error('LỖI tại /auth:', error);
      throw new InternalServerErrorException(
        `Không thể tạo URL xác thực Google: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get('auth/callback')
  async googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      console.log('--- Nhận được Callback từ Google ---');
      if (!code) {
        throw new BadRequestException('Authorization code is missing');
      }
      await this.googleDriveService.setTokens(code);
      console.log('Lưu Token thành công!');
      return res.send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #2e7d32;">✅ Kết nối Google Drive thành công!</h1>
            <p>Bây giờ bạn có thể quay lại trang web và thực hiện backup.</p>
            <button onclick="window.close()" style="padding: 10px 20px; cursor: pointer;">Đóng cửa sổ này</button>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('LỖI tại /auth/callback:', error);
      throw new InternalServerErrorException(
        `Xác thực thất bại: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // --- Endpoint Test nhanh (Giữ lại để test OAuth) ---

  @Get('test-drive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async testDrive(): Promise<BackupResponseDto> {
    const folderId = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');
    if (!folderId) {
      throw new BadRequestException('GOOGLE_DRIVE_FOLDER_ID chưa được cấu hình');
    }

    try {
      const { stream, filename } = this.backupService.getBackupStream();
      await this.googleDriveService.uploadFileStream(stream, filename, folderId);
      return {
        success: true,
        message: `Thành công! File "${filename}" đã được tải lên Drive cá nhân của bạn.`,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Test Drive failed: ${msg}`);
    }
  }

  @Get('download')
  @UseGuards(JwtAuthGuard, RolesGuard, BackupGuard)
  @Roles(UserRole.ADMIN)
  download(@Res() res: Response) {
    const { stream, filename } = this.backupService.getBackupStream();

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    stream.pipe(res);
  }

  @Post('restore')
  @UseGuards(JwtAuthGuard, RolesGuard, BackupGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async restore(@UploadedFile() file: Express.Multer.File): Promise<BackupResponseDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Multer DiskStorage đã lưu file vào ổ cứng (file.path)
    // Chúng ta chỉ cần dùng đường dẫn đó để restore
    const tempPath = file.path;

    // Core module imports
    const fs = await import('fs');

    try {
      if (!tempPath) {
        throw new BadRequestException('File handling failed');
      }

      // Log debug
      console.log('Restore request received. File path:', tempPath);
      if (fs.existsSync(tempPath)) {
        console.log('File exists on disk.');
      } else {
        console.error('CRITICAL: File does NOT exist on disk at:', tempPath);
        throw new BadRequestException('File upload failed (File not found)');
      }

      // Execute Restore
      await this.backupService.restoreFromZip(tempPath);

      // Clean up temp file
      await fs.promises.unlink(tempPath).catch(() => {});

      return { success: true, message: 'Khôi phục thành công. Vui lòng đăng nhập lại.' };
    } catch (error) {
      // Clean up temp file in case of error
      if (tempPath) {
        await fs.promises.unlink(tempPath).catch(() => {});
      }
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Restore failed: ${msg}`);
    }
  }
}
