"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import SunEditorContent from "@/shared/components/SunEditorContent";
import Image from "next/image";
import { getImageUrl } from "@/shared/lib/image";
import { stripHtml } from "@/shared/lib/html";
import { IBanner } from "../types";
import { useTranslations } from "next-intl";

interface MainBannerProps {
  banners: IBanner[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

export const MainBanner = ({
  banners,
  currentSlide,
  setCurrentSlide,
  nextSlide,
  prevSlide,
}: MainBannerProps) => {
  const tBanner = useTranslations("Banner");

  return (
    <div className="w-full relative group overflow-hidden bg-black">
      {banners.map((banner, index) => {
        return (
          <div
            key={banner.code}
            className={`w-full transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 relative translate-x-0 scale-100 z-10"
                : "opacity-0 invisible absolute top-0 left-0 scale-105 z-0"
            }`}
          >
            {/* Image */}
            <Image
              src={getImageUrl(banner.imageUrl)}
              alt={stripHtml(banner.title) || "Banner"}
              width={1920}
              height={1080}
              priority={index === 0}
              className="w-full h-auto"
              sizes="100vw"
            />

            {/* Overlay */}
            <div
              className={`absolute inset-0 ${
                !banner.color?.includes("gradient") &&
                !banner.color?.includes("#")
                  ? `bg-linear-to-r ${
                      banner.color ||
                      "from-black/80 via-black/20 to-transparent"
                    }`
                  : "bg-(--banner-overlay-bg)"
              }`}
              ref={(el) => {
                if (el) {
                  const color =
                    banner.color?.includes("gradient") ||
                    banner.color?.includes("#")
                      ? banner.color
                      : undefined;
                  if (color) {
                    el.style.setProperty("--banner-overlay-bg", color);
                  } else {
                    el.style.removeProperty("--banner-overlay-bg");
                  }
                }
              }}
            />

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Title */}
              {banner.showTitle !== false && (
                <SunEditorContent
                  content={banner.title}
                  className="absolute inset-0 w-full h-full pointer-events-auto bg-transparent!"
                />
              )}

              {/* Button */}
              {banner.showButton !== false && banner.buttonText && (
                <a
                  href={banner.link || "#"}
                  className="absolute inline-block px-[2em] py-[0.75em] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity rounded w-fit pointer-events-auto whitespace-nowrap bg-(--btn-bg) text-(--btn-text) top-(--btn-top) left-(--btn-left) translate-x-(--btn-translate-x) -translate-y-1/2 [font-size:var(--btn-size)]"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty(
                        "--btn-bg",
                        banner.buttonColor || "#ffffff",
                      );
                      el.style.setProperty(
                        "--btn-text",
                        banner.buttonTextColor || "#000000",
                      );
                      el.style.setProperty(
                        "--btn-top",
                        `${banner.buttonPos?.top || 60}%`,
                      );
                      el.style.setProperty(
                        "--btn-left",
                        `${banner.buttonPos?.left || 10}%`,
                      );
                      el.style.setProperty(
                        "--btn-translate-x",
                        `-${banner.buttonPos?.left || 10}%`,
                      );
                      if (banner.buttonSize) {
                        el.style.setProperty(
                          "--btn-size",
                          `clamp(${banner.buttonSize * 0.5}px, 4vw, ${
                            banner.buttonSize
                          }px)`,
                        );
                      } else {
                        el.style.removeProperty("--btn-size");
                      }
                    }
                  }}
                >
                  {banner.buttonText}
                </a>
              )}
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label={tBanner("prevSlide")}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/30 text-white rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 backdrop-blur-sm z-20 pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label={tBanner("nextSlide")}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/30 text-white rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 backdrop-blur-sm z-20 pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={tBanner("goToSlide", { index: idx + 1 })}
              className={`w-8 md:w-12 h-1 md:h-1.5 rounded-full transition-all ${
                idx === currentSlide
                  ? "bg-[#c9a149]"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
