import { LockReason } from '../schemas/account-lock.schema';

/**
 * DTO Phản hồi của API Xác thực
 */
export class AuthResponse {
  // Access Token & Refresh Token
  accessToken?: string;
  refreshToken?: string;

  // Cờ báo hiệu client nên xóa cookie cũ
  shouldClearCookie?: boolean;

  // Thông tin khóa tài khoản (nếu có lỗi đăng nhập nhiều lần)
  lockUntil?: number; // Timestamp hết khóa
  lockReason?: LockReason; // Lý do khóa
  lockCount?: number;

  // Thông tin người dùng (khi đăng nhập thành công)
  user?: any;
}
