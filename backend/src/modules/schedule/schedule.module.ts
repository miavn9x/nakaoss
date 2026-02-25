// --- Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// --- Import Nội Bộ ---
import { ScheduleController } from './controllers/schedule.controller';
import { ScheduleService } from './services/schedule.service';
import { Schedule, ScheduleSchema } from './schemas/schedule.schema';
import { MediaModule } from '../media/media.module';
import { RevalidationModule } from '../revalidation/revalidation.module';

/**
 * Module quản lý lịch trình (Schedule)
 */
@Module({
  imports: [
    // Đăng ký Schema cho MongoDB
    MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }]),

    // Module Media để xử lý upload ảnh/file
    MediaModule,
    RevalidationModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
