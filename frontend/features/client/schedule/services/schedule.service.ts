import axiosClient from "@/shared/lib/axios";
import { Schedule } from "@/features/admin/components/quan-ly-lich/types/schedule.types";

export const scheduleService = {
  // Get All (with pagination & search)
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await axiosClient.get("/schedules", { params });
    return response.data;
  },

  // Get One
  getOne: async (code: string) => {
    const response = await axiosClient.get(`/schedules/${code}`);
    return response.data;
  },
};
