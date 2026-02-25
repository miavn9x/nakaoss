// --- Thư Viện NestJS ---
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

// --- Import Nội Bộ ---
import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { UpdateScheduleDto } from '../dtos/update-schedule.dto';
import { ScheduleService } from '../services/schedule.service';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * Tạo lịch mới
   * Yêu cầu: Admin
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  /**
   * Cập nhật lịch theo mã (code)
   * Yêu cầu: Admin
   */
  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('code') code: string, @Body() dto: UpdateScheduleDto) {
    return this.scheduleService.update(code, dto);
  }

  /**
   * Lấy danh sách lịch (Có phân trang và tìm kiếm)
   * Cache: 120 giây
   */
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút đồng bộ FE
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '50',
    @Query('search') search = '',
  ) {
    return this.scheduleService.findAll(+page, +limit, search);
  }

  /**
   * Lấy chi tiết lịch theo mã
   */
  @Get(':code')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút đồng bộ FE
  async findOne(@Param('code') code: string) {
    return this.scheduleService.findOne(code);
  }

  /**
   * Xóa lịch theo mã
   * Yêu cầu: Admin
   */
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('code') code: string) {
    return this.scheduleService.delete(code);
  }
}
