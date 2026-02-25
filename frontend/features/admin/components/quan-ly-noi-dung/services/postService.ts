"use client";

import axiosInstance from "@/shared/lib/axios"; // Axios có cấu hình token

export interface MediaCover {
  mediaCode: string;
  url: string;
  _id?: string;
}

export interface PostDetail {
  lang: string;
  title: string;
  description: string;
  content: string;
}

export interface Post {
  _id?: string;
  code: string;
  category: string;
  isFeatured: boolean;
  isNew: boolean;
  visibility: "PUBLIC" | "MEMBERS_ONLY";
  cover: MediaCover;
  details: PostDetail[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PostListItem {
  code: string;
  category: string;
  isFeatured: boolean;
  isNew: boolean;
  visibility: "PUBLIC" | "MEMBERS_ONLY";
  details: PostDetail[]; // Frontend sẽ tự filter để lấy title hiển thị
  cover: MediaCover;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  errorCode: string | null;
}

export interface ListApiResponse<T> extends ApiResponse<{
  items: T[];
  pagination: Pagination;
}> {}

export interface PostFilters {
  category?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  visibility?: string;
  search?: string;
}

class PostService {
  private baseUrl = "/posts"; // Đã có baseURL trong axiosInstance

  // GET /api/posts - Lấy danh sách bài viết
  async getPosts(
    page = 1,
    limit = 50,
    filters?: PostFilters,
  ): Promise<{ items: PostListItem[]; pagination: Pagination }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.search) params.append("search", filters.search);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.isFeatured !== undefined)
        params.append("isFeatured", filters.isFeatured.toString());
      if (filters?.isNew !== undefined)
        params.append("isNew", filters.isNew.toString());
      if (filters?.visibility) params.append("visibility", filters.visibility);

      const response = await axiosInstance.get<ListApiResponse<PostListItem>>(
        `${this.baseUrl}?${params.toString()}`,
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch posts");
    }
  }

  // GET /api/posts/:code - Lấy chi tiết một bài viết theo mã
  async getPost(code: string): Promise<Post | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Post>>(
        `${this.baseUrl}/${encodeURIComponent(code)}`,
      );
      return response.data.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as any).response?.status === 404
      ) {
        return null; // Not found
      }
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as any).response?.status === 403
      ) {
        throw new Error("FORBIDDEN"); // Blocked by Access Control
      }
      throw new Error("Failed to fetch post");
    }
  }

  // POST /api/posts - Tạo mới bài viết
  async createPost(postData: Partial<Post>): Promise<ApiResponse<Post>> {
    try {
      const response = await axiosInstance.post<ApiResponse<Post>>(
        this.baseUrl,
        postData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH /api/posts/:code - Cập nhật bài viết
  async updatePost(
    code: string,
    postData: Partial<Post>,
  ): Promise<ApiResponse<Post>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<Post>>(
        `${this.baseUrl}/${encodeURIComponent(code)}`,
        postData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE /api/posts/:code - Xoá bài viết
  async deletePost(code: string): Promise<ApiResponse<Post>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<Post>>(
        `${this.baseUrl}/${encodeURIComponent(code)}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const postService = new PostService();
