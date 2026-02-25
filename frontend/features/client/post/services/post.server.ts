import { fetchClient } from "@/shared/lib/fetch-client";
import {
  PostClientDetail,
  PostClientListItem,
  ListApiResponse,
  ApiResponse,
  Pagination,
} from "../types/post.types";
import { getCategoryPath, getCategoryName } from "./category_hierarchy";

export const getPostDetailServer = async (
  code: string,
  lang: string = "vi",
  token?: string,
): Promise<PostClientDetail | null> => {
  const post = await fetchClient.get<PostClientDetail>(
    `/client/posts/${code}`,
    {
      cacheStrategy: "MEDIUM",
      next: { tags: ["posts"] },
      headers: token ? { Cookie: `accessToken=${token}` } : undefined,
    },
  );

  if (!post) return null;

  // Enrich with hierarchical path
  post.categoryPath = await getCategoryPath(post.category, lang);

  return post;
};

export const getPostsServer = async (
  params: string,
  lang: string = "vi",
  token?: string,
): Promise<{ items: PostClientListItem[]; pagination: Pagination }> => {
  // Parse params string to object for fetchClient
  const paramsObj = Object.fromEntries(new URLSearchParams(params));

  // Use SHORT cache (1 min) for lists to be fresh
  const response = await fetchClient.get<{
    items: PostClientListItem[];
    pagination: Pagination;
  }>("/client/posts", {
    params: paramsObj,
    cacheStrategy: "SHORT",
    next: { tags: ["posts", "categories"] },
    headers: token ? { Cookie: `accessToken=${token}` } : undefined,
  });

  const items = response?.items || [];
  const pagination = response?.pagination || { total: 0, page: 1, limit: 12 };

  if (items.length === 0) return { items: [], pagination };

  // TỐI ƯU: Đảm bảo Priming cache cho tree một lần trước khi map
  await getCategoryPath("", lang);

  await Promise.all(
    items.map(async (item) => {
      [item.categoryPath, item.categoryName] = await Promise.all([
        getCategoryPath(item.category, lang),
        getCategoryName(item.category, lang),
      ]);
    }),
  );

  return { items, pagination };
};
