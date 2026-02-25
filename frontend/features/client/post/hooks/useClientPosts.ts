import { useQuery, useQueryClient } from "@tanstack/react-query";
import { postClientService } from "../services/post.service";
import {
  PostFilterParams,
  PostClientListItem,
  PostClientDetail,
} from "../types/post.types";
import { useLocale } from "next-intl";
import { useAuth } from "@/features/auth/shared/contexts/AuthContext";

// Keys for caching
export const POST_KEYS = {
  all: (locale: string, userId: string = "guest") =>
    ["client-posts", locale, userId] as const,
  lists: (locale: string, userId: string = "guest") =>
    [...POST_KEYS.all(locale, userId), "list"] as const,
  list: (params: PostFilterParams, locale: string, userId: string = "guest") =>
    [...POST_KEYS.lists(locale, userId), params] as const,
  details: (locale: string, userId: string = "guest") =>
    [...POST_KEYS.all(locale, userId), "detail"] as const,
  detail: (code: string, locale: string, userId: string = "guest") =>
    [...POST_KEYS.details(locale, userId), code] as const,
};

/**
 * Hook lấy danh sách bài viết cho Client
 */
export const useClientPosts = (
  params: PostFilterParams = { page: 1, limit: 10 },
  waitAuth: boolean = false,
) => {
  const locale = useLocale();
  const { user } = useAuth();
  const userId = user?._id || "guest";

  return useQuery({
    queryKey: POST_KEYS.list(params, locale, userId),
    queryFn: ({ signal }) => postClientService.getPosts(params, locale, signal),
    enabled: !waitAuth, // Chờ auth if needed
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook lấy chi tiết bài viết cho Client
 */
export const useClientPostDetail = (
  code: string,
  waitAuth: boolean = false,
) => {
  const locale = useLocale();
  const { user } = useAuth();
  const userId = user?._id || "guest";

  return useQuery({
    queryKey: POST_KEYS.detail(code, locale, userId),
    queryFn: ({ signal }) =>
      postClientService.getPostDetail(code, locale, signal),
    enabled: !!code && !waitAuth, // Chờ auth check xong mới fetch để tránh guest fetch thừa
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook lấy chi tiết bài viết theo Slug (SEO)
 */
export const useClientPostBySlug = (
  category: string,
  slug: string,
  waitAuth: boolean = false,
) => {
  const locale = useLocale();
  const { user } = useAuth();
  const userId = user?._id || "guest";

  return useQuery({
    queryKey: ["client-post-detail", locale, userId, category, slug],
    queryFn: ({ signal }) =>
      postClientService.getPostBySlug(category, slug, locale, signal),
    enabled: !!category && !!slug && !waitAuth,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
