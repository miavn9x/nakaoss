import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';

/**
 * DTO Cập Nhật Mã Giảm Giá (Kế thừa từ CreateCouponDto)
 */
export class UpdateCouponDto extends PartialType(CreateCouponDto) {}
