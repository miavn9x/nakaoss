"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useClientPosts } from "@/features/client/post/hooks/useClientPosts";
import { Link } from "@/language/i18n/navigation";
import { getImageUrl } from "@/shared/lib/image";
import {
  getPostDetail,
  getPostLink,
  PostClientListItem,
} from "@/features/client/post/types/post.types";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/shared/contexts/AuthContext";

interface CategoryListContentProps {
  categorySlug: string;
  categoryCode: string;
  isNew?: boolean;
  isFeatured?: boolean;
  categoryName?: string;
  initialData?: {
    items: any[];
    pagination: { total: number; page: number; limit: number };
  };
}

const CategoryListContent: React.FC<CategoryListContentProps> = ({
  categorySlug,
  categoryCode,
  isNew,
  isFeatured,
  categoryName,
  initialData,
}) => {
  const router = useRouter();
  const locale = useLocale();
  const tContent = useTranslations("Content");

  const [page, setPage] = React.useState(1);
  const limit = 12;

  const { data, isLoading, error } = useClientPosts(
    {
      page,
      limit,
      category: isNew || isFeatured ? undefined : categoryCode,
      isNew,
      isFeatured,
    },
    false, // waitAuth
  );

  // Home Page Optimization Pattern: Use client data if ready, otherwise fallback to initial server data
  const posts =
    data?.items && data.items.length > 0
      ? data.items
      : initialData?.items || [];
  const pagination = data?.pagination || initialData?.pagination;
  const isInitialLoading = !initialData && isLoading;

  useEffect(() => {
    if (error && (error as any).response?.status === 403) {
      router.push("/");
    }
  }, [error, router]);

  // Cuộn lên đầu khi đổi trang
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  let categoryLabel = "";
  if (isNew) {
    categoryLabel = tContent("categories.tinMoi" as any);
  } else if (isFeatured) {
    categoryLabel = tContent("categories.tinNoiBat" as any);
  } else if (categoryName) {
    categoryLabel = categoryName;
  } else {
    try {
      categoryLabel = tContent(
        `categories.${categorySlug.toLowerCase().replace(/-([a-z])/g, (g) => g[1].toUpperCase())}` as any,
      );
    } catch {
      categoryLabel = categorySlug.replace(/-/g, " ").toUpperCase();
    }
  }

  if (isInitialLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse mb-8 rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    if ((error as any).response?.status === 403) return null;
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {categoryLabel || categorySlug}
        </h1>
        <p className="text-gray-600">{tContent("error_loading_posts")}</p>
        <Link
          href="/"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          {tContent("back_to_home")}
        </Link>
      </div>
    );
  }

  const totalPages = pagination ? Math.ceil(pagination.total / limit) : 0;

  return (
    <div className="container mx-auto">
      <header className="mb-10 border-l-4 border-red-700 pl-6">
        <h1 className="text-4xl font-bold text-gray-800 uppercase">
          {categoryLabel || categorySlug.replace(/-/g, " ")}
        </h1>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-20  rounded-xl ">
          <p className="text-gray-500">{tContent("no_posts_in_category")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-12">
            {posts.map((post: PostClientListItem, index: number) => {
              const detail = getPostDetail(post, locale);
              return (
                <div
                  key={post.code}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full"
                >
                  <Link
                    href={getPostLink(post, locale) as any}
                    className="relative aspect-video overflow-hidden bg-gray-200 block"
                  >
                    <Image
                      src={getImageUrl(post.cover?.url)}
                      alt={detail.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={index < 2}
                    />
                    {post.isNew && (
                      <span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase">
                        {tContent("new_badge")}
                      </span>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs text-gray-600 mb-3 flex items-center gap-2">
                      <span className="font-bold text-red-700 uppercase">
                        {categoryLabel || post.category}
                      </span>
                      <span>&bull;</span>
                      {new Date(post.createdAt).toLocaleDateString(locale)}
                    </div>
                    <Link href={getPostLink(post, locale) as any}>
                      <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-700 transition-colors line-clamp-2">
                        {detail.title}
                      </h2>
                    </Link>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-6 flex-1">
                      {detail.description}
                    </p>
                    <Link
                      href={getPostLink(post, locale) as any}
                      className="text-red-700 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all uppercase"
                    >
                      {tContent("read_more_arrow")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simple Pagination UI */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-8">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase text-xs"
              >
                &larr; Trang trước
              </button>
              <span className="text-gray-500 text-sm font-medium">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold uppercase text-xs"
              >
                Trang sau &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryListContent;
