"use client";

import React, { useEffect } from "react";
import { useClientPostDetail } from "@/features/client/post/hooks/useClientPosts";
import PostContent from "@/features/client/post/components/PostContent";
import PostSidebar from "@/features/client/post/components/PostSidebar";
import { notFound } from "next/navigation";
import { useRouter, usePathname } from "@/language/i18n/navigation";
import { PostClientListItem, getPostLink } from "../types/post.types";
import { useAuth } from "@/features/auth/shared/contexts/AuthContext";
import { useLocale } from "next-intl";

interface PostDetailClientProps {
  code: string;
  initialLatest?: PostClientListItem[];
  initialFeatured?: PostClientListItem[];
}

const PostDetailClient: React.FC<PostDetailClientProps> = ({
  code,
  initialLatest,
  initialFeatured,
}) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const locale = useLocale();
  const pathname = usePathname();
  const {
    data: post,
    isLoading: postLoading,
    error,
  } = useClientPostDetail(code, authLoading); // Truyền authLoading vào để hoãn fetch

  const isLoading = authLoading || postLoading;

  // TỰ ĐỘNG CHUẨN HÓA URL (Redirect khi đổi ngôn ngữ)
  useEffect(() => {
    if (post) {
      const correctPath = getPostLink(post, locale);
      if (pathname !== correctPath) {
        console.log(
          `[PostDetailClient] Redirecting from ${pathname} to ${correctPath}`,
        );
        router.replace(correctPath as any);
      }
    }
  }, [post, pathname, locale, router]);

  useEffect(() => {
    if (error && (error as any).response?.status === 403) {
      if (!authLoading && !user) {
        // Nếu trang yêu cầu quyền thành viên mà chưa login, đẩy về login
        router.push(("/login?callback=" + window.location.pathname) as any);
      }
    }
  }, [error, user, authLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-[75%] space-y-6">
            <div className="h-10 bg-gray-200 w-3/4 rounded-md" />
            <div className="h-4 bg-gray-200 w-1/4 rounded-md" />
            <div className="h-96 bg-gray-200 w-full rounded-xl" />
          </div>
          <div className="lg:w-[25%]">
            <div className="h-96 bg-gray-200 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const is403 = (error as any).response?.status === 403;
    if (is403) {
      if (!user) return null; // Sẽ redirect ở useEffect

      // Nếu đã login mà vẫn 403 -> Thông báo không đủ quyền
      return (
        <div className="container mx-auto py-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-800">Nội dung giới hạn</h2>
          <p className="text-gray-600 mt-4">
            Bài viết này chỉ dành cho cấp bậc thành viên cao hơn hoặc đang được
            bảo trì.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      );
    }
    return notFound();
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-8 lg:py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content: 75% */}
          <main className="lg:w-[75%] post-detail-content">
            {/* Nếu post thiếu categoryDetail, truyền categoryDetail từ sidebar sang để hiển thị tên */}
            <PostContent
              post={{
                ...post,
                categoryName: post.categoryName, // Explicitly pass it
                categoryDetail:
                  post.categoryDetail ||
                  [...(initialLatest || []), ...(initialFeatured || [])].find(
                    (p) => p.category === post.category,
                  )?.categoryDetail,
              }}
            />
          </main>

          {/* Sidebar: 25% */}
          <div className="lg:w-[25%] border-t lg:border-t-0 pt-8 lg:pt-0">
            <PostSidebar
              initialLatest={initialLatest}
              initialFeatured={initialFeatured}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailClient;
