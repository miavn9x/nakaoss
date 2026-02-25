import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AdvertisementService } from '../services/advertisement.service';
import { CreateAdvertisementDto } from '../dtos/create-advertisement.dto';
import { UpdateAdvertisementDto } from '../dtos/update-advertisement.dto';
import { GetAdvertisementsDto } from '../dtos/get-advertisements.dto';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

/**
 * Controller quản lý Quảng Cáo (Banner)
 */
@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly adService: AdvertisementService) {}

  /**
   * Tạo mới quảng cáo (Yêu cầu quyền Admin)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateAdvertisementDto) {
    return this.adService.create(dto);
  }

  /**
   * Lấy danh sách quảng cáo (Public)
   * Hỗ trợ lọc theo vị trí và trạng thái kích hoạt
   */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút đồng bộ FE
  async findAll(@Query() query: GetAdvertisementsDto) {
    return this.adService.findAll(query);
  }

  /**
   * Lấy chi tiết quảng cáo theo mã (Public)
   */
  @Get(':code')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút đồng bộ FE
  async findOne(@Param('code') code: string) {
    return this.adService.findOne(code);
  }

  /**
   * Cập nhật thông tin quảng cáo (Yêu cầu quyền Admin)
   */
  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('code') code: string, @Body() dto: UpdateAdvertisementDto) {
    return this.adService.update(code, dto);
  }

  /**
   * Xóa quảng cáo (Yêu cầu quyền Admin)
   */
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('code') code: string) {
    return this.adService.delete(code);
  }
}
