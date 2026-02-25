import axiosInstance from "@/shared/lib/axios";
import {
  Advertisement,
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
} from "../types/advertisement.types";

class AdvertisementService {
  private baseUrl = "/advertisements";

  // Lấy danh sách quảng cáo
  async getAdvertisements(params?: { position?: string; isActive?: boolean }) {
    try {
      const response = await axiosInstance.get<{
        message: string;
        data: Advertisement[];
      }>(this.baseUrl, { params });
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch advertisements");
    }
  }

  // Tạo quảng cáo mới
  async createAdvertisement(data: CreateAdvertisementDto) {
    try {
      const response = await axiosInstance.post<{
        message: string;
        data: Advertisement;
      }>(this.baseUrl, data);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to create advertisement");
    }
  }

  // Cập nhật quảng cáo
  async updateAdvertisement(code: string, data: UpdateAdvertisementDto) {
    try {
      const response = await axiosInstance.patch<{
        message: string;
        data: Advertisement;
      }>(`${this.baseUrl}/${code}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update advertisement");
    }
  }

  // Xóa quảng cáo
  async deleteAdvertisement(code: string) {
    try {
      const response = await axiosInstance.delete<{
        message: string;
        data: Advertisement;
      }>(`${this.baseUrl}/${code}`);
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to delete advertisement");
    }
  }
}

export const advertisementService = new AdvertisementService();
