import { useEffect, useState } from "react";
import { BannerType, IBanner } from "../types";

interface UseBannerProps {
  initialData?: IBanner[];
}

export const useBanner = ({ initialData = [] }: UseBannerProps) => {
  const [banners, setBanners] = useState<IBanner[]>(initialData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(initialData.length === 0);

  useEffect(() => {
    setBanners(initialData);
    setLoading(false);
  }, [initialData]);

  const mainBanners = banners.filter((b) => b.type === BannerType.MAIN);

  /* --- Auto Slide Logic --- */
  useEffect(() => {
    if (mainBanners.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 giây đổi 1 lần

    return () => clearInterval(interval);
  }, [mainBanners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mainBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + mainBanners.length) % mainBanners.length
    );
  };

  return {
    banners,
    currentSlide,
    setCurrentSlide, // Exposed for indicators
    loading,
    mainBanners,

    nextSlide,
    prevSlide,
  };
};
