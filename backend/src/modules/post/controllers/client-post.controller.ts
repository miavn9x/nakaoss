import { Controller, Get, Param, Query, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PostService } from '../services/post.service';
import { OptionalJwtAuthGuard } from '../../../common/jwt/guards/optional-jwt.guard';
import { Request } from 'express';
import { User } from '../../users/schemas/user.schema';

@Controller('client/posts')
export class ClientPostController {
  constructor(private readonly postService: PostService) {}

  // 1. CLIENT: Lấy Danh Sách (Tối ưu)
  @Get()
  @UseInterceptors(CacheInterceptor)
  @UseGuards(OptionalJwtAuthGuard)
  @CacheTTL(300) // Cache 5 phút đồng bộ FE
  async findAll(
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search = '',
    @Query('category') category?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('isNew') isNew?: string,
    @Query('visibility') visibility?: string,
  ) {
    const user = req.user as User | undefined;

    return this.postService.findClientAll(
      +page,
      +limit,
      search,
      {
        category,
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
        isNew: isNew === 'true' ? true : isNew === 'false' ? false : undefined,
        visibility,
      },
      user,
    );
  }

  @Get(':code')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('code') code: string, @Req() req: Request) {
    const user = req.user as User | undefined;
    return this.postService.findClientOne(code, user);
  }

  // 3. CLIENT: Lấy Chi Tiết theo Slug (SEO)
  @Get('by-slug/:category/:slug')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút
  @UseGuards(OptionalJwtAuthGuard)
  async findBySlug(
    @Param('category') category: string,
    @Param('slug') slug: string,
    @Req() req: Request,
  ) {
    const user = req.user as User | undefined;
    return this.postService.findClientBySlug(category, slug, user);
  }
}
