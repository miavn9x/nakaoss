// --- Thư Viện NestJS & Nodemailer ---
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';

// --- Import Interface ---
import { RoleVerificationMailData } from '../interface/role-verification.interface';

/**
 * Service xử lý email xác thực quyền (Role Verification)
 */
@Injectable()
export class RoleVerificationService {
  private transporter: Transporter;
  private readonly logger = new Logger(RoleVerificationService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  /**
   * Gửi email xác thực thăng cấp quyền ADMIN
   */
  async sendRoleVerificationEmail(data: RoleVerificationMailData): Promise<boolean> {
    try {
      if (!data.frontendUrl) {
        this.logger.error('Cannot send email: frontendUrl is missing');
        throw new Error('FRONTEND_URL is not configured');
      }

      // Mã hóa token và id thành chuỗi base64 để tạo link xác thực
      const payload = JSON.stringify({ id: data.userId, token: data.token });
      const code = Buffer.from(payload).toString('base64');
      const link = `${data.frontendUrl}/verify/${code}`;

      // Mapping tên quyền sang tiếng Việt hiển thị
      let displayRole = data.role;
      if (data.role.toLowerCase() === 'admin') {
        displayRole = 'Quản trị viên';
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #0056b3; text-align: center;">Xác Nhận Thay Đổi Quyền Hạn</h2>
          <p>Xin chào <strong>${data.fullName}</strong>,</p>
          <p>Tài khoản của bạn vừa được đề xuất thăng cấp lên quyền: <strong style="color: #d63384;">${displayRole}</strong>.</p>
          <p>Để đảm bảo bảo mật, vui lòng nhấn vào nút bên dưới để chấp nhận thay đổi này:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Chấp Nhận Quyền Mới</a>
          </div>
          <p style="font-size: 13px; color: #666;">Lưu ý: Liên kết này chỉ có hiệu lực trong vòng <strong>10 phút</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">Nếu bạn không yêu cầu thay đổi này, vui lòng bỏ qua email này.</p>
        </div>
      `;

      const mailUser = this.configService.get<string>('MAIL_USER');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from: `"Admin System" <${mailUser}>`,
        to: data.email,
        subject: 'Xác Nhận Thay Đổi Quyền ADMIN',
        html,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Role verification email sent: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending role verification email:', error);
      return false;
    }
  }
}
