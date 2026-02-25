// --- Thư Viện NestJS ---
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// --- Import Nội Bộ ---
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  /**
   * Tìm User theo ID (không lấy password và fields hệ thống)
   */
  async findUserById(userId: string) {
    return this.userModel
      .findById(userId)
      .select('-password -lastLoginAt -createdAt -updatedAt -__v')
      .lean();
  }

  /**
   * Cập nhật User
   */
  async updateUser(userId: string, dto: Partial<User>) {
    return this.userModel
      .findByIdAndUpdate(userId, { $set: dto }, { new: true })
      .select('-password -__v -lastLoginAt')
      .lean();
  }

  /**
   * Lấy danh sách User (Có phân trang & tìm kiếm)
   */
  async findAll(skip: number, limit: number, search?: string) {
    const query: Record<string, any> = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query['$or'] = [
        { email: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { phoneNumber: searchRegex },
      ];
    }

    const [items, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(query).exec(),
    ]);

    return { items, total };
  }

  /**
   * Cập nhật Role (Phân quyền trực tiếp)
   */
  async updateRole(userId: string, role: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(userId, { roles: [role] }, { new: true }).exec();
  }

  /**
   * Lưu trạng thái chờ duyệt Role (Pending) với Token
   */
  async updatePendingRole(
    userId: string,
    pendingRole: string,
    token: string,
    expires: Date,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          pendingRole,
          roleChangeToken: token,
          roleChangeExpires: expires,
        },
        { new: true },
      )
      .exec();
  }

  /**
   * Áp dụng Role mới nếu Token hợp lệ và chưa hết hạn
   */
  async applyPendingRole(userId: string, token: string): Promise<UserDocument | null> {
    const now = new Date();

    // 1. Tìm thông tin pendingRole TRƯỚC (nhưng phải khớp Token và chưa hết hạn)
    const pendingUser = await this.userModel.findOne({
      _id: userId,
      roleChangeToken: token,
      roleChangeExpires: { $gt: now },
    });

    if (!pendingUser || !pendingUser.pendingRole) {
      return null;
    }

    // 2. Cập nhật Atomic dựa trên Token để tránh Race Condition
    // Token sẽ được set về null ngay lập tức, ngăn chặn request thứ 2 thành công
    return this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
          roleChangeToken: token,
        },
        {
          $set: {
            roles: [pendingUser.pendingRole],
            pendingRole: null,
            roleChangeToken: null,
            roleChangeExpires: null,
          },
        },
        { new: true },
      )
      .exec();
  }
}
