"use client";

import React from "react";
import Image from "next/image";
import { PostClientDetail, getPostDetail } from "../types/post.types";
import { getImageUrl } from "@/shared/lib/image";
import { useLocale, useTranslations } from "next-intl";
import TinyMCEContent from "@/shared/components/TinyMCEContent";

interface PostContentProps {
  post: PostClientDetail;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const locale = useLocale();
  const tContent = useTranslations("Content");
  const detail = post.details.find((d) => d.lang === locale) || post.details[0];

  if (!detail) return null;

  // --- FIX START: Hiển thị tên danh mục thay vì mã ---
  const getCategoryName = () => {
    // 0. Ưu tiên lấy từ categoryName đã phân giải sẵn (nếu có)
    if (post.categoryName) return post.categoryName;

    // 1. Lấy từ categoryDetail (nếu có)
    if (post.categoryDetail) {
      const catDetail = post.categoryDetail.details.find(
        (d) => d.lang === locale,
      );
      if (catDetail) return catDetail.name;
    }

    // 2. Fallback: Trả về post.category (thường là mã)
    return post.category;
  };

  const categoryLabel = getCategoryName();
  // --- FIX END ---

  return (
    <article className="space-y-6">
      <header className="border-b border-gray-100 pb-6 mb-6">
        <div className="flex items-center text-xs md:text-sm font-semibold text-naka-blue uppercase mb-4 gap-2">
          {/* Hiển thị tên danh mục đã xử lý */}
          <span>{categoryLabel}</span>
          <span className="text-gray-400 font-normal">&mdash;</span>
          <span className="text-gray-500 font-medium normal-case">
            {new Date(post.createdAt).toLocaleDateString(
              locale === "vi" ? "vi-VN" : "en-GB",
            )}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
          {detail.title}
        </h1>
      </header>

      <div className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl text-left sm:text-justify wrap-break-word">
        <TinyMCEContent content={detail.content || ""} />
      </div>
    </article>
  );
};

export default PostContent;
