"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { TECHNICAL_DATA } from "../../data/technicalData";

/** Hiện tất cả sản phẩm từ tất cả category, trừ sản phẩm hiện tại */
interface RelatedProductsProps {
  currentId?: string;
  maxItems?: number;
}

export default function RelatedProducts({
  currentId = "NHT-1052",
  maxItems = 3,
}: RelatedProductsProps) {
  const locale = useLocale();

  // Gộp tất cả sản phẩm từ mọi category, loại trừ sản phẩm đang xem
  const all = Object.values(TECHNICAL_DATA)
    .flat()
    .filter((p) => p.id !== currentId)
    .slice(0, maxItems);

  if (all.length === 0) return null;

  return (
    <div className="mt-20 pt-10 border-t border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span
            className="material-symbols-outlined text-naka-blue"
            aria-hidden="true"
          >
            precision_manufacturing
          </span>
          Sản phẩm liên quan
        </h2>
        <Link
          href={`/${locale}/product`}
          className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-sm"
        >
          Xem tất cả
          <span
            className="material-symbols-outlined text-base"
            aria-hidden="true"
          >
            arrow_right_alt
          </span>
        </Link>
      </div>

      {/* Card grid — UI giống TechnicalDetailsSection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {all.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 group flex flex-col"
          >
            {/* Image */}
            <div className="relative bg-white flex items-center justify-center h-56 p-6 border-b border-gray-100">
              <div className="absolute top-4 left-4 bg-[#eff6ff] text-naka-blue text-[9px] font-bold font-display px-3 py-1 rounded-[4px] uppercase tracking-widest border border-blue-100 z-10">
                {product.tag}
              </div>
              <img
                src={product.img}
                alt={product.name}
                className="max-h-full max-w-full object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-serif font-bold text-base text-naka-blue mb-2 line-clamp-2 min-h-12">
                {product.name}
              </h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                {product.desc}
              </p>

              {/* Specs mini */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-5 mt-auto">
                {product.specs.slice(0, 4).map((spec, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="flex items-center text-[9px] text-naka-blue font-bold uppercase tracking-wider">
                      <span
                        className="material-symbols-outlined text-xs mr-1"
                        aria-hidden="true"
                      >
                        {spec.icon}
                      </span>
                      {spec.label}
                    </div>
                    <div className="text-[11px] text-[#333333] font-semibold pl-4">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}/product/${product.id}`}
                className="w-full py-2.5 rounded-[4px] border border-naka-blue text-naka-blue hover:bg-naka-blue hover:text-white font-bold font-display text-[10px] transition-all duration-300 tracking-[0.15em] uppercase flex items-center justify-center gap-2"
              >
                Thông số chi tiết
                <span
                  className="material-symbols-outlined text-sm"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
