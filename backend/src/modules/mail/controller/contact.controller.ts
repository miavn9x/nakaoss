// --- Thư Viện NestJS ---
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

// --- Import Nội Bộ ---
import { SendContactDto } from '../dto/contact.dto';
import { MailService } from '../service/send-mail.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  /**
   * API Gửi thông tin liên hệ
   * Nhận data từ client -> Gửi mail background cho Admin
   */
  @Post('send')
  @Throttle({ default: { limit: 3, ttl: 60 * 60 * 1000 } }) // 3 requests per 1 hour
  @HttpCode(HttpStatus.OK)
  sendContact(@Body() sendContactDto: SendContactDto) {
    try {
      // Đẩy vào queue gửi mail để xử lý bất đồng bộ
      this.mailService.sendContactNotification(sendContactDto);

      return {
        success: true,
        message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        data: null,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        message: 'Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.',
        error: errorMessage,
      };
    }
  }
}
