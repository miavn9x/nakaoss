import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { License, LicenseDocument } from './schemas/license.schema';
import { firstValueFrom } from 'rxjs';

export interface KeyzyError {
  message: string;
  status_code?: number;
}

export interface KeyzyData {
  message?: string;
  licensee_name?: string;
  licensee_email?: string;
  error?: KeyzyError;
  [key: string]: any;
}

// The API response body structure
export interface KeyzyApiResponse {
  data?: KeyzyData;
  error?: KeyzyError;
  [key: string]: any;
}

export interface ActivationResponse {
  success: boolean;
  message: string;
  data: KeyzyData;
}

@Injectable()
export class LicenseService {
  private readonly logger = new Logger(LicenseService.name);
  private readonly API_URL = 'https://api.keyzy.io/v2/licenses/valid';

  constructor(
    @InjectModel(License.name) private licenseModel: Model<LicenseDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async activateOutput(serial: string): Promise<ActivationResponse> {
    const appId = this.configService.get<string>('KEYZY_APP_ID');
    const apiKey = this.configService.get<string>('KEYZY_API_KEY');
    const productId = this.configService.get<string>('KEYZY_PRODUCT_ID');

    if (!appId || !apiKey || !productId) {
      throw new InternalServerErrorException('Keyzy configuration missing');
    }

    try {
      this.logger.log(`Activating license: ${serial} for AppID: ${appId} ProductID: ${productId}`);

      const response = await firstValueFrom(
        this.httpService.post(this.API_URL, {
          app_id: appId,
          api_key: apiKey,
          serial: serial,
          code: productId, // Keyzy expects 'code' for Product ID
          version: '2.0', // Updated to 2.0 for consistent response format
          host_id: 'server-backend',
          device_tag: 'nodejs-backend',
        }),
      );

      // In v2, the successful response is wrapped in a 'data' property
      // Structure: { data: { message: 'valid', ... } }
      const responseBody = response.data as KeyzyApiResponse;
      const data = responseBody.data || (responseBody as KeyzyData);

      this.logger.log(`Keyzy Response: ${JSON.stringify(data)}`);

      // Check for "valid" message
      if (!data || data.message !== 'valid') {
        throw new BadRequestException(data?.message || 'Invalid License Key');
      }

      // Deactivate old license if any exists (Single Device Policy - assumption)
      await this.licenseModel.deleteMany({});

      // Save new license
      const newLicense = new this.licenseModel({
        licenseKey: serial,
        productCode: productId,
        status: 'active',
        licenseeName: data.licensee_name || 'N/A', // Provide default to avoid unsafe access if undefined
        licenseeEmail: data.licensee_email || 'N/A',
        rawResponse: data,
        lastCheck: new Date(),
      });

      await newLicense.save();
      return { success: true, message: 'License activated successfully', data };
    } catch (err: unknown) {
      const error = err as AxiosError<KeyzyApiResponse>;
      const errorData = error.response?.data as KeyzyData;

      // Handle "Trial license expired!" specifically (404)
      if (
        error.response?.status === 404 &&
        errorData?.error?.message === 'Trial license expired!'
      ) {
        this.logger.warn(`Activation failed: Trial license expired for serial: ${serial}`);
        throw new BadRequestException('Giấy phép dùng thử đã hết hạn (Trial license expired)');
      }

      // Handle "Trial license not started!" specifically (404)
      if (
        error.response?.status === 404 &&
        errorData?.error?.message === 'Trial license not started!'
      ) {
        this.logger.warn(`Activation failed: Trial license not started for serial: ${serial}`);
        throw new BadRequestException('Giấy phép chưa đến ngày hiệu lực (Check Start Date)');
      }

      // Handle other 404s
      if (error.response?.status === 404) {
        this.logger.warn(`Activation failed: License not found for serial: ${serial}`);
        throw new BadRequestException('License Key không tồn tại hoặc không hợp lệ.');
      }

      // Handle other API errors
      if (errorData?.error?.message) {
        this.logger.error(`Keyzy API Error: ${errorData.error.message}`);
        throw new BadRequestException(errorData.error.message);
      }

      this.logger.error('License activation failed', error.message);
      throw new BadRequestException('Lỗi kết nối đến máy chủ cấp phép. Vui lòng thử lại sau.');
    }
  }

  async checkLicense(): Promise<boolean> {
    const license = await this.licenseModel.findOne().sort({ createdAt: -1 });
    if (!license) return false;

    // Optional: Re-validate with Keyzy if last check > 24h
    // For now, we trust the DB record to avoid excessive API calls
    return license.status === 'active';
  }

  async getLicenseInfo() {
    return this.licenseModel.findOne().sort({ createdAt: -1 }).exec();
  }

  async removeLicense() {
    await this.licenseModel.deleteMany({});
    return { success: true, message: 'License removed' };
  }
}
