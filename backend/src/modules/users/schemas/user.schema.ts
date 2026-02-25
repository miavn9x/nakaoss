// --- Thư Viện NestJS & Mongoose ---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- Enum & Hằng Số ---
import { UserRole } from '../constants/user-role.enum';

export type UserDocument = User & Document;

/**
 * Schema MongoDB cho Collection 'users'
 */
@Schema({ timestamps: true, collection: 'users' })
export class User {
  // --- Phân Quyền ---
  @Prop({ type: [String], enum: UserRole, default: [UserRole.USER], index: true })
  roles: UserRole[];

  // --- Thông Tin Cơ Bản ---
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  // --- Thông Tin Đăng Nhập ---
  @Prop({ default: null })
  lastLoginAt: Date;

  @Prop({ required: false })
  registrationIp: string;

  @Prop({ required: false })
  registrationUserAgent: string;

  // --- Bảo Mật (Ẩn Password) ---
  @Prop({ required: true, select: false })
  password: string;

  // --- Xác Thực Nâng Cấp Quyền (Pending Role) ---
  @Prop({ default: null })
  pendingRole: string;

  @Prop({ default: null, select: false })
  roleChangeToken: string;

  @Prop({ default: null })
  roleChangeExpires: Date;

  // --- Timestamps ---
  createdAt: Date;
  updatedAt: Date;
}

// --- Tạo Schema Factory ---
export const UserSchema = SchemaFactory.createForClass(User);
