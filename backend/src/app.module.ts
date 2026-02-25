// --- Thư Viện Bên Ngoài ---
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from './common/jwt/jwt.module';

// --- Module Nội Bộ ---
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { UsersModule } from './modules/users/user.module';
import { MediaModule } from './modules/media/media.module';
import { CouponModule } from './modules/coupons/coupon.module';
import { AdvertisementModule } from './modules/advertisement/advertisement.module';
import { BannerModule } from './modules/banner/banner.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { MailModule } from './modules/mail/mail.module';
import { CategoryModule } from './modules/Category/category.module';
import { BackupModule } from './modules/backup/backup.module';
import { LicenseModule } from './modules/license/license.module';

@Module({
  imports: [
    // 1. Cấu Hình Cache (Đồng bộ FE: 5 phút)
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 300 giây = 5 phút
      max: 1000, // Tăng lên 1000 mục để chứa đủ content
    }),

    // 2. Global Rate Limiting (100 req/min)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // 3. File Tĩnh (Uploads)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // 4. Biến Môi Trường (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 5. Cơ Sở Dữ Liệu (MongoDB) - Config Retry để tránh crash khi mất mạng
    MongooseModule.forRoot(process.env.MONGO_URI || '', {
      serverSelectionTimeoutMS: 5000,
      retryAttempts: 3,
      retryDelay: 1000,
    }),

    // 6. Xác Thực (JWT)
    JwtModule,

    // 7. Module Chức Năng
    AuthModule,
    UsersModule,
    PostModule,
    MediaModule,
    CouponModule,
    AdvertisementModule,
    BannerModule,
    ScheduleModule,
    MailModule,

    CategoryModule,
    BackupModule,
    LicenseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
