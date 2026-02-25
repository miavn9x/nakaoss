// --- Thư Viện NestJS & Mongoose ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MediaMimeTypeEnum } from 'src/modules/media/enums/media-mime-type.enum';
import { MediaStorageTypeEnum } from 'src/modules/media/enums/media-storage-type.enum';
import { MediaUsageEnum } from 'src/modules/media/enums/media-usage.enum';
import { MediaExtensionEnum } from '../enums/media-extension.enum';

/**
 * Schema MongoDB cho Collection 'medias'
 */
@Schema({ versionKey: false, timestamps: true, collection: 'medias' })
export class Media {
  // --- Định Danh ---
  @Prop({ required: true, unique: true })
  mediaCode: string; // Mã code duy nhất

  @Prop({ required: true })
  originalName: string; // Tên file gốc

  @Prop({ required: true, unique: true })
  slug: string; // Slug định danh

  @Prop({ type: String, enum: MediaUsageEnum, required: true })
  usage: MediaUsageEnum; // Mục đích sử dụng

  // --- Nội Dung & Định Dạng ---
  @Prop({ enum: ['image', 'video'], required: true })
  type: 'image' | 'video';

  @Prop({ type: String, enum: MediaMimeTypeEnum, required: true })
  mimeType: MediaMimeTypeEnum;

  @Prop({ type: String, enum: MediaExtensionEnum, required: true })
  extension: MediaExtensionEnum;

  @Prop({ required: true })
  size: number; // Bytes

  @Prop({ type: Number, default: null })
  width: number | null;

  @Prop({ type: Number, default: null })
  height: number | null;

  // --- Lưu Trữ ---
  @Prop({ required: true })
  url: string; // Đường dẫn file

  @Prop({ type: String, enum: MediaStorageTypeEnum, required: true })
  storageType: MediaStorageTypeEnum;

  // --- Trạng Thái ---
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  // --- Timestamps ---
  createdAt: Date;
  updatedAt: Date;
}

export type MediaDocument = Media & Document;
export const MediaSchema = SchemaFactory.createForClass(Media);

// --- Indexing ---
MediaSchema.index({ type: 1 });
MediaSchema.index({ usage: 1 });
MediaSchema.index({ storageType: 1 });
MediaSchema.index({ isDeleted: 1, isActive: 1 });
MediaSchema.index({ createdAt: -1 });
