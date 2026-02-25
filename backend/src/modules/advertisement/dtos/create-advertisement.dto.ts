import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdvertisementPosition } from '../enums/advertisement-position.enum';

/**
 * Validates embedded media object
 */
class MediaDto {
  @IsString()
  @IsNotEmpty()
  mediaCode: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

/**
 * DTO tạo mới quảng cáo
 */
export class CreateAdvertisementDto {
  @IsString()
  @IsNotEmpty()
  title: string; // Tiêu đề quảng cáo

  @IsEnum(AdvertisementPosition)
  @IsNotEmpty()
  position: AdvertisementPosition; // Vị trí hiển thị

  @IsObject()
  @ValidateNested()
  @Type(() => MediaDto)
  media: MediaDto; // Thông tin media (ảnh/video)

  @IsString()
  @IsOptional()
  link?: string; // Liên kết khi click vào

  @IsBoolean()
  @IsOptional()
  isActive?: boolean; // Trạng thái kích hoạt

  @IsNumber()
  @IsOptional()
  priority?: number; // Độ ưu tiên hiển thị

  @IsNumber()
  @IsOptional()
  width?: number; // Chiều rộng (px)

  @IsNumber()
  @IsOptional()
  height?: number; // Chiều cao (px)

  @IsNumber()
  @IsOptional()
  offsetPercent?: number; // Vị trí % (nếu cần)

  @IsNumber()
  @IsOptional()
  offsetTop?: number; // Khoảng cách từ trên xuống (px)
}
