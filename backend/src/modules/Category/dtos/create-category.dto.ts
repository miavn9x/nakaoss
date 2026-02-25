import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CategoryDetailDto {
  @IsString()
  @IsNotEmpty()
  lang: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string; // Sẽ tự sinh nếu không truyền
}

export class CreateCategoryDto {
  @IsString()
  @IsOptional()
  @Matches(/^[A-Z0-9_-]+$/, {
    message: 'Code must contain only uppercase letters, numbers, underscores and hyphens',
  })
  code?: string;

  @IsString()
  @IsOptional()
  parentCode?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDetailDto)
  details: CategoryDetailDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  children?: CreateCategoryDto[];
}
