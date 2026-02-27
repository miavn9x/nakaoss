"use client";

import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import TechnicalDetailsSection from "./components/TechnicalDetailsSection";

export default function ProductFeaturePage() {
  const [activeCategory, setActiveCategory] = useState("truot");
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(
    null,
  );

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setActiveSubCategory(null);
  };

  return (
    <div className="bg-white text-slate-900 font-display antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-card-overlay {
                background: linear-gradient(to top, rgba(29, 59, 120, 0.95) 0%, rgba(29, 59, 120, 0.4) 50%, rgba(0,0,0,0) 100%);
            }
            .product-hero-bg {
              background-image: linear-gradient(rgba(19, 23, 31, 0.7), rgba(29, 59, 119, 0.6)), url('/img/bg00.jpg');
              background-size: cover;
              background-position: center;
              background-attachment: fixed;
            }
          `,
        }}
      />
      <main>
        <HeroSection />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ">
          <CategorySection
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
            activeSubCategory={activeSubCategory}
            setActiveSubCategory={setActiveSubCategory}
          />
          <TechnicalDetailsSection
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
          />
        </div>
      </main>
    </div>
  );
}
