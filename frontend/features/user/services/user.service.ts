import axiosInstance from "@/shared/lib/axios";
import { User } from "@/features/auth/shared/contexts/AuthContext";

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
}

export const userService = {
  async updateProfile(dto: UpdateUserDto): Promise<User> {
    const { data } = await axiosInstance.patch("/user/me", dto);
    return data.data;
  },

  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("usage", "user"); // Usage enum 'user'

    // Use fetch or axios. Using axiosInstance ensures headers, but FormData sometimes needs specific handling.
    // However, axios usually handles FormData correctly.
    // "Content-Type": "multipart/form-data" is automatically set by browser/axios when data is FormData.
    const { data } = await axiosInstance.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data && data.data && data.data.url) {
      return data.data.url;
    }
    throw new Error("Upload failed");
  },
};
