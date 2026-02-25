import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertisement, AdvertisementSchema } from './schemas/advertisement.schema';
import { AdvertisementController } from './controllers/advertisement.controller';
import { AdvertisementService } from './services/advertisement.service';
import { RevalidationModule } from '../revalidation/revalidation.module';

/**
 * Module quản lý Quảng Cáo
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Advertisement.name, schema: AdvertisementSchema }]),
    RevalidationModule,
  ],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  exports: [AdvertisementService],
})
export class AdvertisementModule {}
