// --- Thư Viện NestJS & Mongoose ---
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';

// --- Import Nội Bộ ---
import { Coupon, CouponDocument } from '../schemas/coupon.schema';
import { CreateCouponDto } from '../dtos/create-coupon.dto';
import { UpdateCouponDto } from '../dtos/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  /**
   * Tạo mã giảm giá mới
   * Nếu không nhập code, hệ thống tự sinh mã
   */
  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const dto = createCouponDto;

    // Tự sinh mã nếu không cung cấp
    if (!dto.code) {
      dto.code = this.generateCouponCode();
    }

    // Kiểm tra trùng lặp mã
    const existing = await this.couponModel.findOne({ code: dto.code });
    if (existing) {
      throw new BadRequestException('Mã giảm giá đã tồn tại');
    }

    const createdCoupon = new this.couponModel(dto);
    return createdCoupon.save();
  }

  /**
   * Lấy danh sách mã giảm giá (Mới nhất trước)
   */
  async findAll(): Promise<Coupon[]> {
    return this.couponModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * Lấy chi tiết mã giảm giá theo ID
   */
  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  /**
   * Tìm mã giảm giá theo Code (Dùng cho Checkout)
   */
  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() }).exec();
    if (!coupon) {
      throw new NotFoundException(`Mã giảm giá không tồn tại`);
    }
    return coupon;
  }

  /**
   * Cập nhật thông tin mã giảm giá
   */
  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const update = updateCouponDto as UpdateQuery<CouponDocument>;
    const existing = await this.couponModel.findByIdAndUpdate(id, update, { new: true });
    if (!existing) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return existing;
  }

  /**
   * Xóa mã giảm giá
   */
  async remove(id: string): Promise<void> {
    const result = await this.couponModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
  }

  /**
   * Helper: Sinh mã code ngẫu nhiên (Prefix: KM)
   */
  private generateCouponCode(length = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `KM${result}`;
  }
}
