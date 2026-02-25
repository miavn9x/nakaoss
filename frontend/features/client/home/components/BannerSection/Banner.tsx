"use client";

import React from "react";
import { IBanner } from "./types";
import { useBanner } from "./hooks/useBanner";
import { MainBanner } from "./components/MainBanner";

interface BannerProps {
  initialData?: IBanner[];
}

export default function Banner({ initialData = [] }: BannerProps) {
  const {
    banners,
    loading,
    currentSlide,
    setCurrentSlide,
    mainBanners,

    nextSlide,
    prevSlide,
  } = useBanner({ initialData });

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <MainBanner
        banners={mainBanners}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        nextSlide={nextSlide}
        prevSlide={prevSlide}
      />
    </section>
  );
}
