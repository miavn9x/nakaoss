// --- Thư Viện NestJS ---
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';

// --- Import Nội Bộ ---
import { CouponService } from '../services/coupon.service';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { UpdateCouponDto } from '../dtos/update-coupon.dto';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  /**
   * Tạo mã giảm giá mới
   * Yêu cầu: Admin
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  /**
   * Lấy tất cả mã giảm giá
   * Yêu cầu: Admin
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.couponService.findAll();
  }

  /**
   * Tìm mã giảm giá theo code (Public)
   * Sử dụng khi khách hàng nhập mã tại trang checkout
   */
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.couponService.findByCode(code);
  }

  /**
   * Xem chi tiết mã giảm giá theo ID
   * Yêu cầu: Admin
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  /**
   * Cập nhật mã giảm giá
   * Yêu cầu: Admin
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  /**
   * Xóa mã giảm giá
   * Yêu cầu: Admin
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
