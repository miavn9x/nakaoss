"use client";

import { Link } from "@/language/i18n/navigation";
import { useClientPosts } from "../hooks/useClientPosts";
import { getPostDetail, getPostLink } from "../types/post.types";
import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/features/auth/shared/contexts/AuthContext";

import { PostClientListItem } from "../types/post.types";

interface PostSidebarProps {
  initialLatest?: PostClientListItem[];
  initialFeatured?: PostClientListItem[];
}

const PostSidebar = ({ initialLatest, initialFeatured }: PostSidebarProps) => {
  const { user } = useAuth();
  const locale = useLocale();
  const tHome = useTranslations("Home");
  const tAuth = useTranslations("Auth");

  // 1. Fetch Latest Posts (Client fallback if no initial data)
  const { data: latestData } = useClientPosts({
    page: 1,
    limit: 5,
    isNew: true,
  });

  // 2. Fetch Featured Posts (Client fallback)
  const { data: featuredData } = useClientPosts({
    page: 1,
    limit: 5,
    isFeatured: true,
  });

  // Use props if available, otherwise fallback to client fetch
  const latestPosts =
    initialLatest && initialLatest.length > 0
      ? initialLatest
      : latestData?.items || [];
  const featuredPosts =
    initialFeatured && initialFeatured.length > 0
      ? initialFeatured
      : featuredData?.items || [];

  // 3. Fetch Member Posts (Only if user exists)
  const { data: memberData } = useClientPosts({
    page: 1,
    limit: 5,
    visibility: "MEMBERS_ONLY",
  });

  const Section = ({ title, posts }: { title: string; posts: any[] }) => {
    if (!posts || posts.length === 0) return null;
    return (
      <div className="mb-10 last:mb-0">
        <h3 className="text-base md:text-lg font-bold text-gray-800 uppercase border-b-2 border-red-800 pb-2 mb-5">
          {title}
        </h3>
        <ul className="space-y-4">
          {posts.map((post) => {
            const detail = getPostDetail(post, locale);
            return (
              <li
                key={post.code}
                className="group border-b border-gray-100 pb-3 last:border-0"
              >
                <Link href={getPostLink(post, locale) as any} className="block">
                  <h4 className="text-sm md:text-[15px] lg:text-base font-semibold text-gray-800 group-hover:text-red-800 transition-colors line-clamp-2 leading-snug">
                    {detail.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(post.createdAt).toLocaleDateString(
                      locale === "vi" ? "vi-VN" : "en-US",
                    )}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <aside className="w-full">
      <Section title={tHome("latestNews")} posts={latestPosts} />
      <Section title={tHome("featuredNews")} posts={featuredPosts} />

      {user && (
        <Section title={tHome("memberPosts")} posts={memberData?.items || []} />
      )}
    </aside>
  );
};

export default PostSidebar;
