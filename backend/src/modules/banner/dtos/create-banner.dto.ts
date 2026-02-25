import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { BannerType } from '../schemas/banner.schema';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  buttonText?: string;

  @IsString()
  @IsUrl() // Validate as URL if possible, or just IsString if relative path
  imageUrl: string;

  @IsString()
  @IsOptional()
  imageMediaCode?: string; // MediaCode for efficient deletion

  @IsString()
  @IsOptional()
  link?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @IsEnum(BannerType)
  @IsOptional()
  type?: BannerType;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  titleColor?: string;

  @IsOptional()
  buttonPos?: { top: number; left: number };

  @IsNumber()
  @IsOptional()
  buttonSize?: number;

  @IsString()
  @IsOptional()
  buttonColor?: string;

  @IsString()
  @IsOptional()
  buttonTextColor?: string;
  @IsBoolean()
  @IsOptional()
  showTitle?: boolean;

  @IsBoolean()
  @IsOptional()
  showButton?: boolean;
}
