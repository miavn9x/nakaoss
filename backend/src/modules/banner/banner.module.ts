// --- Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// --- Import Nội Bộ ---
import { BannerController } from './controllers/banner.controller';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { BannerService } from './services/banner.service';
import { MediaModule } from '../media/media.module';
import { RevalidationModule } from '../revalidation/revalidation.module';

// --- Module Banner ---
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Banner.name, schema: BannerSchema }]),
    MediaModule,
    RevalidationModule,
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
