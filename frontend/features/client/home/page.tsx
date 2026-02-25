import React, { Suspense } from "react";
import BannerWrapper from "./components/BannerSection/BannerWrapper";
import QuoteSection from "./components/QuoteSection";
import LineageIntroSection from "./components/LineageIntroSection";
import HistoryIntroSection from "./components/HistoryIntroSection";
import CoreValuesSection from "./components/CoreValuesSection";
import LatestNewsSection from "./components/LatestNewsSection";
import FeaturedNewsSection from "./components/FeaturedNewsSection";
import { getPostsServer } from "@/features/client/post/services/post.server";

export default async function Home({ locale = "vi" }: { locale?: string }) {
  const latestPostsPromise = getPostsServer(
    "page=1&limit=20&isNew=true",
    locale,
  );
  const featuredPostsPromise = getPostsServer(
    "page=1&limit=20&isFeatured=true",
    locale,
  );

  // Parallel fetching
  const [{ items: latestPostsRaw }, { items: featuredPosts }] =
    await Promise.all([latestPostsPromise, featuredPostsPromise]);

  // Deduplication: Remove posts already in featured from latest
  const featuredCodes = new Set(featuredPosts.map((p) => p.code));
  const latestPosts = latestPostsRaw
    .filter((p) => !featuredCodes.has(p.code))
    .slice(0, 6); // Keep only 6 for the UI after filtering

  return (
    <main className=" w-full">
      <Suspense
        fallback={
          <div className="w-full aspect-video md:aspect-21/9 bg-gray-200 animate-pulse" />
        }
      >
        <BannerWrapper />
      </Suspense>

      <HistoryIntroSection />

      <CoreValuesSection />

      {/* <QuoteSection /> */}
      {/* <LineageIntroSection /> */}

      <div className="w-full bg-slate-50">
        <LatestNewsSection initialPosts={latestPosts} />

        <FeaturedNewsSection initialPosts={featuredPosts} />
      </div>
    </main>
  );
}
