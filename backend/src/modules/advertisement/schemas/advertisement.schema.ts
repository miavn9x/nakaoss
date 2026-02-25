import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AdvertisementPosition } from '../enums/advertisement-position.enum';

export type AdvertisementDocument = Advertisement & Document;

/**
 * Schema MongoDB cho Collection 'advertisements'
 * Quản lý banner quảng cáo và vị trí hiển thị
 */
@Schema({
  timestamps: true,
  collection: 'advertisements',
})
export class Advertisement {
  // --- Định Danh ---
  @Prop({ required: true, unique: true })
  code: string; // Mã định danh banner (VD: ADV123456)

  // --- Thông Tin Hiển Thị ---
  @Prop({ required: true })
  title: string; // Tiêu đề nội bộ để quản lý

  @Prop({ type: String, enum: AdvertisementPosition, required: true })
  position: AdvertisementPosition; // Vị trí hiển thị (Left, Right, Popup)

  @Prop({
    required: true,
    type: {
      mediaCode: { type: String, required: true },
      url: { type: String, required: true },
    },
    _id: false,
  })
  media: {
    mediaCode: string;
    url: string;
  }; // Thông tin hình ảnh/video

  @Prop({ default: '' })
  link: string; // Đường dẫn khi người dùng click vào

  // --- Cấu Hình Hiển Thị ---
  @Prop({ default: true })
  isActive: boolean; // Trạng thái kích hoạt

  @Prop({ default: 0 })
  priority: number; // Độ ưu tiên (số lớn hiển thị trước)

  @Prop({ type: Number, required: false })
  width?: number; // Chiều rộng cố định (px)

  @Prop({ type: Number, required: false })
  height?: number; // Chiều cao cố định (px)

  // --- Cấu Hình Vị Trí (Chỉ cho Left/Right Banner) ---
  @Prop({ type: Number, required: false, default: 47 })
  offsetPercent?: number; // Khoảng cách từ giữa màn hình ra (%)

  @Prop({ type: Number, required: false, default: 50 })
  offsetTop?: number; // Khoảng cách từ trên xuống (px/%)
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);

// Index để tối ưu query active ads theo vị trí
AdvertisementSchema.index({ position: 1, isActive: 1, priority: -1 });
