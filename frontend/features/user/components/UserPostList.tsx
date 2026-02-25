"use client";

import { useEffect, useState } from "react";
import { postClientService } from "@/features/client/post/services/post.service";
import { PostClientListItem } from "@/features/client/post/types/post.types";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { getImageUrl } from "@/shared/lib/image";
import { Loader2, Lock } from "lucide-react";

export const UserPostList = () => {
  const [posts, setPosts] = useState<PostClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
  });
  const tCommon = useTranslations("Common");
  const tProfile = useTranslations("Profile");
  const locale = useLocale();

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      // Fetch specifically MEMBERS_ONLY posts
      const data = await postClientService.getPosts({
        visibility: "MEMBERS_ONLY",
        limit: pagination.limit,
        page: page,
      });
      setPosts(data.items);
      setPagination((prev) => ({
        ...prev,
        page: page,
        total: data.pagination.total,
      }));
    } catch (error) {
      console.error("Failed to fetch member posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      fetchPosts(newPage);
    }
    // Scroll to top of list
    const listElement = document.getElementById("user-post-list-top");
    if (listElement) {
      listElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
    return null; // Or show specific "No member content" message
  }

  const getPostLink = (post: PostClientListItem) => {
    // Construct link: /<category>/<slug>-<code>
    // We need category slug. Assuming category is Code (e.g. TIN_TUC).
    // Standardize: TIN_TUC -> tin-tuc
    const categorySlug = post.category
      ? post.category.toLowerCase().replace(/_/g, "-")
      : "general";
    // Details matching locale
    const detail =
      post.details.find((d) => d.lang === locale) ||
      post.details.find((d) => d.lang === "en") ||
      post.details[0];
    const slug = detail?.slug || "post";

    return `/${categorySlug}/${slug}-${post.code}`;
  };

  return (
    <div className="mt-8 space-y-4" id="user-post-list-top">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Lock className="w-5 h-5 text-[#FFD400]" />
        <span>{tProfile("member_exclusive_content")}</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => {
          const detail =
            post.details.find((d) => d.lang === locale) || post.details[0];
          return (
            <Link
              key={post.code}
              href={getPostLink(post)}
              className="group flex gap-4 bg-white p-3 rounded-xl border border-gray-100 hover:border-[#FFD400] hover:shadow-md transition-all"
            >
              <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden relative">
                {post.cover ? (
                  <img
                    src={getImageUrl(post.cover?.url, "/img/placeholder.jpg")}
                    alt={detail?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 line-clamp-2 group-hover:text-[#103E8F] transition-colors mb-1">
                  {detail?.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {detail?.description}
                </p>
                <span className="inline-block px-2 py-0.5 bg-yellow-50 text-[#b39500] text-[10px] font-bold rounded-sm uppercase tracking-wider border border-yellow-100">
                  Members Only
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 text-sm font-medium rounded-md border border-gray-200 text-gray-600 hover:border-[#103E8F] hover:text-[#103E8F] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Prev
          </button>
          <span className="text-sm font-bold text-gray-800">
            {pagination.page} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            className="px-3 py-1 text-sm font-medium rounded-md border border-gray-200 text-gray-600 hover:border-[#103E8F] hover:text-[#103E8F] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}

      {loading && posts.length > 0 && (
        <div className="flex justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};
