import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { CATEGORIES } from "./CategorySection";
import Pagination from "../../post/components/Pagination";
import { TECHNICAL_DATA } from "../data/technicalData";

const ITEMS_PER_PAGE = 6;

interface TechnicalDetailsSectionProps {
  activeCategory: string;
  activeSubCategory: string | null;
}

export default function TechnicalDetailsSection({
  activeCategory,
  activeSubCategory,
}: TechnicalDetailsSectionProps) {
  const locale = useLocale();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const activeCategoryName =
    CATEGORIES.find((cat) => cat.id === activeCategory)?.name || "......";

  let allProducts = TECHNICAL_DATA[activeCategory] || [];
  if (activeSubCategory) {
    allProducts = allProducts.filter(
      (p) => p.subCategory === activeSubCategory,
    );
  }

  // Reset page when filtering changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSubCategory]);

  // Pagination logic
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = allProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Pre-calculate common class names to avoid complex JSX template literals
  const gridContainerClass =
    viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      : "flex flex-col gap-6";

  const toggleBtnBase =
    "w-10 h-10 flex items-center justify-center rounded-[6px] transition-all duration-300";
  const toggleBtnActive =
    "bg-naka-blue text-white shadow-md shadow-naka-blue/20";
  const toggleBtnInactive =
    "bg-white text-slate-400 border border-slate-200 hover:border-naka-blue/30";

  return (
    <section className="mt-24">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
        <h3 className="font-serif text-2xl md:text-3xl text-naka-blue font-bold flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl">
            precision_manufacturing
          </span>
          Sản phẩm danh mục {activeCategoryName}
        </h3>

        {/* View Toggle Buttons */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`${toggleBtnBase} ${viewMode === "grid" ? toggleBtnActive : toggleBtnInactive}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              grid_view
            </span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`${toggleBtnBase} ${viewMode === "list" ? toggleBtnActive : toggleBtnInactive}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              view_list
            </span>
          </button>
        </div>
      </div>

      {/* Products Grid/List Container */}
      <div className={gridContainerClass}>
        {currentProducts.map((product, idx) => {
          // Dynamic class names for each product item
          const isGridMode = viewMode === "grid";

          // Card container: flex-col on mobile always, flex-row on md+ only if list mode
          const cardClass = `bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 group flex flex-col ${!isGridMode ? "md:flex-row h-auto" : "h-full"}`;

          // Image container: border-b on mobile always, border-r on md+ only if list mode
          const imageContainerClass = `relative bg-white flex items-center justify-center border-gray-100 h-72 p-6 border-b ${!isGridMode ? "md:w-64 md:h-auto md:p-4 md:border-b-0 md:border-r" : ""}`;

          // Content container: center only if list mode and on md+
          const contentContainerClass = `p-4 md:p-6 flex-1 flex flex-col ${!isGridMode ? "md:justify-center" : ""}`;

          // Title: min-h on mobile always (since it's grid), but remove on md+ if list mode
          const titleClass = `font-serif font-bold text-base md:text-lg text-naka-blue mb-2 line-clamp-2 min-h-12 ${isGridMode ? "md:min-h-14" : "md:min-h-0"}`;

          // Description: max-w only if list mode and on md+
          const descClass = `text-xs md:text-sm text-slate-500 font-display font-light mb-4 md:mb-6 line-clamp-3 leading-relaxed min-h-10 ${isGridMode ? "md:min-h-12" : "md:min-h-0 md:max-w-2xl"}`;

          // Specs Grid: max-w only if list mode and on md+
          const specsGridClass = `grid grid-cols-2 gap-y-3 md:gap-y-4 gap-x-2 md:gap-x-4 mb-6 md:mb-8 mt-auto ${!isGridMode ? "md:max-w-md" : ""}`;

          // Action Button: full width on mobile always, mx-auto only if list mode and on md+
          const buttonClass = `w-full py-2.5 md:py-3 rounded-[4px] border border-naka-blue text-naka-blue hover:bg-naka-blue hover:text-white font-bold font-display text-[9px] md:text-[11px] transition-all duration-300 tracking-[0.15em] md:tracking-[0.2em] uppercase flex items-center justify-center gap-2 mt-auto ${!isGridMode ? "md:w-fit md:px-8 md:mx-auto" : ""}`;

          return (
            <div key={idx} className={cardClass}>
              {/* Image & Tag */}
              <div className={imageContainerClass}>
                <div className="absolute top-4 left-4 md:top-5 md:left-5 bg-[#eff6ff] text-naka-blue text-[9px] md:text-[11px] font-bold font-display px-3 py-1 md:px-4 md:py-1.5 rounded-[4px] uppercase tracking-[0.1px] md:tracking-[0.15em] border border-blue-100 z-10">
                  {activeSubCategory === "dong-cua"
                    ? "Đóng cửa nhẹ nhàng"
                    : product.tag}
                </div>
                <img
                  alt={product.name}
                  className="max-h-full max-w-full object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                  src={product.img}
                />
              </div>

              {/* Content Section */}
              <div className={contentContainerClass}>
                <h4 className={titleClass}>{product.name}</h4>
                <p className={descClass}>{product.desc}</p>

                {/* Specs Grid */}
                <div className={specsGridClass}>
                  {product.specs.map((spec: any, sIdx: number) => (
                    <div key={sIdx} className="flex flex-col gap-0.5 md:gap-1">
                      <div className="flex items-center text-[9px] md:text-[11px] text-naka-blue font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-xs md:text-sm mr-1 md:mr-1.5">
                          {spec.icon}
                        </span>
                        {spec.label}
                      </div>
                      <div className="text-[11px] md:text-xs text-[#333333] font-semibold pl-4 md:pl-6">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button → Link đến trang chi tiết */}
                <Link
                  href={`/${locale}/product/${product.id}`}
                  className={buttonClass}
                >
                  Thông số chi tiết{" "}
                  <span className="material-symbols-outlined text-sm md:text-base">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => {
            setCurrentPage(page);
            window.scrollTo({
              top:
                document.getElementById("technical-details")?.offsetTop || 800,
              behavior: "smooth",
            });
          }}
        />
      )}
    </section>
  );
}
