// --- Module NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from 'src/common/jwt/jwt.module';
import { MailModule } from '../mail/mail.module';

// --- Schema ---
import { User, UserSchema } from './schemas/user.schema';

// --- Controller ---
import { UsersController } from './controllers/user.controller';

// --- Service & Repositories ---
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/user.service';

/**
 * Module quản lý Người dùng (Users).
 * Bao gồm: Controller, Service, Repository và Schema.
 */
@Module({
  imports: [
    // Đăng ký Schema cho MongoDB
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // Modules phụ thuộc
    JwtModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService], // Export nếu module khác cần dùng
})
export class UsersModule {}
