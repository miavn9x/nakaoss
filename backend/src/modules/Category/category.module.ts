import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { RevalidationModule } from '../revalidation/revalidation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Post.name, schema: PostSchema },
    ]),
    RevalidationModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
