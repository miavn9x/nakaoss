// --- Import Thư Viện ---
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * DTO Đăng Ký
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  password: string;

  @IsNotEmpty({ message: 'Captcha ID không được để trống' })
  captchaId: string;

  @IsNotEmpty({ message: 'Mã xác nhận không được để trống' })
  captchaCode: string;

  @IsNotEmpty({ message: 'Họ không được để trống' })
  lastName: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  firstName: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  address?: string;
}
