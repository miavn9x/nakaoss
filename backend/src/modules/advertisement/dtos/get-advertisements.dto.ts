import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAdvertisementsDto {
  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}
