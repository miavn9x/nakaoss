"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Link } from "@/language/i18n/navigation";
import { useClientPosts } from "@/features/client/post/hooks/useClientPosts";
import { getImageUrl } from "@/shared/lib/image";
import {
  PostClientListItem,
  getPostDetail,
  getPostLink,
} from "@/features/client/post/types/post.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/features/auth/shared/contexts/AuthContext";

const getCategoryName = (post: PostClientListItem, locale: string) => {
  if (!post.categoryDetail) return post.category;
  const detail = post.categoryDetail.details.find((d) => d.lang === locale);
  return detail ? detail.name : post.category;
};

interface FeaturedNewsSectionProps {
  initialPosts?: PostClientListItem[];
}

export default function FeaturedNewsSection({
  initialPosts,
}: FeaturedNewsSectionProps) {
  const tHome = useTranslations("Home");
  const tCommon = useTranslations("Common");
  const tBanner = useTranslations("Banner");
  const { user, loading: authLoading } = useAuth();

  const [itemsPerView, setItemsPerView] = useState(3);
  const [isClient, setIsClient] = useState(false);

  // Fetch featured posts
  const { data, isLoading } = useClientPosts(
    {
      page: 1,
      limit: 20,
      isFeatured: true,
    },
    authLoading,
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine items per view based on window width
  useEffect(() => {
    setIsClient(true);
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Ưu tiên dữ liệu từ client
  const clientPosts = data?.items;
  const allPosts =
    clientPosts && clientPosts.length > 0 ? clientPosts : initialPosts || [];

  // Lọc bài viết theo quyền truy cập
  const posts = allPosts.filter((p) => p.visibility === "PUBLIC" || !!user);

  // Carousel Logic Toggle: Only enable infinite loop if there are more posts than visible slots
  const canScroll = posts.length > itemsPerView;

  // 1. Data Preparation
  const displayPosts = canScroll ? [...posts, ...posts, ...posts] : posts;
  const totalOriginal = posts.length;
  const totalDisplayCount = displayPosts.length;

  // 2. State
  // Start at the beginning of the MIDDLE set (Set 2) if scrolling, else start at 0
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Set initial index to middle set for canScroll cases
  useEffect(() => {
    if (canScroll && currentIndex === 0) {
      setCurrentIndex(totalOriginal);
    }
  }, [canScroll, totalOriginal]);

  // 3. Auto-Scroll Interval
  useEffect(() => {
    if (!canScroll || isPaused || posts.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [canScroll, isPaused, posts.length]);

  // 4. Navigation Handlers
  const handleNext = () => {
    if (!canScroll || posts.length === 0) return;
    const step = 1; // Change step to 1 for smoother experience or keep responsive
    const responsiveStep = itemsPerView;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + responsiveStep);
  };

  const handlePrev = () => {
    if (!canScroll || posts.length === 0) return;
    const responsiveStep = itemsPerView;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - responsiveStep);
  };

  // 5. Infinite Loop Reset
  const handleTransitionEnd = () => {
    if (!canScroll) return;
    setIsTransitioning(false);

    // If we've reached or passed the end of the 2nd set
    if (currentIndex >= 2 * totalOriginal) {
      const offset = currentIndex - 2 * totalOriginal;
      setCurrentIndex(totalOriginal + offset);
    }
    // If we've scrolled back into the 1st set
    else if (currentIndex < totalOriginal) {
      const offset = totalOriginal - currentIndex;
      setCurrentIndex(2 * totalOriginal - offset);
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (posts.length === 0) return null;

  return (
    <section className=" py-16 overflow-hidden">
      {/* CSS Variables for Responsive Layout */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .featured-carousel-container {
          --items-per-view: 1;
        }
        @media (min-width: 768px) {
          .featured-carousel-container {
            --items-per-view: 2;
          }
        }
        @media (min-width: 1024px) {
          .featured-carousel-container {
            --items-per-view: 3;
          }
        }
      `,
        }}
      />

      <div className="container mx-auto  featured-carousel-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-l-4 border-[#7a1e1e] px-4 lg:pr-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            {tHome("featuredNews")}
          </h2>
          <div className="flex items-center gap-4">
            {/* Desktop Navigation Buttons (Only if canScroll) */}
            {canScroll && (
              <div className="hidden lg:flex gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full border border-gray-300 hover:bg-[#7a1e1e] hover:text-white hover:border-[#7a1e1e] transition-colors"
                  aria-label={tBanner("prevSlide")}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full border border-gray-300 hover:bg-red-700 hover:text-white hover:border-red-700 transition-colors"
                  aria-label={tBanner("nextSlide")}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <Link
              href={"/tin-noi-bat" as any}
              className="bg-[#7a1e1e] text-white px-4 py-2 text-sm font-semibold rounded hover:bg-[#5e1717] transition-colors uppercase"
            >
              {tCommon("viewAll")} &rarr;
            </Link>
          </div>
        </div>

        {/* Carousel Window (Overflow Hidden) - With Side Navigation */}
        <div className="relative">
          <div
            className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left Navigation Button - Desktop/Mobile (Hidden if !canScroll) */}
            {canScroll && (
              <button
                onClick={handlePrev}
                className="flex lg:hidden absolute left-6 md:left-0 top-[35%] -translate-y-1/2 z-10 p-1.5 rounded-full bg-white border-2 border-gray-300 hover:bg-[#7a1e1e] hover:text-white hover:border-[#7a1e1e] transition-colors shadow-lg"
                aria-label={tBanner("prevSlide")}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Right Navigation Button - Desktop/Mobile (Hidden if !canScroll) */}
            {canScroll && (
              <button
                onClick={handleNext}
                className="flex lg:hidden absolute right-6 md:right-0  top-[35%] -translate-y-1/2 z-10 p-1.5 rounded-full bg-white border-2 border-gray-300 hover:bg-[#7a1e1e] hover:text-white hover:border-[#7a1e1e] transition-colors shadow-lg"
                aria-label={tBanner("nextSlide")}
              >
                <ChevronRight size={20} />
              </button>
            )}
            {/* Track */}
            <div
              className={`track will-change-transform flex ${!canScroll ? "justify-center" : ""}`}
              onTransitionEnd={handleTransitionEnd}
            >
              {displayPosts.map((post, index) => (
                <FeaturedCard
                  key={`${post.code}-${index}`}
                  post={post}
                  totalItems={totalDisplayCount}
                  canScroll={canScroll}
                  priority={index === 0}
                />
              ))}
            </div>
            <style jsx>{`
              .track {
                --current-index: ${currentIndex};
                width: ${canScroll
                  ? `calc(100% * ${totalDisplayCount} / var(--items-per-view))`
                  : "100%"};
                transform: translateX(
                  ${canScroll
                    ? `calc(-1 * var(--current-index) * (100% / ${totalDisplayCount}))`
                    : "0"}
                );
                transition: ${isTransitioning
                  ? "transform 4000ms cubic-bezier(0.25, 1, 0.5, 1)"
                  : "none"};
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({
  post,
  totalItems,
  canScroll,
  priority,
}: {
  post: PostClientListItem;
  totalItems: number;
  canScroll: boolean;
  priority?: boolean;
}) {
  const locale = useLocale();
  const detail = getPostDetail(post, locale);

  return (
    <div className="card-item shrink-0 h-full px-1 sm:px-2 md:px-3 ">
      <style jsx>{`
        .card-item {
          width: ${canScroll
            ? `calc(100% / ${totalItems})`
            : "var(--card-width, 33.33%)"};
        }
        @media (max-width: 767px) {
          .card-item {
            --card-width: 100%;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .card-item {
            --card-width: 50%;
          }
        }
        @media (min-width: 1024px) {
          .card-item {
            --card-width: 33.33%;
          }
        }
      `}</style>
      <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm group hover:shadow-md transition-shadow h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-4/3 overflow-hidden rounded-md mb-6 bg-gray-100 shrink-0">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(post.cover?.url)}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-full object-cover opacity-50 blur-lg scale-110"
            />
          </div>
          <Image
            src={getImageUrl(post.cover?.url)}
            alt={detail.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
        </div>

        {/* Content */}
        <div className="text-center px-2 flex flex-col grow">
          <div className="flex items-center justify-center text-[10px] sm:text-xs text-[#7a1e1e] font-semibold uppercase mb-3 gap-2">
            <span>{getCategoryName(post, locale)}</span>
            <span className="text-gray-400">&mdash;</span>
            <span className="text-gray-500 font-medium normal-case">
              {new Date(post.createdAt).toLocaleDateString(
                locale === "vi" ? "vi-VN" : "en-GB",
              )}
            </span>
          </div>

          <Link href={getPostLink(post, locale) as any} className="block mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-[#7a1e1e] line-clamp-2 hover:text-[#5e1717] transition-colors leading-tight text-center sm:text-justify wrap-break-word">
              {detail.title}
            </h3>
          </Link>

          <p className="text-sm sm:text-base text-gray-700 line-clamp-3 leading-relaxed mb-4 text-center sm:text-justify wrap-break-word">
            {detail.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse mb-8 rounded"></div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shrink-0 w-100 h-96 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
