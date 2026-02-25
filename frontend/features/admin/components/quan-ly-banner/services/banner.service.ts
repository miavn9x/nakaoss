import axiosClient from "@/shared/lib/axios";
import { IBanner, ICreateBannerPayload, IUpdateBannerPayload } from "../types";

export const bannerService = {
  // Admin: Get all banners
  getAllAdmin: async (): Promise<IBanner[]> => {
    const response = await axiosClient.get("/banners/admin");
    return response.data.data;
  },

  // Public: Get visible banners
  getAllPublic: async (): Promise<IBanner[]> => {
    const response = await axiosClient.get("/banners/public");
    return response.data.data;
  },

  // Get detail by code
  getOne: async (code: string): Promise<IBanner> => {
    const response = await axiosClient.get(`/banners/${code}`);
    return response.data.data;
  },

  // Create banner
  create: async (payload: ICreateBannerPayload): Promise<IBanner> => {
    const response = await axiosClient.post("/banners", payload);
    try {
      await fetch("/api/revalidate?tag=banners&secret=bi_mat_khong_bat_mi");
    } catch (e) {
      console.error("Revalidation failed", e);
    }
    return response.data.data;
  },

  // Update banner by code
  update: async (
    code: string,
    payload: IUpdateBannerPayload
  ): Promise<IBanner> => {
    const response = await axiosClient.patch(`/banners/${code}`, payload);
    try {
      await fetch("/api/revalidate?tag=banners&secret=bi_mat_khong_bat_mi");
    } catch (e) {
      console.error("Revalidation failed", e);
    }
    return response.data.data;
  },

  // Delete banner by code
  delete: async (code: string): Promise<IBanner> => {
    const response = await axiosClient.delete(`/banners/${code}`);
    try {
      await fetch("/api/revalidate?tag=banners&secret=bi_mat_khong_bat_mi");
    } catch (e) {
      console.error("Revalidation failed", e);
    }
    return response.data.data;
  },
};
