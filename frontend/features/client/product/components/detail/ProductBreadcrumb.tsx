import React from "react";
import Link from "next/link";

export default function ProductBreadcrumb() {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm text-slate-500 flex-wrap"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span
            className="material-symbols-outlined text-[14px]"
            aria-hidden="true"
          >
            chevron_right
          </span>
          <Link
            href="/product"
            className="hover:text-blue-600 transition-colors"
          >
            Phần cứng
          </Link>
          <span
            className="material-symbols-outlined text-[14px]"
            aria-hidden="true"
          >
            chevron_right
          </span>
          <Link
            href="/product"
            className="hover:text-blue-600 transition-colors"
          >
            Bộ thu gom cửa
          </Link>
          <span
            className="material-symbols-outlined text-[14px]"
            aria-hidden="true"
          >
            chevron_right
          </span>
          <span className="text-slate-900 font-medium">
            Shuttle Closer Collect W - NHT-1052
          </span>
        </nav>
      </div>
    </div>
  );
}
