import axiosInstance from "@/shared/lib/axios";
import {
  ListApiResponse,
  ApiResponse,
  PostClientListItem,
  PostClientDetail,
  PostFilterParams,
} from "../types/post.types";
import { getCategoryPath, getCategoryName } from "./category_hierarchy";

class PostClientService {
  private baseUrl = "/client/posts";

  /**
   * Lấy danh sách bài viết (Public/Client)
   */
  async getPosts(
    params?: PostFilterParams,
    lang: string = "vi",
    signal?: AbortSignal,
  ): Promise<{ items: PostClientListItem[]; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.isFeatured !== undefined)
        queryParams.append("isFeatured", params.isFeatured.toString());
      if (params?.isNew !== undefined)
        queryParams.append("isNew", params.isNew.toString());
      if (params?.visibility)
        queryParams.append("visibility", params.visibility);

      const response = await axiosInstance.get<
        ListApiResponse<PostClientListItem>
      >(`${this.baseUrl}?${queryParams.toString()}`, { signal });

      const data = response.data.data;

      // Enrich hierarchical path & name
      await Promise.all(
        data.items.map(async (item) => {
          [item.categoryPath, item.categoryName] = await Promise.all([
            getCategoryPath(item.category, lang),
            getCategoryName(item.category, lang),
          ]);
        }),
      );

      return data;
    } catch (error: any) {
      if (error.name === "CanceledError") {
        // Silent abort
        throw error;
      }
      console.error("Error fetching client posts:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết bài viết theo mã (Public/Client)
   */
  async getPostDetail(
    code: string,
    lang: string = "vi",
    signal?: AbortSignal,
  ): Promise<PostClientDetail | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<PostClientDetail>>(
        `${this.baseUrl}/${encodeURIComponent(code)}`,
        { signal },
      );
      const post = response.data.data;
      if (post) {
        [post.categoryPath, post.categoryName] = await Promise.all([
          getCategoryPath(post.category, lang),
          getCategoryName(post.category, lang),
        ]);
      }
      return post;
    } catch (error: any) {
      if (error.name === "CanceledError") throw error;
      if (error.response?.status === 404) return null;
      console.error("Error fetching client post detail:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết bài viết theo Slug (SEO)
   */
  async getPostBySlug(
    category: string,
    slug: string,
    lang: string = "vi",
    signal?: AbortSignal,
  ): Promise<PostClientDetail | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<PostClientDetail>>(
        `${this.baseUrl}/by-slug/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`,
        { signal },
      );
      const post = response.data.data;
      if (post) {
        [post.categoryPath, post.categoryName] = await Promise.all([
          getCategoryPath(post.category, lang),
          getCategoryName(post.category, lang),
        ]);
      }
      return post;
    } catch (error: any) {
      if (error.name === "CanceledError") throw error;
      if (error.response?.status === 404) return null;
      console.error("Error fetching client post by slug:", error);
      throw error;
    }
  }
}

export const postClientService = new PostClientService();
