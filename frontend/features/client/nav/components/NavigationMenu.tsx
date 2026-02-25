"use client";

import { Link } from "@/language/i18n/navigation";
import { Search, X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import SearchOverlay from "./SearchOverlay";
import { useTranslations } from "next-intl";

import { useCategoryTree } from "@/features/client/category/hooks/useCategoryTree";
import CategoryNavItem from "@/features/client/category/components/CategoryNavItem";

import { Category } from "@/features/client/category/types/category.types";

interface NavigationMenuProps {
  onToggleMobileMenu?: () => void;
  initialCategories?: Category[];
}

const NavigationMenu = ({
  onToggleMobileMenu,
  initialCategories,
}: NavigationMenuProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { categories } = useCategoryTree(initialCategories);

  // Incremental reveal states
  const [startIndex, setStartIndex] = useState(0);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  const [showArrows, setShowArrows] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const navItemsRef = useRef<HTMLUListElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("Navigation");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle click outside for search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Menu items array
  const menuItems = useMemo(() => {
    const staticBefore = [
      { label: t("home"), href: "/" },
      { label: t("schedule"), href: "/schedule" },
    ];

    // Map categories to menu items
    const dynamicCategories = categories.map((cat) => ({
      component: <CategoryNavItem category={cat} />,
      key: cat.code,
      label: cat.details.find((d) => d.lang === "vi")?.name || cat.code, // Fallback label for measurement
    }));

    const staticAfter = [
      { label: t("contact"), href: "/contact" },
      { label: t("support_us"), href: "/support-us" },
    ];

    return [...staticBefore, ...dynamicCategories, ...staticAfter];
  }, [t, categories]);

  const measureRef = useRef<HTMLDivElement>(null);

  // Calculate visible items from startIndex
  const calculateVisibleItems = useCallback(() => {
    if (!isClient || !navContainerRef.current || !measureRef.current) return;

    // 1. Batch read container width
    const containerWidth = navContainerRef.current.clientWidth;
    const arrowsWidth = 80;
    const availableWidth = containerWidth - arrowsWidth;
    if (availableWidth <= 0) return;

    const visible: number[] = [];
    let currentWidth = 0;
    const gapWidth = 18; // gap-6 = 24px (md breakpoint)

    // 2. Batch read all item widths at once
    const itemElements = Array.from(
      measureRef.current.children,
    ) as HTMLElement[];
    const itemWidths = itemElements.map((el) => el.offsetWidth);

    // 3. Pure calculation logic (no more DOM reads)
    // Start from startIndex and measure until full
    for (let i = startIndex; i < menuItems.length; i++) {
      // Since hidden container has ALL items, index matches global menuItems index
      const itemWidth = itemWidths[i];
      if (itemWidth === undefined) continue;

      const widthWithGap = itemWidth + (visible.length > 0 ? gapWidth : 0);

      // Always add at least 1 item, even if it overflows
      if (visible.length === 0) {
        visible.push(i);
        currentWidth += itemWidth;
      } else if (currentWidth + widthWithGap <= availableWidth) {
        visible.push(i);
        currentWidth += widthWithGap;
      } else {
        break; // Stop when no more space
      }
    }

    setVisibleIndices(visible);

    // Has more items after visible?
    const lastVisibleIndex = visible[visible.length - 1] || startIndex;
    setHasMore(lastVisibleIndex < menuItems.length - 1);

    // Show arrows if not all items fit OR if startIndex > 0
    setShowArrows(startIndex > 0 || lastVisibleIndex < menuItems.length - 1);
  }, [menuItems, startIndex, isClient]);

  const goToPrevious = useCallback(() => {
    if (startIndex <= 0 || !navContainerRef.current || !measureRef.current)
      return;

    const containerWidth = navContainerRef.current.clientWidth;
    const arrowsWidth = 80;
    const availableWidth = containerWidth - arrowsWidth;

    let backCount = 0;
    let currentWidth = 0;
    const gapWidth = 24;

    // Batch read widths
    const itemElements = Array.from(
      measureRef.current.children,
    ) as HTMLElement[];
    const itemWidths = itemElements.map((el) => el.offsetWidth);

    // Go backwards from startIndex-1
    for (let i = startIndex - 1; i >= 0; i--) {
      // const itemEl = itemElements[i];
      // if (!itemEl) continue;
      const itemWidth = itemWidths[i];
      if (itemWidth === undefined) continue;

      const widthWithGap = itemWidth + (backCount > 0 ? gapWidth : 0);

      if (backCount === 0) {
        backCount = 1;
        currentWidth += itemWidth;
      } else if (currentWidth + widthWithGap <= availableWidth) {
        backCount++;
        currentWidth += widthWithGap;
      } else {
        break;
      }
    }

    setStartIndex(Math.max(0, startIndex - backCount));
  }, [startIndex, menuItems]);

  const goToNext = useCallback(() => {
    if (!hasMore) return;

    const lastVisibleIndex = visibleIndices[visibleIndices.length - 1];
    if (
      lastVisibleIndex !== undefined &&
      lastVisibleIndex < menuItems.length - 1
    ) {
      setStartIndex(lastVisibleIndex + 1);
    }
  }, [hasMore, visibleIndices, menuItems.length]);

  useEffect(() => {
    if (!isClient) return;
    // Initial calculation
    calculateVisibleItems();

    let animationFrameId: number;
    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        calculateVisibleItems();
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateVisibleItems, isClient]);

  const canGoPrev = startIndex > 0;
  const canGoNext = hasMore;

  return (
    <>
      <div
        ref={containerRef}
        className="bg-naka-blue md:bg-white shadow-md relative z-20 overflow-visible"
      >
        <div className="absolute inset-0 z-0 md:hidden bg-[url('/bg/footer_pattent.png')] bg-repeat opacity-60 pointer-events-none" />
        <div className="container mx-auto  flex items-center justify-between md:justify-center relative min-h-15 md:min-h-12.5">
          {/* Mobile Menu Button (Left) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="p-1 text-white hover:bg-white/10 rounded transition-colors"
            >
              <Menu size={28} strokeWidth={2} />
            </button>
          </div>

          {/* Centered Menu Links (Desktop) - Incremental Reveal */}
          <div className="hidden md:flex items-center justify-center w-full overflow-visible">
            <div
              ref={navContainerRef}
              className={`w-full overflow-visible ${showArrows ? "grid grid-cols-[1fr_auto] gap-4" : "flex justify-center"}`}
            >
              {/* HIDDEN Measurement Container */}
              <div
                ref={measureRef}
                className="absolute invisible pointer-events-none opacity-0 flex"
              >
                {menuItems.map((item: any, index) => (
                  <div
                    key={`measure-${index}`}
                    className="px-3 whitespace-nowrap font-bold text-sm uppercase"
                  >
                    {item.label || "DANH MỤC"}
                  </div>
                ))}
              </div>

              {/* Menu Items */}
              <ul
                ref={navItemsRef}
                className={`flex ${showArrows ? "justify-start" : "justify-center"} items-center gap-2 md:gap-6 py-2 md:py-0 h-12 md:h-14 list-none m-0 p-0 max-w-full overflow-visible`}
              >
                {menuItems.map((item: any, index) => {
                  if (!visibleIndices.includes(index)) return null;

                  if (item.component) {
                    return (
                      <li
                        key={`nav-item-${index}`}
                        className="shrink-0 h-full flex items-center"
                      >
                        {item.component}
                      </li>
                    );
                  }

                  return (
                    <li
                      key={`nav-item-${index}`}
                      className="relative shrink-0 h-full flex items-center"
                    >
                      <Link
                        href={item.href as any}
                        className="h-full flex items-center px-3 font-bold text-naka-blue text-sm sm:text-base lg:text-sm uppercase hover:bg-naka-blue hover:text-white transition-colors whitespace-nowrap"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Navigation Buttons */}
              {showArrows && (
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={goToPrevious}
                    disabled={!canGoPrev}
                    className={`p-2 rounded transition-colors ${
                      !canGoPrev
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-naka-blue/10"
                    } text-naka-blue`}
                    aria-label="Previous items"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={!canGoNext}
                    className={`p-2 rounded transition-colors ${
                      !canGoNext
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-naka-blue/10"
                    } text-naka-blue`}
                    aria-label="Next items"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Logo Title (Center) */}
          <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="text-white font-serif text-lg sm:text-xl font-bold tracking-wider uppercase whitespace-nowrap">
              {t("mobile_title")}
            </div>
            <div className="text-[10px] sm:text-xs text-white/80 tracking-widest uppercase">
              {t("mobile_subtitle")}
            </div>
          </div>

          {/* Search Icon (Right) - Mobile Only */}
          <div className="flex items-center md:hidden absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-full transition-colors ${
                isSearchOpen
                  ? "bg-white text-naka-blue"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isSearchOpen ? (
                <X size={24} strokeWidth={2.5} />
              ) : (
                <Search size={24} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Search Panel */}
        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      </div>
    </>
  );
};

export default NavigationMenu;
