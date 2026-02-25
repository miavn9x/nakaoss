// --- Thư Viện NestJS & Validator ---
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// --- DTO Chi Tiết Đa Ngôn Ngữ ---
export class PostDetailDto {
  @IsString()
  @IsNotEmpty()
  lang: string; // vi, en, zh...

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

// --- DTO Tạo Bài Viết ---
export class CreatePostDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostDetailDto)
  details: PostDetailDto[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsEnum(['PUBLIC', 'MEMBERS_ONLY'])
  @IsOptional()
  visibility?: string;

  @IsObject()
  @IsNotEmpty()
  cover: {
    mediaCode: string;
    url: string;
  };
}
