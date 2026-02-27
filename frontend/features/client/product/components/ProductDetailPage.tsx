"use client";

import React from "react";
import ProductBreadcrumb from "./detail/ProductBreadcrumb";
import ProductGallery from "./detail/ProductGallery";
import ProductFeatures from "./detail/ProductFeatures";
import ProductSpecs from "./detail/ProductSpecs";
import ProductVideo from "./detail/ProductVideo";
import ProductSidebar from "./detail/ProductSidebar";
import RelatedProducts from "./detail/RelatedProducts";

/**
 * Trang chi tiết sản phẩm: Bộ thu gom Shuttle Closer Collect W / NHT-1052
 * Chuyển đổi từ index.html sang TSX, tách thành các component con trong /detail
 */
export default function ProductDetailPage() {
  return (
    <div className="bg-[#f6f7f8] text-slate-900 antialiased font-sans min-h-screen">
      {/* Breadcrumb điều hướng */}
      <ProductBreadcrumb />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cột trái: Gallery + nội dung chi tiết */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Tiêu đề - chỉ hiện trên mobile */}
            <div className="lg:hidden">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Bộ thu gom Shuttle Closer Collect W (dành cho ray rộng 28mm) /
                NHT-1052
              </h1>
              <p className="text-slate-500">Mã đơn hàng: NHT-1052</p>
            </div>

            {/* Ảnh sản phẩm */}
            <ProductGallery />

            {/* Tính năng & điều khoản sử dụng */}
            <ProductFeatures />

            {/* Bảng thông số kỹ thuật */}
            <ProductSpecs />

            {/* Video sản phẩm */}
            <ProductVideo />
          </div>

          {/* Cột phải: Sidebar CTA */}
          <ProductSidebar />
        </div>

        {/* Sản phẩm liên quan */}
        <RelatedProducts />
      </main>
    </div>
  );
}
