import React from "react";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import TechnicalDetailsSection from "./components/TechnicalDetailsSection";

export default function ProductFeaturePage() {
  return (
    <div className="bg-naka-white text-[#333333] font-sans antialiased">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-card-overlay {
                background: linear-gradient(to top, rgba(29, 59, 120, 0.95) 0%, rgba(29, 59, 120, 0.4) 50%, rgba(0,0,0,0) 100%);
            }
          `,
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HeroSection />
        <CategorySection />
        <TechnicalDetailsSection />
      </main>
    </div>
  );
}
