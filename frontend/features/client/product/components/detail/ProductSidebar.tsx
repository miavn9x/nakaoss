"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import ViewerModal from "./ViewerModal";
import DownloadModal from "./DownloadModal";

const FILE_NAME = "SNS3D40 Thông số kỹ thuật.pdf";
const FILE_PATH = "/product/Copy of SNS3D40调整铰链 .pdf";

export default function ProductSidebar() {
  const locale = useLocale();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      {/* Product Title - Desktop */}
      <div className="hidden lg:block pb-6 border-b border-slate-200">
        <span className="inline-block text-naka-blue font-display font-bold tracking-widest uppercase mb-3 text-xs border-b-2 border-naka-blue/20 pb-1">
          Mã đơn hàng: NHT-1052
        </span>
        <h1 className="text-3xl font-serif font-black text-naka-blue mb-2 leading-tight uppercase tracking-tight">
          Bộ thu gom Shuttle Closer Collect W
        </h1>
        <p className="text-slate-500 font-display font-light">
          dành cho ray rộng 28mm
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="sticky top-24 flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg shadow-slate-200/50">
          <h3 className="font-display font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">
            Tải xuống &amp; Liên hệ
          </h3>
          <div className="flex flex-col gap-3">
            {/* Liên hệ */}
            <Link
              href={`/${locale}/contact#contact-form`}
              className="w-full bg-naka-blue hover:bg-[#0f2147] text-white font-display font-bold py-4 px-4 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              <span
                className="material-symbols-outlined text-sm"
                aria-hidden="true"
              >
                contact_support
              </span>
              Liên hệ tư vấn
            </Link>

            {/* Xem tài liệu → ViewerModal */}
            <button
              onClick={() => setViewerOpen(true)}
              className="w-full bg-slate-50 hover:bg-naka-blue/5 text-slate-700 hover:text-naka-blue font-display font-medium py-3.5 px-4 transition-colors flex items-center justify-center gap-2 border border-slate-200 hover:border-naka-blue/30 uppercase tracking-widest text-xs"
            >
              <span
                className="material-symbols-outlined text-sm"
                aria-hidden="true"
              >
                picture_as_pdf
              </span>
              Xem tài liệu kỹ thuật
            </button>

            {/* Tải xuống → DownloadModal */}
            <button
              onClick={() => setDownloadOpen(true)}
              className="w-full bg-white hover:bg-naka-blue/5 text-slate-700 hover:text-naka-blue font-display font-medium py-3.5 px-4 transition-colors flex items-center justify-center gap-2 border border-slate-200 hover:border-naka-blue/30 uppercase tracking-widest text-xs"
            >
              <span
                className="material-symbols-outlined text-sm"
                aria-hidden="true"
              >
                download
              </span>
              Tải tài liệu kỹ thuật
            </button>
          </div>
        </div>
      </div>

      <ViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        fileName={FILE_NAME}
        filePath={FILE_PATH}
      />
      <DownloadModal
        isOpen={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        fileName={FILE_NAME}
        filePath={FILE_PATH}
      />
    </div>
  );
}
