// --- Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// --- Import Nội Bộ ---
import { CouponController } from './controllers/coupon.controller';
import { CouponService } from './services/coupon.service';
import { Coupon, CouponSchema } from './schemas/coupon.schema';

/**
 * Module quản lý Mã Giảm Giá (Coupon)
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
