// --- Import Thư Viện NestJS ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- Định Nghĩa Interface ---
export type AccountLockDocument = AccountLock & Document;

// --- Định Nghĩa Lock Reason ---
export enum LockReason {
  CAPTCHA = 'CAPTCHA',
  PASSWORD = 'PASSWORD',
  SUDO = 'SUDO',
}

/**
 * Schema MongoDB cho Collection 'account_locks'
 * Quản lý việc khóa tài khoản tạm thời khi đăng nhập sai nhiều lần
 */
@Schema({ timestamps: true, collection: 'account_locks' })
export class AccountLock {
  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true, index: true })
  ipAddress: string;

  @Prop({ required: true, enum: Object.values(LockReason), type: String })
  lockReason: LockReason;

  // Số lần bị lock (để tính thời gian khóa tăng dần)
  @Prop({ required: true, default: 0 })
  lockCount: number;

  // Số lần sai hiện tại (reset về 0 khi login thành công)
  @Prop({ required: true, default: 0 })
  attemptCount: number;

  // Thời điểm được mở khóa
  @Prop({ required: true })
  lockUntil: Date;

  // Trạng thái đã mở khóa
  @Prop({ default: false })
  isUnlocked: boolean;

  @Prop()
  unlockedAt?: Date;

  @Prop()
  lastAttemptAt?: Date;
}

// --- Tạo Schema Factory ---
export const AccountLockSchema = SchemaFactory.createForClass(AccountLock);

// --- Tạo Index để tìm kiếm nhanh ---
AccountLockSchema.index({ email: 1, ipAddress: 1, lockReason: 1 });

// --- TTL Index: Tự động xóa records sau 30 ngày ---
AccountLockSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
