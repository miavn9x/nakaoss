"use client";

import React, { useState } from "react";
import ViewerModal from "./ViewerModal";
import DownloadModal from "./DownloadModal";

const FILE_NAME = "SNS3D40 Th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt.xlsx";
const FILE_PATH = "/product/Copy of SNS3D40\u8c03\u6574\u94f0\u94fe .xlsx";

interface DocumentViewerProps {
  publicFileUrl?: string;
}

export default function DocumentViewer({ publicFileUrl }: DocumentViewerProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const officeViewerUrl = publicFileUrl
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicFileUrl)}`
    : null;

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined" aria-hidden="true">
          folder_open
        </span>
        Tài liệu kỹ thuật
      </h3>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-green-600 text-xl"
                aria-hidden="true"
              >
                table_view
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {FILE_NAME}
              </p>
              <p className="text-xs text-slate-400">Microsoft Excel (.xlsx)</p>
            </div>
          </div>
          {/* Hai nút riêng */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-lg text-xs font-semibold transition-colors"
            >
              <span
                className="material-symbols-outlined text-sm"
                aria-hidden="true"
              >
                preview
              </span>
              Xem
            </button>
            <button
              onClick={() => setDownloadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <span
                className="material-symbols-outlined text-sm"
                aria-hidden="true"
              >
                download
              </span>
              Tải xuống
            </button>
          </div>
        </div>

        {/* Preview area */}
        {officeViewerUrl ? (
          <iframe
            src={officeViewerUrl}
            title={`Xem tài liệu: ${FILE_NAME}`}
            className="w-full h-[400px] border-0"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-10 bg-linear-to-b from-slate-50 to-white">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-green-600 text-3xl"
                  aria-hidden="true"
                >
                  table_view
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-white text-sm"
                  aria-hidden="true"
                >
                  preview
                </span>
              </div>
            </div>
            <div className="text-center px-6">
              <p className="font-semibold text-slate-700 text-sm">
                Xem trực tiếp khả dụng sau khi triển khai
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Bấm <strong>Xem</strong> để mở trong cửa sổ mới hoặc{" "}
                <strong>Tải xuống</strong> để lưu về máy.
              </p>
            </div>
            {/* Quick specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 w-full max-w-lg">
              {[
                {
                  icon: "inventory_2",
                  label: "Vật liệu",
                  value: "Thép KG / POM",
                },
                { icon: "qr_code", label: "Mã SP", value: "NHT-1052" },
                { icon: "straighten", label: "Ray", value: "28mm" },
                { icon: "scale", label: "Tải trọng", value: "10–40 kg" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col gap-1"
                >
                  <span
                    className="material-symbols-outlined text-blue-500 text-base"
                    aria-hidden="true"
                  >
                    {s.icon}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {s.label}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hai modal tách biệt */}
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
