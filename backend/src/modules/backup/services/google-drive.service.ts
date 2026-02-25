import { Injectable, Logger } from '@nestjs/common';
import { google, drive_v3, Auth } from 'googleapis';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

type OAuth2Client = Auth.OAuth2Client;

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);
  private drive: drive_v3.Drive;
  private oauth2Client: OAuth2Client;
  private readonly TOKEN_PATH = path.join(process.cwd(), 'google-tokens.json');

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('GOOGLE_DRIVE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_DRIVE_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('GOOGLE_DRIVE_REDIRECT_URI');

    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    // Tự động lưu token khi Google làm mới (Refresh Token)
    this.oauth2Client.on('tokens', tokens => {
      this.saveTokens(tokens);
    });

    // Thử load token cũ nếu có
    if (fs.existsSync(this.TOKEN_PATH)) {
      try {
        const tokens = JSON.parse(fs.readFileSync(this.TOKEN_PATH, 'utf8')) as Auth.Credentials;
        this.oauth2Client.setCredentials(tokens);
      } catch {
        this.logger.error('Failed to load existing Google tokens');
      }
    }

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  // --- Luồng Xác thực OAuth 2.0 ---

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // Để lấy refresh_token dùng lâu dài
      scope: ['https://www.googleapis.com/auth/drive.file'],
      prompt: 'consent',
    });
  }

  async setTokens(code: string): Promise<Auth.Credentials> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.saveTokens(tokens);
    return tokens;
  }

  private saveTokens(tokens: Auth.Credentials) {
    try {
      // Đọc token cũ để gộp (trường hợp google chỉ gửi access_token mới mà không gửi lại refresh_token)
      let currentTokens: Auth.Credentials = {};
      if (fs.existsSync(this.TOKEN_PATH)) {
        currentTokens = JSON.parse(fs.readFileSync(this.TOKEN_PATH, 'utf8')) as Auth.Credentials;
      }

      const mergedTokens = { ...currentTokens, ...tokens };
      fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(mergedTokens, null, 2));
      this.logger.log('Google Drive tokens updated and saved to disk.');
    } catch (error) {
      this.logger.error('Error saving Google tokens:', error);
    }
  }

  // --- Các hàm nghiệp vụ ---

  async uploadFileStream(
    fileStream: Readable,
    fileName: string,
    folderId: string,
  ): Promise<string> {
    try {
      this.logger.log(`Starting OAuth upload to Google Drive: ${fileName}`);

      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: 'application/zip',
          body: fileStream,
        },
      });

      this.logger.log(`Upload successful! File ID: ${response.data.id || 'unknown'}`);
      return response.data.id || '';
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to upload file to Google Drive: ${message}`);
      throw error;
    }
  }

  async deleteOldBackups(folderId: string, keepCount: number = 7) {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, createdTime)',
        orderBy: 'createdTime desc',
      });

      const files = response.data.files;
      if (files && files.length > keepCount) {
        const filesToDelete = files.slice(keepCount);
        for (const file of filesToDelete) {
          if (file.id) {
            await this.drive.files.delete({ fileId: file.id });
            this.logger.log(`Deleted old backup: ${file.name || 'unnamed'} (${file.id})`);
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to delete old backups: ${message}`);
    }
  }
}
