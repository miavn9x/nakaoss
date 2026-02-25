export interface MediaCover {
  mediaCode: string;
  url: string;
}

export interface PostClientDetailItem {
  lang: string;
  title: string;
  description: string;
  slug?: string; // Optional in List, Required in Detail? No, List doesn't have it.
  content?: string; // Only in Detail
}

export interface PostClientListItem {
  code: string;
  category: string;
  categoryName?: string; // Tên danh mục đã phân giải
  cover: MediaCover;
  isFeatured: boolean;
  isNew: boolean;
  visibility: "PUBLIC" | "MEMBERS_ONLY";
  createdAt: string;
  updatedAt: string;
  details: {
    lang: string;
    title: string;
    description: string;
    slug: string;
  }[];
  categoryPath?: string[];
  categoryDetail?: {
    code: string;
    details: {
      lang: string;
      name: string;
      slug: string;
    }[];
  };
}

/**
 * Helper to get post detail for a specific language
 */
export const getPostDetail = (
  post: PostClientListItem | PostClientDetail,
  lang: string,
) => {
  return post.details.find((d) => d.lang === lang) || post.details[0] || {};
};

/**
 * Helper to generate SEO-friendly post link
 */
export const getPostLink = (
  post: PostClientListItem | PostClientDetail,
  lang: string,
) => {
  const detail = getPostDetail(post, lang);

  // Ưu tiên dùng đường dẫn phân cấp (SEO) nếu có
  if (post.categoryPath && post.categoryPath.length > 0) {
    const hierarchy = post.categoryPath.join("/");
    return `/${hierarchy}/${detail.slug}-${post.code}`;
  }

  // Fallback về logic cũ (chỉ 1 cấp slug)
  const categorySlug = post.category.toLowerCase().replace(/_/g, "-");
  return `/${categorySlug}/${detail.slug}-${post.code}`;
};

export interface PostClientDetail {
  code: string;
  category: string;
  categoryName?: string; // Tên danh mục đã phân giải
  // Thêm thông tin chi tiết danh mục để hiển thị tên thay vì mã
  // Code hiển thị danh mục sẽ ưu tiên lấy từ đây
  categoryDetail?: {
    code: string;
    details: {
      lang: string;
      name: string;
      slug: string;
    }[];
  };
  cover: MediaCover;
  visibility: "PUBLIC" | "MEMBERS_ONLY";
  categoryPath?: string[];
  createdAt: string;
  updatedAt: string;
  details: {
    lang: string;
    title: string;
    description: string;
    slug: string;
    content: string;
  }[];
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

export interface PostFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  visibility?: "PUBLIC" | "MEMBERS_ONLY";
}
