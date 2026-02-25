import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO cho việc cập nhật thông tin người dùng
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
