// --- Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// --- Import Nội Bộ ---
import { MediaController } from 'src/modules/media/controllers/media.controller';
import { MediaRepository } from 'src/modules/media/repositories/media.repository';
import { Media, MediaSchema } from 'src/modules/media/schemas/media.schema';
import { MediaService } from './services/media.service';

/**
 * Module quản lý Media (Hình ảnh, Video, File)
 */
@Module({
  imports: [
    // Đăng ký Schema MongoDB
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [MediaRepository, MediaService],
})
export class MediaModule {}
