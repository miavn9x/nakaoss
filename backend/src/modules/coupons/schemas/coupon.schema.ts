// --- Thư Viện NestJS & Mongoose ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- Định Nghĩa Document ---
export type CouponDocument = Coupon & Document;

/**
 * Schema MongoDB cho Collection 'coupons'
 */
@Schema({ timestamps: true, collection: 'coupons' })
export class Coupon {
  // --- Định Danh ---
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  // --- Thông Tin Cơ Bản ---
  @Prop({ required: true })
  name: string; // Tên chương trình

  @Prop({ type: String, required: true, enum: ['percent', 'fixed'], default: 'percent' })
  type: string; // Loại giảm: % hoặc tiền mặt

  @Prop({ required: true, min: 0 })
  value: number; // Giá trị giảm

  @Prop({ required: true, min: 1 })
  limit: number; // Tổng số lượng mã

  @Prop({ default: 0, min: 0 })
  used: number; // Số lượng đã dùng

  // --- Trạng Thái & Thời Gian ---
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  expiryDate?: Date; // Hạn sử dụng
}

// --- Tạo Schema Factory ---
export const CouponSchema = SchemaFactory.createForClass(Coupon);
