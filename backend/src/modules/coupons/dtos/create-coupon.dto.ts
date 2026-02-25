// --- Thư Viện Validator ---
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';

/**
 * DTO Tạo Mã Giảm Giá
 */
export class CreateCouponDto {
  @IsString()
  @IsOptional()
  code?: string; // Tùy chọn, nếu không có sẽ tự sinh

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  type: string; // 'percent' hoặc 'fixed'

  @IsNumber()
  @IsOptional()
  minOrderValue?: number;

  @IsNumber()
  @IsOptional()
  maxDiscount?: number;

  @IsNumber()
  @IsOptional()
  usageLimit?: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
