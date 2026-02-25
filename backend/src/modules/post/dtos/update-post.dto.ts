import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

// --- DTO Cập Nhật Bài Viết ---
export class UpdatePostDto extends PartialType(CreatePostDto) {}
