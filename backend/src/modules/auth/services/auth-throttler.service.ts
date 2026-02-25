import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { AccountLock, AccountLockDocument, LockReason } from '../schemas/account-lock.schema';

interface CacheManager {
  get<T>(key: string): Promise<T | undefined | null>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
}

@Injectable()
export class AuthThrottlerService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    @InjectModel(AccountLock.name)
    private readonly accountLockModel: Model<AccountLockDocument>,
  ) {}

  // --- Cấu hình ---
  private readonly MAX_ATTEMPTS = 5; // Số lần sai tối đa
  private readonly CAPTCHA_TTL = 300; // 5 phút

  /**
   * Tính toán thời gian khóa (Progressive Lockout)
   * Thời gian tăng dần: 1m -> 5m -> ... -> 30 ngày
   */
  private calculateLockDuration(lockCount: number): number {
    const durations = [
      1 * 60 * 1000, // 1 phút
      5 * 60 * 1000, // 5 phút
      15 * 60 * 1000, // 15 phút
      30 * 60 * 1000, // 30 phút
      60 * 60 * 1000, // 1 giờ
      3 * 60 * 60 * 1000, // 3 giờ
      6 * 60 * 60 * 1000, // 6 giờ
      12 * 60 * 60 * 1000, // 12 giờ
      24 * 60 * 60 * 1000, // 1 ngày
      48 * 60 * 60 * 1000, // 2 ngày
      7 * 24 * 60 * 60 * 1000, // 1 tuần
      30 * 24 * 60 * 60 * 1000, // 30 ngày (Max)
    ];
    const index = Math.min(lockCount, durations.length - 1);
    return durations[index];
  }

  /**
   * Tạo key cache cho việc đếm số lần sai
   */
  private getAttemptKey(ip: string, email: string, reason: LockReason): string {
    const safeEmail = email ? email.trim().toLowerCase() : 'unknown';

    switch (reason) {
      case LockReason.SUDO:
      case LockReason.PASSWORD:
        // Khóa theo Account để chống Distributed Brute-force (nhiều IP đánh 1 Acc)
        return `attempt:${reason}:${safeEmail}`;
      case LockReason.CAPTCHA:
        // Khóa theo IP để chống Registration Spam / Botnet (nhiều Acc từ 1 IP)
        return `attempt:${reason}:${ip}`;
      default:
        // Unreachable but satisfies TypeScript's restrict-template-expressions
        return `attempt:${reason as string}:${ip}:${safeEmail}`;
    }
  }

  /**
   * Kiểm tra trạng thái khóa của tài khoản
   */
  async checkLock(
    email: string,
    ip: string,
    reason: LockReason,
  ): Promise<{
    locked: boolean;
    message?: string;
    errorCode?: string;
    lockUntil?: number;
    lockReason?: LockReason;
    lockCount?: number;
  }> {
    const safeEmail = email.trim().toLowerCase();

    // Xây dựng query tìm Lock
    const query: Record<string, any> = {
      lockReason: reason,
      isUnlocked: false,
      lockUntil: { $gt: new Date() },
    };

    if (reason === LockReason.SUDO || reason === LockReason.PASSWORD) {
      // Sudo và Password check theo Email (Chống IP Spoofing)
      query.email = safeEmail;
    } else {
      // Captcha check theo Email HOẶC IP
      query.$or = [{ email: safeEmail }, { ipAddress: ip }];
    }

    const activeLock = await this.accountLockModel.findOne(query);

    if (activeLock) {
      const now = Date.now();
      const lockUntilTimestamp = activeLock.lockUntil.getTime();

      if (now < lockUntilTimestamp) {
        const remainingSeconds = Math.ceil((lockUntilTimestamp - now) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        const reasonText =
          reason === LockReason.CAPTCHA
            ? 'mã xác nhận'
            : reason === LockReason.SUDO
              ? 'mã xác thực (Sudo OTP)'
              : 'mật khẩu';

        return {
          locked: true,
          message: `Tài khoản tạm thời bị khóa do nhập sai ${reasonText} quá nhiều lần. Vui lòng thử lại sau ${minutes} phút ${seconds} giây.`,
          errorCode: 'AUTH_LOCKED',
          lockUntil: lockUntilTimestamp,
          lockReason: reason,
          lockCount: activeLock.lockCount,
        };
      } else {
        // Tự động mở khóa nếu hết hạn
        activeLock.isUnlocked = true;
        activeLock.unlockedAt = new Date();
        await activeLock.save();
      }
    }

    return { locked: false };
  }

  /**
   * Tăng số lần thử sai. Nếu vượt quá giới hạn sẽ khóa tài khoản.
   */
  async incrementAttempt(email: string, ip: string, reason: LockReason): Promise<void> {
    const safeEmail = email.trim().toLowerCase();
    const key = this.getAttemptKey(ip, safeEmail, reason);

    const count = (await this.cacheManager.get<number>(key)) || 0;
    const newCount = count + 1;

    // Cache trong 60 giây
    await this.cacheManager.set(key, newCount, 60 * 1000);

    if (newCount >= this.MAX_ATTEMPTS) {
      await this.lockAccount(safeEmail, ip, reason);
      await this.cacheManager.del(key);
    }
  }

  /**
   * Thực hiện khóa tài khoản và lưu vào DB
   */
  private async lockAccount(email: string, ip: string, reason: LockReason): Promise<void> {
    const query: Record<string, any> = {
      email,
      lockReason: reason,
    };
    // Chỉ thêm IP vào điều kiện tìm kiếm nếu KHÔNG PHẢI là SUDO hoặc PASSWORD
    if (reason !== LockReason.SUDO && reason !== LockReason.PASSWORD) {
      query.ipAddress = ip;
    }

    const existingLock = await this.accountLockModel.findOne(query);

    let lockCount = 0;
    if (existingLock) {
      lockCount = existingLock.lockCount + 1;
    }

    const lockDuration = this.calculateLockDuration(lockCount);
    const lockUntil = new Date(Date.now() + lockDuration);

    if (existingLock) {
      existingLock.lockCount = lockCount;
      existingLock.attemptCount = this.MAX_ATTEMPTS;
      existingLock.lockUntil = lockUntil;
      existingLock.isUnlocked = false;
      existingLock.lastAttemptAt = new Date();
      await existingLock.save();
    } else {
      await this.accountLockModel.create({
        email,
        ipAddress: ip,
        lockReason: reason,
        lockCount,
        attemptCount: this.MAX_ATTEMPTS,
        lockUntil,
        isUnlocked: false,
        lastAttemptAt: new Date(),
      });
    }
  }

  /**
   * Mở khóa tài khoản (Reset Lock)
   */
  async resetLock(email: string, ip: string): Promise<void> {
    const safeEmail = email.trim().toLowerCase();

    await this.cacheManager.del(this.getAttemptKey(ip, safeEmail, LockReason.CAPTCHA));
    await this.cacheManager.del(this.getAttemptKey(ip, safeEmail, LockReason.PASSWORD));
    await this.cacheManager.del(this.getAttemptKey(ip, safeEmail, LockReason.SUDO));

    await this.accountLockModel.updateMany(
      {
        email: safeEmail,
        ipAddress: ip,
        isUnlocked: false,
      },
      {
        $set: {
          isUnlocked: true,
          unlockedAt: new Date(),
          attemptCount: 0,
        },
      },
    );
  }

  /**
   * Lấy thông tin khóa hiện tại (Admin/Debug)
   */
  async getLockInfo(email: string, ip: string): Promise<AccountLockDocument[]> {
    return this.accountLockModel.find({
      email: email.trim().toLowerCase(),
      ipAddress: ip,
      isUnlocked: false,
      lockUntil: { $gt: new Date() },
    });
  }
}
