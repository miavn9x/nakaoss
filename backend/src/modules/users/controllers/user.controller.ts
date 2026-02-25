// --- Thư Viện NestJS ---
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express'; // Bổ sung import Request
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt.guard';
import { SensitiveActionGuard } from 'src/modules/auth/guards/sensitive-action.guard';

// --- Import Nội Bộ ---
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { StandardResponse } from 'src/common/interfaces/response.interface';
import { JwtPayload } from 'src/common/jwt/types/jwt.type';
import { UserErrorCode } from 'src/modules/users/constants/user-error-code.enum';
import { UserRole } from '../constants/user-role.enum';

import { User } from '../schemas/user.schema';
import { UsersService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';

// --- Controller Người Dùng ---
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * lấy thông tin hồ sơ cá nhân (Profile)
   * Yêu cầu: Đăng nhập (Token)
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: JwtPayload): Promise<StandardResponse<User>> {
    try {
      const result = await this.usersService.findById(user.sub);

      if (!result.data) {
        return {
          message: 'Người dùng không tồn tại',
          data: null,
          errorCode: UserErrorCode.USER_NOT_FOUND,
        };
      }

      return {
        message: 'Lấy thông tin người dùng thành công',
        data: result.data,
        errorCode: null,
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'UnauthorizedError') {
        return {
          message: 'Không được phép truy cập',
          data: null,
          errorCode: UserErrorCode.UNAUTHORIZED,
        };
      }

      return {
        message: 'Người dùng không tồn tại',
        data: null,
        errorCode: UserErrorCode.USER_NOT_FOUND,
      };
    }
  }

  /**
   * Cập nhật thông tin cá nhân
   * Yêu cầu: Đăng nhập
   */
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
  ): Promise<StandardResponse<User>> {
    return this.usersService.updateProfile(user.sub, dto);
  }

  /**
   * Lấy danh sách tất cả người dùng
   * Yêu cầu: Admin
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
  ): Promise<StandardResponse<any>> {
    return this.usersService.findAll(+page, +limit, search);
  }

  /**
   * Thăng cấp quyền người dùng
   * Yêu cầu: Admin + Sudo Mode (Mật khẩu cấp 2)
   */
  @UseGuards(JwtAuthGuard, RolesGuard, SensitiveActionGuard)
  @Roles(UserRole.ADMIN)
  @Post('promote')
  async promoteUser(
    @Query('userId') userId: string,
    @Body('role') role: string,
    @Req() req: Request,
  ): Promise<StandardResponse<null>> {
    const origin = req.get('Origin');
    return this.usersService.promoteUser(userId, role, origin);
  }

  /**
   * Xác nhận thay đổi quyền qua Email
   * Public API (Người dùng click link từ email)
   */
  @Post('verify-role')
  async verifyRole(
    @Query('userId') userId: string,
    @Query('token') token: string,
  ): Promise<StandardResponse<null>> {
    // Chống NoSQL Injection: Ép kiểu và kiểm tra tính hợp lệ
    if (typeof userId !== 'string' || typeof token !== 'string') {
      throw new BadRequestException('Tham số không hợp lệ');
    }
    return this.usersService.verifyRoleChange(userId, token);
  }
}
