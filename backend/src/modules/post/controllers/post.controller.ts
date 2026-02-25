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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';

// --- Import Nội Bộ ---
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PostService } from '../services/post.service';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { OptionalJwtAuthGuard } from '../../../common/jwt/guards/optional-jwt.guard'; // Import Guard Mới
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';
import { User } from '../../users/schemas/user.schema';

// --- Controller Bài Viết ---
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 1. API: Tạo Bài Viết
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  // 2. API: Cập Nhật Bài Viết
  @Patch(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('code') code: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(code, dto);
  }

  // 3. API: Lấy Danh Sách (Có Cache, Có Bộ Lọc)
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(120) // Cache 2 phút
  async findAll(@Query() query: GetPostsDto) {
    return this.postService.findAll(query.page || 1, query.limit || 50, query.search || '', {
      category: query.category,
      isFeatured: query.isFeatured,
      isNew: query.isNew,
      visibility: query.visibility,
    });
  }

  // 4. API: Lấy Chi Tiết (Bảo mật: Tự động kiểm tra khách/thành viên)
  @Get(':code')
  @UseGuards(OptionalJwtAuthGuard) // Guard này sẽ gán req.user nếu có token
  async findOne(@Param('code') code: string, @Req() req: Request) {
    const user = req.user as User | undefined;
    return this.postService.findOne(code, user);
  }

  // 5. API: Xóa Bài Viết
  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('code') code: string) {
    return this.postService.delete(code);
  }
}
