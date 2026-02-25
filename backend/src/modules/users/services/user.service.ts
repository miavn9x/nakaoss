// --- Thư Viện NestJS ---
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// --- Import Nội Bộ ---
import { StandardResponse } from 'src/common/interfaces/response.interface';
import { UserErrorCode } from 'src/modules/users/constants/user-error-code.enum';
import { UserRole } from '../constants/user-role.enum';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RoleVerificationService } from '../../mail/service/role-verification.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly roleVerificationService: RoleVerificationService,
  ) {}

  /**
   * Tìm người dùng theo ID
   */
  async findById(userId: string): Promise<StandardResponse<User>> {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      return {
        message: 'Người dùng không tồn tại',
        data: null,
        errorCode: UserErrorCode.USER_NOT_FOUND,
      };
    }

    return {
      message: 'Lấy thông tin người dùng thành công',
      data: user,
      errorCode: null,
    };
  }

  /**
   * Cập nhật thông tin cá nhân
   */
  async updateProfile(userId: string, dto: UpdateUserDto): Promise<StandardResponse<User>> {
    const updatedUser = await this.usersRepository.updateUser(userId, dto);

    if (!updatedUser) {
      return {
        message: 'Cập nhật thất bại hoặc người dùng không tồn tại',
        data: null,
        errorCode: UserErrorCode.USER_NOT_FOUND,
      };
    }

    return {
      message: 'Cập nhật thông tin thành công',
      data: updatedUser,
      errorCode: null,
    };
  }

  /**
   * Lấy danh sách toàn bộ người dùng (Admin)
   */
  async findAll(page = 1, limit = 10, search?: string): Promise<StandardResponse<any>> {
    const skip = (page - 1) * limit;
    const { items, total } = await this.usersRepository.findAll(skip, limit, search);

    return {
      message: 'Lấy danh sách người dùng thành công',
      data: {
        items,
        pagination: {
          total,
          page,
          limit,
        },
      },
      errorCode: null,
    };
  }

  /**
   * Thăng cấp quyền người dùng
   * - User: Cập nhật ngay
   * - Admin: Gửi email xác nhận
   */
  async promoteUser(
    userId: string,
    role: string,
    origin?: string,
  ): Promise<StandardResponse<null>> {
    // 1. Kiểm tra tồn tại
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      return {
        message: 'Người dùng không tồn tại',
        data: null,
        errorCode: UserErrorCode.USER_NOT_FOUND,
      };
    }

    const normalizedRole = role.toLowerCase();

    // 2. Trường hợp role USER -> Cập nhật trực tiếp
    if (normalizedRole === 'user') {
      await this.usersRepository.updateRole(userId, UserRole.USER);

      return {
        message: 'Đã cấp quyền USER thành công',
        data: null,
        errorCode: null,
      };
    }

    // 3. Trường hợp role ADMIN -> Gửi email xác thực
    if (normalizedRole === 'admin') {
      // Tạo token hết hạn sau 10 phút
      const token = crypto.randomUUID();
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 10);

      // Lưu trạng thái chờ xác nhận (Pending Role)
      await this.usersRepository.updatePendingRole(userId, role, token, expires);

      // Xác định Frontend URL (Ưu tiên ENV, fallback Origin)
      const frontendUrl = process.env.FRONTEND_URL || origin;

      // Gửi email
      await this.roleVerificationService.sendRoleVerificationEmail({
        email: user.email,
        fullName: [user.lastName, user.firstName].filter(Boolean).join(' ') || user.email,
        role,
        token,
        userId,
        frontendUrl,
      });

      return {
        message: 'Đã gửi email xác nhận cho người dùng',
        data: null,
        errorCode: null,
      };
    }

    // Role không hợp lệ
    return {
      message: 'Quyền không hợp lệ. Chỉ hỗ trợ "user" hoặc "admin".',
      data: null,
      errorCode: UserErrorCode.FORBIDDEN_ACTION,
    };
  }

  /**
   * Xử lý khi người dùng click link xác nhận quyền
   */
  async verifyRoleChange(userId: string, token: string): Promise<StandardResponse<null>> {
    return this.verifyRoleChangeLogic(userId, token);
  }

  /**
   * Logic xác nhận thay đổi quyền
   */
  private async verifyRoleChangeLogic(
    userId: string,
    token: string,
  ): Promise<StandardResponse<null>> {
    const result = await this.usersRepository.applyPendingRole(userId, token);

    if (!result) {
      return {
        message: 'Link xác nhận không hợp lệ hoặc đã hết hạn',
        data: null,
        errorCode: UserErrorCode.USER_NOT_FOUND,
      };
    }

    return {
      message: 'Cập nhật quyền thành công',
      data: null,
      errorCode: null,
    };
  }
}
