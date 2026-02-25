// --- Import Thư Viện NestJS ---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

// --- Import Module Nội Bộ ---
import { JwtModule } from '../../common/jwt/jwt.module';
import { MailModule } from '../mail/mail.module';

// --- Import Schema ---
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthSession, AuthSessionSchema } from './schemas/auth.schema';
import { AccountLock, AccountLockSchema } from './schemas/account-lock.schema';

// --- Import Controller ---
import { AuthController } from 'src/modules/auth/controllers/auth.controller';

// --- Import Repository & Service ---
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { AuthThrottlerService } from './services/auth-throttler.service';
import { JwtStrategy } from '../../common/jwt/strategies/jwt.strategy';

/**
 * Module Xác Thực
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AuthSession.name, schema: AuthSessionSchema },
      { name: AccountLock.name, schema: AccountLockSchema },
    ]),
    JwtModule,
    MailModule,
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, AuthThrottlerService],
})
export class AuthModule {}
