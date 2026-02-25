// --- Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// --- Import Nội Bộ ---
import { ContactController } from './controller/contact.controller';
import { MailService } from './service/send-mail.service';
import { RoleVerificationService } from './service/role-verification.service';

/**
 * Module quản lý việc gửi Email
 * Bao gồm: Liên hệ, Đơn hàng, Xác thực quyền
 */
@Module({
  imports: [ConfigModule],
  controllers: [ContactController],
  providers: [MailService, RoleVerificationService],
  exports: [MailService, RoleVerificationService],
})
export class MailModule {}
