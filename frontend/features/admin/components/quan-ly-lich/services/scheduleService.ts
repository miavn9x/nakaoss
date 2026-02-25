import axiosClient from "@/shared/lib/axios";
import { Schedule } from "../types/schedule.types";

export const scheduleService = {
  // Create
  create: async (data: Partial<Schedule>) => {
    const response = await axiosClient.post("/schedules", data);
    return response.data;
  },

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

  // Update
  update: async (code: string, data: Partial<Schedule>) => {
    const response = await axiosClient.patch(`/schedules/${code}`, data);
    return response.data;
  },

  // Delete
  delete: async (code: string) => {
    const response = await axiosClient.delete(`/schedules/${code}`);
    return response.data;
  },
};
