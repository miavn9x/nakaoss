import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  // 1. Mã Danh Mục (Duy Nhất - ID)
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code: string;

  // 2. Mã Danh Mục Cha (Để tạo cây)
  @Prop({ default: null, uppercase: true, trim: true })
  parentCode: string;

  // 3. Thứ tự hiển thị
  @Prop({ default: 0 })
  order: number;

  // 4. Trạng thái hiển thị
  @Prop({ default: true })
  isActive: boolean;

  // 5. Nội Dung Đa Ngôn Ngữ
  @Prop({
    type: [
      {
        lang: { type: String, required: true }, // vi, en, cn, bo
        name: { type: String, required: true },
        slug: { type: String, required: true },
      },
    ],
    default: [],
    _id: false,
  })
  details: {
    lang: string;
    name: string;
    slug: string; // URL Friendly
  }[];

  // 6. Children (Nested Structure)
  @Prop({ type: Array, default: [] })
  children: Category[];

  // Timestamps
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ parentCode: 1, order: 1 });
CategorySchema.index({ 'children.code': 1 });
CategorySchema.index({ 'children.children.code': 1 });
CategorySchema.index({ 'details.slug': 1 }); // Xếp hạng theo URL
