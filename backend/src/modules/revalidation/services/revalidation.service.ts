import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name);
  private readonly frontendUrl: string;
  private readonly secret: string;

  constructor(private readonly httpService: HttpService) {
    // Default to localhost:3000 if not set, but ideally should be in .env
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    this.secret = process.env.REVALIDATION_SECRET || '';
  }

  async revalidate(tag: string): Promise<void> {
    if (!this.secret) {
      this.logger.warn('REVALIDATION_SECRET is not set. Skipping on-demand revalidation.');
      return;
    }

    const url = `${this.frontendUrl}/api/revalidate?tag=${tag}&secret=${this.secret}`;

    try {
      this.logger.log(`Invoking Revalidation Webhook: ${tag}`);
      await firstValueFrom(this.httpService.post(url));
      this.logger.log(`Revalidation Success: ${tag}`);
    } catch (error) {
      this.logger.error(`Revalidation Failed for tag: ${tag}`, error);
      // We catch error so we don't block the main request (create/update category)
    }
  }
}
