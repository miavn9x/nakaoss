import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BannerType {
  MAIN = 'MAIN',
  SUB = 'SUB',
}

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  buttonText: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  imageMediaCode?: string; // MediaCode for efficient image deletion

  @Prop()
  link: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ type: String, required: true, enum: BannerType, default: BannerType.MAIN })
  type: BannerType;

  // Add color prop based on frontend usage (e.g. "from-blue-900 to-purple-900")
  @Prop()
  color: string;

  @Prop()
  titleColor: string;

  @Prop({ type: Object, default: { top: 60, left: 10 } })
  buttonPos: { top: number; left: number };

  @Prop()
  buttonSize: number;

  @Prop()
  buttonColor: string;

  @Prop()
  buttonTextColor: string;
  @Prop({ default: true })
  showTitle: boolean;

  @Prop({ default: true })
  showButton: boolean;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);

// Tối ưu truy vấn hiển thị Banner
BannerSchema.index({ isVisible: 1, type: 1, order: 1 });
