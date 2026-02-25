"use client";

import React, { useState } from "react";
import { useCategoryTree } from "../hooks/useCategoryTree";
import { Link } from "@/language/i18n/navigation";
import { useLocale } from "next-intl";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Category } from "../types/category.types";

export default function MegaMenu() {
  const { categories, loading } = useCategoryTree();
  const currentLocale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Helper to get name by locale
  const getName = (cat: Category) => {
    return (
      cat.details.find((d) => d.lang === currentLocale)?.name ||
      cat.details.find((d) => d.lang === "vi")?.name ||
      cat.code
    );
  };

  // Helper to get slug by locale
  const getSlug = (cat: Category) => {
    // NOTE: Adjust route pattern as needed. Assuming /category/[slug]
    const slug =
      cat.details.find((d) => d.lang === currentLocale)?.slug ||
      cat.details.find((d) => d.lang === "vi")?.slug ||
      "#";
    return `/category/${slug}`;
  };

  if (loading) return null; // Or a skeleton loader
  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative group">
      {/* Trigger Button - Main Nav Item */}
      <button
        className="h-full flex items-center px-3 font-bold text-[#7a1e1e] text-sm sm:text-base lg:text-sm uppercase hover:bg-[#c9a149] hover:text-[#7a1e1e] transition-colors whitespace-nowrap gap-1"
        onMouseEnter={() => setActiveCategory(null)}
      >
        Danh Mục
        <ChevronDown size={14} />
      </button>

      {/* Dropdown Container */}
      <div className="absolute top-full left-0 w-[800px] bg-[#fdfce8] shadow-2xl rounded-b-xl border border-t-0 border-[#7a1e1e]/10 hidden group-hover:flex animate-in fade-in slide-in-from-top-1 duration-200 z-50 overflow-hidden">
        {/* Level 1 Sidebar */}
        <div className="w-1/3 bg-[#7a1e1e]/5 py-4">
          {categories.map((cat) => (
            <div
              key={cat.code}
              onMouseEnter={() => setActiveCategory(cat.code)}
              className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                activeCategory === cat.code
                  ? "bg-[#7a1e1e] text-[#fdfce8]"
                  : "text-[#7a1e1e] hover:bg-[#7a1e1e]/10"
              }`}
            >
              <Link
                href={getSlug(cat) as any}
                className="font-bold text-sm uppercase flex-1"
              >
                {getName(cat)}
              </Link>
              {cat.children && cat.children.length > 0 && (
                <ChevronRight size={14} />
              )}
            </div>
          ))}
        </div>

        {/* Level 2 & 3 Content Area */}
        <div className="w-2/3 p-6 min-h-[300px]">
          {categories.map((level1) => (
            <div
              key={level1.code}
              className={activeCategory === level1.code ? "block" : "hidden"}
            >
              <div className="mb-4 pb-2 border-b border-[#7a1e1e]/10">
                <h3 className="text-xl font-serif font-bold text-[#7a1e1e] uppercase">
                  {getName(level1)}
                </h3>
              </div>

              {level1.children && level1.children.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {level1.children.map((level2) => (
                    <div key={level2.code} className="space-y-2">
                      <Link
                        href={getSlug(level2) as any}
                        className="block font-bold text-sm text-[#7a1e1e] hover:underline uppercase mb-1"
                      >
                        {getName(level2)}
                      </Link>

                      {/* Level 3 items */}
                      {level2.children && level2.children.length > 0 && (
                        <ul className="space-y-1">
                          {level2.children.map((level3) => (
                            <li key={level3.code}>
                              <Link
                                href={getSlug(level3) as any}
                                className="text-xs text-gray-600 hover:text-[#7a1e1e] hover:underline transition-colors block py-0.5"
                              >
                                {getName(level3)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 italic text-sm">
                  Chưa có danh mục con
                </div>
              )}
            </div>
          ))}

          {/* Default View if nothing hovered (Optional) */}
          {!activeCategory && (
            <div className="h-full flex items-center justify-center text-gray-400 italic relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]"></div>
              <span className="relative z-10">
                Chọn một danh mục để xem chi tiết
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
