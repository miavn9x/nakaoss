// --- Thư Viện NestJS ---
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

// --- Import Nội Bộ ---
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { CreateBannerDto } from '../dtos/create-banner.dto';
import { UpdateBannerDto } from '../dtos/update-banner.dto';
import { BannerService } from '../services/banner.service';
import { UserRole } from '../../users/constants/user-role.enum';

// --- Controller Banner (Quảng Cáo) ---
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  // 1. API: Tạo Banner Mới (Admin)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannerService.create(createBannerDto);
  }

  // 2. API: Lấy Danh Sách (Admin - Toàn bộ)
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.bannerService.findAllAdmin();
  }

  // 3. API: Lấy Danh Sách (Public - Chỉ hiện banner Active)
  @Get('public')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút đồng bộ FE
  findAllPublic() {
    return this.bannerService.findAllPublic();
  }

  // 4. API: Chi Tiết Banner (Theo Code)
  @Get(':code')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút đồng bộ FE
  findOne(@Param('code') code: string) {
    return this.bannerService.findOne(code);
  }

  // 5. API: Cập Nhật Banner (Admin)
  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('code') code: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(code, updateBannerDto);
  }

  // 6. API: Xóa Banner (Admin)
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('code') code: string) {
    return this.bannerService.remove(code);
  }
}
