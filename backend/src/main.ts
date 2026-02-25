// --- Import Core Modules ---
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import sanitize from 'mongo-sanitize';

// --- Import App Configs ---
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { MulterExceptionFilter } from './common/filters/multer-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { validateEnv } from './configs/check-env.config';
async function bootstrap() {
  console.log('🚀 Đang khởi động hệ thống...');

  // 1. Validate Env
  validateEnv();

  // 2. Init NestJS App
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 3. Security & Performance
  app.use(compression()); // Nén dữ liệu JSON (Gzip) giúp tải nhanh hơn
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: ["'self'", 'https:', 'wss:'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(hpp()); // Chống HTTP Parameter Pollution (D35)

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Fix: sanitize modifies object in-place. Reassignment causes TypeError on readonly props (like req.query)
    sanitize(req.body);
    sanitize(req.query);
    sanitize(req.params);
    next();
  });

  // 4. Middlewares
  app.use(cookieParser()); // Đọc HttpOnly Cookie (RefreshToken)
  // app.set('trust proxy', true); // ⚠️ BẢO MẬT: Chỉ bật khi có Nginx/Proxy tin cậy và cấu hình đúng IP (ví dụ: 'loopback')
  // Hiện tại tắt để chống IP Spoofing (D27 trong Security Audit)

  // Tăng giới hạn Body Parser cho upload file lớn
  const bodyParser = await import('body-parser');
  app.use(bodyParser.json({ limit: '20mb' })); // 20MB là quá đủ cho 1 cuốn sách (Text only). Chống DOS 500MB.
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  // 5. Dynamic CORS (Quan trọng)
  app.enableCors({
    origin: (requestOrigin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://demobanhtrang.wfourtech.vn',
        'https://miavn9x.id.vn',
        'https://83xqq1xp-3000.asse.devtunnels.ms',
      ];

      // a. Cho phép Non-Browser (Postman, Mobile, Server-to-Server)
      if (!requestOrigin) return callback(null, true);

      // b. Cho phép Whitelist
      if (allowedOrigins.includes(requestOrigin)) return callback(null, true);

      // c. Kiểm tra Patterns cho Localhost/LAN (Chặn Reflection bừa bãi)
      const isLocal =
        /^http:\/\/localhost(:\d+)?$/.test(requestOrigin) ||
        /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(requestOrigin) ||
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(requestOrigin);

      if (isLocal && process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // d. Chặn mọi Origin lạ khác (Trả về false để trình duyệt chặn mà không làm log server bị clutter)
      return callback(null, false);
    },
    credentials: true,
  });

  // 6. Global Configs
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new MulterExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ field không có trong DTO (Chống NoSQL Injection)
      transform: true, // Tự động chuyển đổi kiểu dữ liệu (Query Params)
      forbidNonWhitelisted: true, // Báo lỗi nếu gửi field lại
    }),
  );

  // 7. Start Server
  const port = process.env.PORT;
  if (!port) {
    console.error('❌ LỖI: Thiếu biến môi trường PORT!');
    process.exit(1);
  }

  await app.listen(4000, '0.0.0.0');
  console.log(`✅ Server sẵn sàng tại: http://localhost:${port}`);
}

void bootstrap();
