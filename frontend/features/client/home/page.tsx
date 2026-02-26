import React, { Suspense } from "react";
import BannerWrapper from "./components/BannerSection/BannerWrapper";
import HistoryHeroSection from "./components/HistoryHeroSection";
import PhilosophySection from "./components/PhilosophySection";
import GlobalVisionSection from "./components/GlobalVisionSection";
import VietnamEstablishmentSection from "./components/VietnamEstablishmentSection";
import CoreProductsSection from "./components/CoreProductsSection";
import TechBreakdownSection from "./components/TechBreakdownSection";
import CoreValuesSectionV2 from "./components/CoreValuesSectionV2";
import ProductSearchSection from "./components/ProductSearchSection";
import NewsAndDocsSection from "./components/NewsAndDocsSection";

export default async function Home({ locale = "vi" }: { locale?: string }) {



  return (
    <main className=" w-full">
      <Suspense
        fallback={
          <div className="w-full aspect-video md:aspect-21/9 bg-gray-200 animate-pulse" />
        }
      >
        <BannerWrapper />
      </Suspense>

      {/* NEW REDESIGNED SECTIONS */}
      <HistoryHeroSection />
      <PhilosophySection />
      <GlobalVisionSection />
      <VietnamEstablishmentSection />
      <CoreProductsSection />
      <TechBreakdownSection />
      <CoreValuesSectionV2 />
      <ProductSearchSection />
      <NewsAndDocsSection />

  
    </main>
  );
}
