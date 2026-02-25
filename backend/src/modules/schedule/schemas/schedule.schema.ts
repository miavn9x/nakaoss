// --- Thư Viện NestJS & Mongoose ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduleDocument = Schedule & Document;

/**
 * Schema MongoDB cho Collection 'schedules'
 */
@Schema({ timestamps: true, collection: 'schedules' })
export class Schedule {
  // --- Mã Lịch (Duy nhất) ---
  @Prop({ required: true, unique: true })
  code: string;

  // --- Chi Tiết (Đa Ngôn Ngữ) ---
  @Prop({
    type: [
      {
        lang: { type: String, required: true },
        title: { type: String, default: '' },
        content: { type: String, default: '' },
      },
    ],
    default: [],
  })
  details: { lang: string; title: string; content: string }[];

  // --- Timestamps ---
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

// --- Tạo Schema Factory ---
export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

// Tối ưu truy vấn lịch qua mã
