import axiosClient from "@/shared/lib/axios";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category.types";

export const CategoryService = {
  getTree: async (
    page = 1,
    limit = 10,
  ): Promise<{ items: Category[]; pagination: any }> => {
    const response = await axiosClient.get("/categories/tree", {
      params: { page, limit },
    });
    // Interceptor wraps response in { data: ..., message: ... }
    return (
      response.data?.data || {
        items: [],
        pagination: { total: 0, page: 1, limit: 10 },
      }
    );
  },

  getTreeFull: async (): Promise<Category[]> => {
    const response = await axiosClient.get("/categories/tree-full");
    return response.data?.data || [];
  },

  getAll: async (): Promise<Category[]> => {
    const response = await axiosClient.get("/categories");
    return response.data?.data || [];
  },

  getOne: async (code: string): Promise<Category> => {
    const response = await axiosClient.get(`/categories/${code}`);
    return response.data?.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosClient.post("/categories", data);
    return response.data?.data;
  },

  update: async (
    code: string,
    data: UpdateCategoryRequest,
  ): Promise<Category> => {
    const response = await axiosClient.put(`/categories/${code}`, data);
    return response.data?.data;
  },

  delete: async (code: string): Promise<void> => {
    await axiosClient.delete(`/categories/${code}`);
  },
};
