"use client";

import React, { useCallback } from "react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  filePath: string;
}

export default function DownloadModal({
  isOpen,
  onClose,
  fileName,
  filePath,
}: DownloadModalProps) {
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  }, [filePath, fileName, onClose]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Tải tài liệu"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 to-blue-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-white text-2xl"
              aria-hidden="true"
            >
              download
            </span>
            <div>
              <h2 className="text-white font-bold text-base">Tải tài liệu</h2>
              <p className="text-blue-100 text-xs mt-0.5">
                Tài liệu kỹ thuật sản phẩm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-white/70 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-6 py-7 flex flex-col items-center gap-5">
          {/* File info */}
          <div className="w-full flex items-center gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-red-500 text-xl"
                aria-hidden="true"
              >
                picture_as_pdf
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {fileName}
              </p>
              <p className="text-xs text-slate-400">PDF Document</p>
            </div>
          </div>

          {/* Download button — bấm là tải ngay */}
          <button
            onClick={handleDownload}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              download
            </span>
            Tải xuống ngay
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            Tài liệu sản phẩm Nakao Vietnam
          </p>
        </div>
      </div>
    </div>
  );
}
