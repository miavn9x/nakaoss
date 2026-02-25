import { IsBoolean, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  @IsNumber()
  @Min(1)
  limit?: number = 50;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsString()
  visibility?: string;
}
