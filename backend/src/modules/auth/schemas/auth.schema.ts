// --- Import Thư Viện NestJS ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// --- Import Validator ---
import { IsEmailValidator } from 'src/common/validators/is-email.validator';

// --- Định Nghĩa Interface Cho Phiên Đăng Nhập ---
export type AuthSessionDocument = AuthSession & Document;

/**
 * Schema MongoDB cho Collection 'auth_sessions'
 * Lưu trữ thông tin phiên đăng nhập để quản lý Access/Refresh Token
 */
@Schema({
  timestamps: true,
  collection: 'auth_sessions',
})
export class AuthSession {
  // --- Định Danh ---
  @Prop({ required: true, unique: true })
  sessionId: string; // Mã định danh duy nhất của phiên

  // --- Thông Tin Người Dùng ---
  @Prop({ required: true, validate: IsEmailValidator })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // --- Token Xác Thực ---
  @Prop({ required: true, unique: true })
  refreshToken: string;

  // --- Thông Tin Thiết Bị & Bảo Mật ---
  @Prop({ required: false })
  ipAddress: string;

  @Prop({ required: false })
  userAgent: string;

  // --- Thông Tin Chi Tiết (Device Fingerprint) ---
  @Prop({ type: Object })
  device?: Record<string, any>;

  @Prop({ type: Object })
  os?: Record<string, any>;

  @Prop({ type: Object })
  browser?: Record<string, any>;

  // --- Thời Gian & Trạng Thái ---
  @Prop({ required: true })
  loginAt: Date; // Thời điểm đăng nhập

  @Prop()
  lastRefreshedAt: Date; // Thời điểm refresh token lần cuối

  @Prop({ default: false })
  isExpired: boolean; // Trạng thái hết hạn

  @Prop({ required: true })
  expiresAt: Date; // Thời điểm hết hạn của phiên
}

// --- Tạo Schema Factory ---
export const AuthSessionSchema = SchemaFactory.createForClass(AuthSession);
