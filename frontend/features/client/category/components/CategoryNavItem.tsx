"use client";

import React from "react";
import { Link } from "@/language/i18n/navigation";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Category } from "../types/category.types";

interface CategoryNavItemProps {
  category: Category;
}

export default function CategoryNavItem({ category }: CategoryNavItemProps) {
  const currentLocale = useLocale();

  // Helper to get name by locale
  const getName = (cat: any) => {
    return (
      cat.details.find((d: any) => d.lang === currentLocale)?.name ||
      cat.details.find((d: any) => d.lang === "vi")?.name ||
      cat.code
    );
  };

  // Helper to get slug by locale (Hierarchical)
  const getSlug = (cat: any) => {
    // Nếu là category đặc biệt (đã xử lý ở chỗ khác) thì giữ nguyên
    // Ở đây ta muốn dùng link chuẩn /parent/child
    // Vì CategoryNavItem nhận vào object node trong tree, ta có thể xây dựng path nếu node có info.
    // Tuy nhiên, logic chuẩn nhất là dùng slug của chính nó nếu là cấp 1.
    // Với cấp 2, 3, ta cần path cha.
    // Tạm thời để đơn giản và đồng bộ với Page.tsx, ta sẽ dùng slug và để Page.tsx tự redirect nếu thiếu path.
    // NHƯNG để tránh redirect thừa, ta nên cố gắng lấy slug chuẩn.
    const detail =
      cat.details.find((d: any) => d.lang === currentLocale) ||
      cat.details.find((d: any) => d.lang === "vi");
    const slug = detail?.slug || cat.code.toLowerCase().replace(/_/g, "-");

    // TRÁNH dùng tiền tố /category/ vì route của ta là [...category] ở root
    return `/${slug}`;
  };

  const hasChildren = category.children && category.children.length > 0;
  // Check if any child has their own children (Level 3 exists)
  const isMegaMenu = category.children?.some(
    (child) => child.children && child.children.length > 0,
  );

  return (
    <div
      className={`group h-full flex items-center ${isMegaMenu ? "" : "relative"}`}
    >
      <Link
        href={getSlug(category) as any}
        className="h-full flex items-center px-3 font-bold text-naka-blue text-sm sm:text-base lg:text-sm uppercase hover:bg-naka-blue hover:text-white transition-colors whitespace-nowrap gap-1"
      >
        {getName(category)}
        {hasChildren && (
          <ChevronDown
            size={14}
            className="group-hover:rotate-180 transition-transform duration-200"
          />
        )}
      </Link>

      {/* Dropdown - Only if has children */}
      {hasChildren && (
        <>
          {isMegaMenu ? (
            /* MEGA MENU STYLE (Full Width) */
            <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t-2 border-naka-blue hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-200 z-50">
              <div className="grid grid-cols-4 gap-8 p-8">
                {category.children!.map((level2) => (
                  <div key={level2.code} className="space-y-3">
                    <div className="flex items-center gap-1 pb-2 border-b border-gray-200">
                      <Link
                        href={getSlug(level2) as any}
                        className="font-bold text-sm text-naka-blue hover:text-naka-blue/80 uppercase tracking-wide transition-colors"
                      >
                        {getName(level2)}
                      </Link>
                      {/* <ChevronDown size={12} className="text-[#7a1e1e]" /> */}
                    </div>
                    {level2.children && level2.children.length > 0 && (
                      <ul className="space-y-2">
                        {level2.children.map((level3) => (
                          <li key={level3.code}>
                            <Link
                              href={getSlug(level3) as any}
                              className="text-sm text-gray-700 hover:text-naka-blue hover:translate-x-1 transition-all block py-1"
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
            </div>
          ) : (
            /* SIMPLE LIST STYLE (Dropdown) */
            <div className="absolute top-full left-0 min-w-[250px] bg-white shadow-xl border-t-2 border-naka-blue hidden group-hover:block animate-in fade-in slide-in-from-top-1 duration-200 z-50">
              <ul className="py-2">
                {category.children!.map((level2) => (
                  <li key={level2.code}>
                    <Link
                      href={getSlug(level2) as any}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-naka-blue/5 hover:text-naka-blue border-b border-gray-100 last:border-0 transition-colors"
                    >
                      {getName(level2)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
