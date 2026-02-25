import axiosInstance from "@/shared/lib/axios";
import { User, ApiResponse } from "../types/user.types";

class UserService {
  private baseUrl = "/user";

  // GET /user - Lấy danh sách tất cả người dùng (Admin)
  async getUsers(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ items: User[]; pagination: any }> {
    try {
      const response = await axiosInstance.get<any>(this.baseUrl, {
        params: { page, limit, search },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  // POST /user/promote - Thăng cấp user (Yêu cầu Sudo Mode)
  async promoteUser(userId: string, role: string): Promise<void> {
    try {
      await axiosInstance.post(`${this.baseUrl}/promote?userId=${userId}`, {
        role,
      });
    } catch (error) {
      throw error; // Để UI xử lý hoặc Interceptor xử lý Sudo Mode
    }
  }

  // Placeholder cho các chức năng khác (Update, Delete, v.v.)
  // Hiện tại Admin API chỉ mới có getUsers
}

export const userService = new UserService();
