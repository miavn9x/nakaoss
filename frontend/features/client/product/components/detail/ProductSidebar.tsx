"use client";

import React, { useState } from "react";
import ViewerModal from "./ViewerModal";
import DownloadModal from "./DownloadModal";

const FILE_NAME = "SNS3D40 Thông số kỹ thuật.pdf";
const FILE_PATH = "/product/Copy of SNS3D40调整铰链 .pdf";

export default function ProductSidebar() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      {/* Product Title - Desktop */}
      <div className="hidden lg:block pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
          Bộ thu gom Shuttle Closer Collect W
        </h1>
        <p className="text-lg text-slate-500">dành cho ray rộng 28mm</p>
        <div className="mt-4">
          <span className="text-xs text-slate-400">Mã đơn hàng: NHT-1052</span>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky top-24 flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg shadow-slate-200/50">
          <h3 className="font-bold text-slate-900 mb-4">
            Tải xuống &amp; Liên hệ
          </h3>
          <div className="flex flex-col gap-3">
            {/* Liên hệ */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" aria-hidden="true">
                contact_support
              </span>
              Liên hệ
            </button>

            {/* Xem tài liệu → ViewerModal iframe PDF */}
            <button
              onClick={() => setViewerOpen(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 group"
            >
              <span
                className="material-symbols-outlined text-slate-500 group-hover:text-red-500 transition-colors"
                aria-hidden="true"
              >
                picture_as_pdf
              </span>
              <span className="group-hover:text-red-600 transition-colors">
                Xem tài liệu kỹ thuật
              </span>
            </button>

            {/* Tải xuống → countdown modal */}
            <button
              onClick={() => setDownloadOpen(true)}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200 hover:border-blue-300 group"
            >
              <span
                className="material-symbols-outlined text-slate-500 group-hover:text-blue-600 transition-colors"
                aria-hidden="true"
              >
                download
              </span>
              <span className="group-hover:text-blue-700 transition-colors">
                Tải tài liệu kỹ thuật
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ViewerModal — iframe PDF, browser render trực tiếp */}
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
