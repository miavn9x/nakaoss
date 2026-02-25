"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/language/i18n/navigation";
import { useClientPosts } from "@/features/client/post/hooks/useClientPosts";
import { getImageUrl } from "@/shared/lib/image";
import {
  PostClientListItem,
  getPostDetail,
  getPostLink,
} from "@/features/client/post/types/post.types";
// Removed date-fns to use vanilla JS

import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/features/auth/shared/contexts/AuthContext";

const getCategoryName = (post: PostClientListItem, locale: string) => {
  if (!post.categoryDetail) return post.category;
  const detail = post.categoryDetail.details.find((d) => d.lang === locale);
  return detail ? detail.name : post.category;
};

interface LatestNewsSectionProps {
  initialPosts?: PostClientListItem[];
}

export default function LatestNewsSection({
  initialPosts,
}: LatestNewsSectionProps) {
  const tHome = useTranslations("Home");
  const tCommon = useTranslations("Common");
  const { user, loading: authLoading } = useAuth();

  // Fetch 6 new posts (2 Left + 4 Right) for better balance with bigger images
  const { data, isLoading } = useClientPosts(
    {
      page: 1,
      limit: 20,
      isNew: true,
    },
    authLoading,
  );

  // Ưu tiên dữ liệu từ client (đã bao gồm phân quyền) so với dữ liệu khởi tạo từ server
  const clientPosts = data?.items;
  const allPosts =
    clientPosts && clientPosts.length > 0 ? clientPosts : initialPosts || [];

  // Lọc bài viết theo quyền truy cập
  const posts = allPosts.filter((p) => p.visibility === "PUBLIC" || !!user);

  const isListLoading =
    initialPosts && initialPosts.length > 0 ? false : isLoading;

  if (isListLoading) {
    return (
      <section className="container mx-auto py-10 px-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse mb-6 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  // Split: 2 Left, 4 Right
  const leftPosts = posts.slice(0, 2);
  const rightPosts = posts.slice(2, 6);

  return (
    <section className="container mx-auto py-12 px-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-l-4 border-naka-blue px-4 lg:pr-0">
        <h2 className="text-3xl font-bold text-gray-800">
          {tHome("latestNews")}
        </h2>
        <Link
          href={"/tin-moi" as any}
          className="bg-naka-blue text-white px-4 py-2 text-sm font-semibold rounded hover:bg-naka-blue/90 transition-colors uppercase"
        >
          {tCommon("viewAll")} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        {/* Left Column (2 items) - 40% Width */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6 h-full">
          {leftPosts.map((post, index) => (
            <LargeNewsCard key={post.code} post={post} priority={index < 2} />
          ))}
        </div>

        {/* Right Column (4 items) - 60% Width */}
        <div className="lg:col-span-6 flex flex-col gap-4 h-full justify-between">
          {rightPosts.map((post) => (
            <SmallNewsCard key={post.code} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Sub-components for cleaner code
function LargeNewsCard({
  post,
  priority,
}: {
  post: PostClientListItem;
  priority?: boolean;
}) {
  const locale = useLocale();
  const detail = getPostDetail(post, locale);

  return (
    <div className="group">
      {/* Standard Rectangle Container (16:9) */}
      <div className="relative w-full aspect-video overflow-hidden rounded-md mb-4 bg-gray-200">
        {/* Background Blur Layer */}
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(post.cover?.url)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="w-full h-full object-cover opacity-50 blur-lg scale-110"
          />
        </div>
        {/* Main Image Layer (Full Ratio) */}
        <Image
          src={getImageUrl(post.cover?.url)}
          alt={detail.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
      </div>
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2 space-x-2">
          <span className="font-semibold text-naka-blue uppercase">
            {getCategoryName(post, locale)}
          </span>
          <span>&mdash;</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString(
              locale === "vi" ? "vi-VN" : "en-GB",
            )}
          </span>
        </div>
        <Link href={getPostLink(post, locale) as any} className="block">
          <h3 className="text-2xl font-bold text-naka-blue mb-3 hover:text-naka-blue/80 transition-colors line-clamp-2 text-left sm:text-justify wrap-break-word">
            {detail.title}
          </h3>
        </Link>
        <p className="text-gray-700 line-clamp-3 leading-relaxed text-left sm:text-justify wrap-break-word">
          {detail.description}
        </p>
      </div>
    </div>
  );
}

function SmallNewsCard({ post }: { post: PostClientListItem }) {
  const locale = useLocale();
  const detail = getPostDetail(post, locale);

  return (
    <div className="flex flex-col sm:flex-row gap-6 group items-start border-b border-gray-100 pb-5 last:border-0 last:pb-0 h-full">
      {/* Maximized Image Size: w-full on mobile, fixed w-80 on desktop.
          Changed h-52 to h-auto aspect-video on mobile to maintain ratio. */}
      <div className="relative w-full sm:w-80 h-auto sm:h-52 aspect-video sm:aspect-auto shrink-0 overflow-hidden rounded-md bg-gray-200">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(post.cover?.url)}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="w-full h-full object-cover opacity-50 blur-lg scale-110"
          />
        </div>
        <Image
          src={getImageUrl(post.cover?.url)}
          alt={detail.title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-start h-full py-1">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-1">
          <span className="font-semibold text-naka-blue uppercase">
            {getCategoryName(post, locale)}
          </span>
          <span>&bull;</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString(
              locale === "vi" ? "vi-VN" : "en-GB",
            )}
          </span>
        </div>
        <Link href={getPostLink(post, locale) as any} className="block mb-3">
          <h4 className="text-xl font-bold text-naka-blue line-clamp-2 hover:text-naka-blue/80 transition-colors leading-snug text-left sm:text-justify wrap-break-word">
            {detail.title}
          </h4>
        </Link>
        {/* Increased text density: line-clamp-4 */}
        <p className="text-sm text-gray-700 line-clamp-6 leading-relaxed text-justify">
          {detail.description}
        </p>
      </div>
    </div>
  );
}
