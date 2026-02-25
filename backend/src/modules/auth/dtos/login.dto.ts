// --- Import Thư Viện ---
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO Đăng Nhập
 */
export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  password: string;

  @IsNotEmpty({ message: 'Mã xác nhận không được bỏ trống' })
  captchaCode: string;

  @IsNotEmpty({ message: 'Captcha ID không được bỏ trống' })
  captchaId: string;
}
