"use client";

import { Link } from "@/language/i18n/navigation";
import { Search, X, Menu, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import SearchOverlay from "./SearchOverlay";
import { useTranslations } from "next-intl";

import { useCategoryTree } from "@/features/client/category/hooks/useCategoryTree";
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

  const t = useTranslations("Navigation");

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
    return [
      { label: t("home"), href: "/" },
      { label: t("product_service"), href: "/product" },
      { label: t("advantage"), href: "/advantage" },
      {
        label: t("news"),
        href: "/news",
        subItems: [
          { label: t("news_projects"), href: "/news/projects" },
          { label: t("news_nakao"), href: "/news/nakao" },
        ],
      },
      { label: t("recruitment"), href: "/recruitment" },
      { label: t("document"), href: "/document" },
      { label: t("contact"), href: "/contact" },
    ];
  }, [t]);

  return (
    <>
      <div
        ref={containerRef}
        className="bg-naka-blue md:bg-white shadow-md relative z-20 overflow-visible"
      >
        <div className="absolute inset-0 z-0 md:hidden bg-[url('/bg/footer_pattent.png')] bg-repeat opacity-60 pointer-events-none" />
        <div className="container mx-auto flex items-center justify-between relative min-h-15 md:min-h-14 px-4">
          {/* Logo (Left) */}
          <Link
            href="/"
            className="relative z-20 flex items-center py-2 shrink-0 group"
          >
            <img
              src="/logo/Logo-NAKAO.png"
              alt="NAKAO VIỆT NAM"
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Centered Menu Links (Desktop) - Simple Static Menu */}
          <nav className="hidden md:flex items-center justify-center flex-1 h-full overflow-visible px-4">
            <ul className="flex items-center justify-center gap-1 lg:gap-2 h-full list-none m-0 p-0 overflow-visible">
              {menuItems.map((item, index) => (
                <li
                  key={`nav-item-${index}`}
                  className="relative h-full shrink-0 flex items-center group/item hover:z-30"
                >
                  <Link
                    href={item.href as any}
                    className="flex items-center gap-1.5 px-3 lg:px-4 h-10 font-bold text-naka-blue text-[11px] lg:text-xs xl:text-sm uppercase hover:bg-naka-blue hover:text-white transition-all whitespace-nowrap rounded-md"
                  >
                    {item.label}
                    {item.subItems && (
                      <ChevronDown
                        size={14}
                        className="opacity-50 group-hover/item:rotate-180 transition-transform"
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.subItems && (
                    <div className="absolute top-full left-0 w-max min-w-full max-w-[280px] opacity-0 -translate-y-2 pointer-events-none group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:pointer-events-auto transition-all duration-300 z-50">
                      <div className="pt-2">
                        <ul className="bg-white shadow-2xl border border-gray-100 rounded-lg overflow-hidden flex flex-col p-1.5">
                          {item.subItems.map((sub, sIdx) => (
                            <li key={`sub-${sIdx}`}>
                              <Link
                                href={sub.href as any}
                                className="block px-4 py-2.5 font-bold text-naka-blue text-[11px] lg:text-xs uppercase hover:bg-naka-blue hover:text-white rounded-md transition-colors whitespace-nowrap"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Controls (Mobile Only) */}
          <div className="flex items-center gap-2 md:hidden relative z-20">
            {/* Search Icon */}
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
                <Search size={22} strokeWidth={2.5} />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={onToggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="p-2 text-white hover:bg-white/10 rounded transition-colors"
            >
              <Menu size={26} strokeWidth={2.5} />
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
