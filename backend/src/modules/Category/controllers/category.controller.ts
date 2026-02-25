import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { JwtAuthGuard } from '../../../common/jwt/guards/jwt.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/constants/user-role.enum';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get('tree')
  getTree(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.categoryService.getTree(Number(page), Number(limit));
  }

  @Get('tree-full')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // Cache 5 phút
  getTreeFull() {
    return this.categoryService.getTreeFull();
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.categoryService.findOne(code);
  }

  @Put(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('code') code: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(code, dto);
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('code') code: string) {
    return this.categoryService.delete(code);
  }
}
