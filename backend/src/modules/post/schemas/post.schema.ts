// --- Thư Viện NestJS & Mongoose ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- Định Nghĩa Document ---
export type PostDocument = Post & Document;

// --- Schema Bài Viết ---
@Schema({ timestamps: true, collection: 'posts', suppressReservedKeysWarning: true })
export class Post {
  // 1. Mã Bài Viết (Duy Nhất)
  @Prop({ required: true, unique: true })
  code: string;

  // 2. Nội Dung Đa Ngôn Ngữ (Thay thế title/desc/content cũ)
  @Prop({
    type: [
      {
        lang: { type: String, required: true }, // vi, en, zh, bo
        title: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String, default: '' },
        content: { type: String, default: '' },
      },
    ],
    default: [],
    _id: false,
  })
  details: {
    lang: string;
    title: string;
    slug: string;
    description: string;
    content: string;
  }[];

  // 3. Phân Loại & Đánh Dấu
  @Prop({ required: false, default: 'GENERAL' }) // Danh mục (VD: TIN_TUC, SU_KIEN...)
  category: string;

  @Prop({ default: false }) // Tin nổi bật (Hiện Slider)
  isFeatured: boolean;

  @Prop({ default: true }) // Tin mới (Hiện Badge New)
  isNew: boolean;

  @Prop({ type: String, required: true, default: 'PUBLIC', enum: ['PUBLIC', 'MEMBERS_ONLY'] })
  visibility: string; // PUBLIC: Ai cũng xem được, MEMBERS_ONLY: Phải đăng nhập

  // 4. Ảnh Bìa (Giữ nguyên cấu trúc Media)
  @Prop({
    required: true,
    type: {
      mediaCode: { type: String, required: true },
      url: { type: String, required: true },
    },
    _id: false,
  })
  cover: {
    mediaCode: string;
    url: string;
  };

  // 5. Timestamps
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

// --- Tạo Schema Factory ---
export const PostSchema = SchemaFactory.createForClass(Post);

// Index để truy vấn danh mục nhanh hơn
PostSchema.index({ category: 1 });
PostSchema.index({ isFeatured: -1, createdAt: -1 }); // Tối ưu Slider
PostSchema.index({ isNew: -1, createdAt: -1 }); // Tối ưu danh sách News
PostSchema.index({ visibility: 1 }); // Tối ưu lọc quyền truy cập
PostSchema.index({ 'details.slug': 1 }); // Tối ưu tìm kiếm SEO Slug
PostSchema.index({ createdAt: -1 }); // Tối ưu sắp xếp mặc định
