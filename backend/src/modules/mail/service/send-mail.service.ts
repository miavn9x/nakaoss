// --- Thư Viện NestJS & Nodemailer ---
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';

// --- Import Nội Bộ ---
import { ContactMailData } from '../interface/contact.interface';
import { OrderMailData } from '../interface/order.interface';
import { escapeHtml } from 'src/common/utils/html.util';

// --- Service Mail (Xử Lý Hàng Đợi) ---
@Injectable()
export class MailService {
  private transporter: Transporter;
  private mailQueue: Array<() => Promise<void>> = [];
  private isProcessing = false;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // true = 465, false = các cổng khác
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // 1. Quản Lý Hàng Đợi (Queue)
  /**
   * Thêm task gửi mail vào hàng đợi và kích hoạt xử lý.
   */
  private addToQueue(task: () => Promise<void>) {
    this.mailQueue.push(task);
    void this.processQueue();
  }

  /**
   * Xử lý hàng đợi tuần tự (Sequential Processing).
   * Đảm bảo không gửi ồ ạt gây spam/block.
   */
  private async processQueue() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    while (this.mailQueue.length > 0) {
      const task = this.mailQueue.shift();
      if (task) {
        try {
          await task();
        } catch {
          // Bỏ qua lỗi khi xử lý task để không chặn queue
        }
      }
    }
    this.isProcessing = false;
  }

  // 2. Gửi Email Liên Hệ (Contact)
  /**
   * Gửi email thông báo liên hệ mới từ khách hàng về cho Admin.
   */
  sendContactNotification(contact: ContactMailData): void {
    this.addToQueue(async () => {
      const safeName = escapeHtml(contact.fullName);
      const safeSubject = escapeHtml(contact.subject);
      const safeContent = escapeHtml(contact.content);
      const safeEmail = escapeHtml(contact.email);
      const safePhone = escapeHtml(contact.phone);
      const safeAddress = escapeHtml(contact.address);

      const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f8f8f8; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
          <h2 style="color: #333; margin: 0;">📧 Liên hệ mới từ website!</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px;">Xin chào,</p>
          <p style="font-size: 16px;">Bạn có một liên hệ mới từ website. Dưới đây là chi tiết:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Họ tên:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${safeName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Số điện thoại:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safePhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Địa chỉ:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${safeAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Chủ đề:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>${safeSubject}</strong></td>
            </tr>
          </table>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Nội dung tin nhắn:</h4>
            <p style="margin: 0; font-style: italic; color: #555;">${safeContent}</p>
          </div>

          <p style="font-size: 14px; color: #666;">Vui lòng phản hồi khách hàng trong thời gian sớm nhất.</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} <a href="https://wfourtech.vn/" style="color: #3498db; text-decoration: none;">W-Four Tech</a>. All rights reserved.</p>
        </div>
      </div>
    `;

      const mailUser = this.configService.get<string>('MAIL_USER');

      await this.transporter.sendMail({
        from: `"MIA PC Contact" <${mailUser}>`,
        to: mailUser, // Gửi về cho admin
        subject: `📧 Liên hệ mới: ${safeSubject}`,
        html: emailContent,
      });
    });
  }

  // 3. Gửi Email Đơn Hàng Mới
  /**
   * Gửi confirmation cho KH và notification cho Admin.
   */
  sendOrderNotification(order: OrderMailData): void {
    this.addToQueue(async () => {
      const adminTemplate = this.getOrderEmailTemplate(
        order,
        `🔔 [Admin] Đơn hàng mới #${order.code}`,
        '🛒 Đơn hàng mới vừa được đặt!',
        'Một đơn hàng mới đã được đặt trên hệ thống. Vui lòng kiểm tra và xử lý.',
      );

      const customerTemplate = this.getOrderEmailTemplate(
        order,
        `✅ Xác nhận đơn hàng #${order.code}`,
        '🎉 Đặt hàng thành công!',
        'Cảm ơn bạn đã đặt hàng tại MIA PC. Đơn hàng của bạn đang được xử lý.',
      );

      const mailUser = this.configService.get<string>('MAIL_USER');

      // A. Gửi cho Admin
      await this.transporter.sendMail({
        from: `"MIA PC Notification" <${mailUser}>`,
        to: mailUser,
        subject: `🔔 [Admin] Đơn hàng mới #${order.code}`,
        html: adminTemplate,
      });

      // B. Gửi cho Khách hàng
      await this.transporter.sendMail({
        from: `"MIA PC Support" <${mailUser}>`,
        to: order.email,
        subject: `✅ Xác nhận đơn hàng #${order.code} - Đặt hàng thành công!`,
        html: customerTemplate,
      });
    });
  }

  // 4. Gửi Email Cập Nhật Trạng Thái
  /**
   * Gửi email thông báo khi đơn hàng thay đổi trạng thái (Xác nhận, Hoàn thành, Hủy).
   */
  sendOrderStatusNotification(order: OrderMailData, status: string): void {
    this.addToQueue(async () => {
      let subject = '';
      let title = '';
      let message = '';

      switch (status) {
        case 'CONFIRMED':
          subject = `📦 Đơn hàng #${order.code} đã được xác nhận`;
          title = '✅ Đơn hàng đã được xác nhận!';
          message =
            'Đơn hàng của bạn đã được chúng tôi xác nhận và đang tiến hành đóng gói. Chúng tôi sẽ sớm giao hàng cho đơn vị vận chuyển.';
          break;
        case 'COMPLETE':
          subject = `🎉 Đơn hàng #${order.code} đã hoàn thành`;
          title = '🎉 Đơn hàng đã hoàn thành!';
          message =
            'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã tin tưởng và mua sắm tại MIA PC. Hẹn gặp lại!';
          break;
        case 'CANCELLED':
          subject = `🚫 Đơn hàng #${order.code} đã bị hủy`;
          title = '🚫 Đơn hàng đã bị hủy';
          message =
            'Đơn hàng của bạn đã bị hủy. Nếu đây là sự nhầm lẫn, vui lòng liên hệ với chúng tôi ngay để được hỗ trợ.';
          break;
        default:
          return; // Không gửi email cho các trạng thái khác (như PENDING lại)
      }

      const emailContent = this.getOrderEmailTemplate(order, subject, title, message);
      const mailUser = this.configService.get<string>('MAIL_USER');

      await this.transporter.sendMail({
        from: `"MIA PC Support" <${mailUser}>`,
        to: order.email,
        subject: subject,
        html: emailContent,
      });
    });
  }

  // 5. Gửi Email OTP (Sudo Mode)
  sendSudoOtp(email: string, otp: string): void {
    this.addToQueue(async () => {
      const mailUser = this.configService.get<string>('MAIL_USER');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Security Code - W Four Tech</title>
          <style>
            body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            .wrapper { width: 100%; padding: 40px 0; background-color: #f8fafc; }
            .container { max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            /* Fire Element / Red Theme Header */
            .header { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 32px 40px 24px; text-align: center; }
            .logo { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; text-transform: uppercase; }
            .logo span { color: #ffffff; opacity: 0.9; }
            .subtitle { color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px; }
            
            .content { padding: 40px; text-align: center; }
            .greeting { color: #0f172a; font-size: 18px; font-weight: 600; margin: 0 0 16px; }
            .text { color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 32px; }
            
            /* OTP Box Red Theme */
            .otp-container { background: #fef2f2; border-radius: 12px; padding: 24px; margin-bottom: 20px; border: 1px dashed #fecaca; }
            .otp-code { font-family: 'SF Mono', 'Roboto Mono', Menlo, monospace; font-size: 36px; font-weight: 700; color: #dc2626; letter-spacing: 8px; display: block; line-height: 1; }
            
            /* Warning Box */
            .warning { font-size: 13px; color: #b91c1c; background-color: #fff1f2; border: 1px solid #fecaca; padding: 10px 16px; border-radius: 6px; display: inline-block; font-weight: 600; margin-bottom: 24px; }
            
            .security-note { font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0; font-style: italic; }
            .footer { background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
            .footer-text { font-size: 12px; color: #94a3b8; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1 class="logo">W Four <span>Tech</span></h1>
              </div>
              
              <div class="content">
                <h2 class="greeting">Identity Verification</h2>
                <p class="text">
                  You are requesting elevated access (OTP). 
                  Please use the verification code below to complete the process:
                </p>
                
                <div class="otp-container">
                  <span class="otp-code">${otp}</span>
                </div>
                
                <div class="warning">
                  <span style="margin-right: 8px">⚠️</span>This code is valid for 05 minutes
                </div>
                
                <p class="security-note">
                  If you did not request this code, please ignore this email or change your password immediately to protect your account.
                </p>
              </div>
              
              <div class="footer">
                <div class="footer-text">© ${new Date().getFullYear()} W Four Tech Security System</div>
                <div class="footer-text" style="margin-top: 8px">
                  <a href="https://www.wfourtech.vn/contact" target="_blank" style="color: #ef4444; text-decoration: none; margin-right: 12px;">Contact Us</a> • 
                  <a href="https://www.wfourtech.vn/privacy" target="_blank" style="color: #ef4444; text-decoration: none; margin-left: 12px;">Privacy Policy</a>
                </div>
                <div class="footer-text" style="margin-top: 8px; font-size: 11px; color: #cbd5e1;">Automated message, please do not reply.</div>
              </div>
            </div>
          </div>
        </body>
        </html>

      `;

      await this.transporter.sendMail({
        from: `"W Four Tech Security" <${mailUser}>`,
        to: email,
        subject: `[W Four Tech] Verification Code: ${otp}`,
        html,
      });
    });
  }

  private getOrderEmailTemplate(
    order: OrderMailData,
    pageTitle: string,
    headerTitle: string,
    introMessage: string,
  ): string {
    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>${pageTitle}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #0f172a; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #0f172a; padding: 20px 40px 20px; color: #ffffff; position: relative; }
        .header-top { border-bottom: 4px solid #ef4444; position: absolute; top: 0; left: 0; right: 0; }
        .logo { font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0; }
        .logo span { color: #ef4444; }
        .subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #94a3b8; font-weight: bold; margin-top: 5px; }
        .invoice-title { background-color: #ffffff; color: #0f172a; display: inline-block; padding: 8px 16px; border-radius: 0 0 0 16px; font-weight: bold; font-size: 14px; position: absolute; top: 0; right: 0; }
        .content { padding: 5px 10px; }
        .message-box { padding: 20px 15px; text-align: center; color: #334155; }
        .info-grid { display: table; width: 100%; margin-bottom: 30px; }
        .info-col { display: table-cell; width: 48%; vertical-align: top; padding: 15px; background-color: #f8fafc; border-radius: 12px; }
        .info-spacer { display: table-cell; width: 4%; }
        .label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 2px; margin-bottom: 10px; display: block; }
        .value { font-size: 14px; font-weight: bold; color: #0f172a; margin: 0; }
        .sub-value { font-size: 12px; color: #64748b; margin-top: 5px; }
        .table-container { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #0f172a; color: #ffffff; padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; }
        .product-name { font-weight: bold; color: #0f172a; display: block; }
        .product-variant { font-size: 10px; color: #ef4444; background: #fef2f2; padding: 2px 6px; border-radius: 99px; display: inline-block; margin-top: 4px; font-weight: bold; text-transform: uppercase; }
        .total-section { text-align: right; margin-top: 10px; padding-top: 10px; border-top: 2px dashed #e2e8f0; }
        .total-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #ef4444; letter-spacing: 2px; }
        .total-amount { font-size: 20px; font-weight: 900; color: #ff0000; margin-top: 5px; display: block; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
        .thank-you { font-weight: 900; text-transform: uppercase; color: #0f172a; font-size: 16px; margin-bottom: 10px; }
        .links { font-size: 10px; font-weight: bold; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; }
        .dot { color: #ef4444; margin: 0 5px; }
        a { color: #94a3b8; text-decoration: none; }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="header-top"></div>
            <div class="invoice-title">HÓA ĐƠN #${order.code}</div>
            <h1 class="logo">MIA PC<span>.</span></h1>
            <div class="subtitle">Premium Technology Solutions</div>
        </div>
        
        <div class="message-box">
             <h2 style="color: #0f172a; margin: 0 0 10px;">${headerTitle}</h2>
             <p style="margin: 0; font-size: 14px;">${introMessage}</p>
        </div>

        <div class="content">
            <div class="info-grid">
                <div class="info-col">
                    <span class="label">Khách hàng</span>
                    <p class="value">${order.email}</p>
                    <div class="sub-value">${order.phone}</div>
                </div>
                <div class="info-spacer"></div>
                <div class="info-col">
                    <span class="label">Giao đến</span>
                    <p class="value">${order.shippingAddress || 'Theo địa chỉ khách hàng'}</p>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 50%">Sản phẩm</th>
                            <th style="width: 15%; text-align: center">SL</th>
                            <th style="width: 35%; text-align: right">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.products
                          .map(
                            item => `
                        <tr>
                            <td>
                                <span class="product-name">${item.productName}</span>
                                <span class="product-variant">${item.variant.label} || Mã: ${item.productCode}</span>
                            </td>
                            <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
                            <td style="text-align: right; font-weight: bold;">
                                ${Math.round(
                                  item.variant.price.original *
                                    (1 - item.variant.price.discountPercent / 100) *
                                    item.quantity,
                                ).toLocaleString('vi-VN')}₫
                            </td>
                        </tr>
                        `,
                          )
                          .join('')}
                    </tbody>
                </table>
            </div>

            <div class="total-section">
                <div style="margin-bottom: 5px; font-size: 12px; color: #64748b; font-weight: bold;">
                  Tạm tính: <span style="color: #0f172a; float: right;">${(order.subTotal || order.totalPrice).toLocaleString('vi-VN')}₫</span>
                </div>
                ${
                  order.discountValue && order.discountValue > 0
                    ? `
                <div style="margin-bottom: 10px; font-size: 12px; color: #10b981; font-weight: bold;">
                  Mã giảm giá ${order.couponCode ? `(${order.couponCode})` : ''}: 
                  <span style="float: right;">-${order.discountValue.toLocaleString('vi-VN')}₫</span>
                </div>
                `
                    : ''
                }
                <div style="border-top: 1px solid #e2e8f0; margin-top: 10px; padding-top: 10px;">
                    <span class="total-label">Tổng thanh toán</span>
                    <span class="total-amount">${order.totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="thank-you">Cảm ơn bạn đã đồng hành cùng chúng tôi!</div>
            <div class="links">
                MIAPC.VN <span class="dot">•</span> SUPPORT@MIAPC.VN
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }
}
