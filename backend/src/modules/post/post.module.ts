// --- Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

// --- Import Nội Bộ ---
import { PostController } from './controllers/post.controller';
import { ClientPostController } from './controllers/client-post.controller';
import { PostService } from './services/post.service';
import { Post, PostSchema } from './schemas/post.schema';
import { MediaModule } from '../media/media.module';
import { CategoryModule } from '../Category/category.module';
import { RevalidationModule } from '../revalidation/revalidation.module';

// --- Module Bài Viết ---
@Module({
  imports: [
    // 1. Schema MongoDB
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),

    // 2. Cấu Hình Cache
    CacheModule.register(),

    // 3. Module Liên Quan
    MediaModule,
    CategoryModule,
    RevalidationModule,
  ],
  controllers: [PostController, ClientPostController],
  providers: [PostService],
})
export class PostModule {}
