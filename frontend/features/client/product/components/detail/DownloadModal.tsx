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
      <div className="bg-white w-full max-w-sm overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-naka-blue px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-white text-2xl"
              aria-hidden="true"
            >
              download
            </span>
            <div>
              <h2 className="text-white font-display font-bold text-sm uppercase tracking-widest">
                Tải tài liệu
              </h2>
              <p className="text-white/70 text-xs font-display mt-0.5">
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
          <div className="w-full flex items-center gap-3 bg-slate-50 p-4 border border-slate-200">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-red-500 text-xl"
                aria-hidden="true"
              >
                picture_as_pdf
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-display font-semibold text-slate-800 truncate">
                {fileName}
              </p>
              <p className="text-xs font-display text-slate-400">
                PDF Document
              </p>
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="w-full py-4 font-display font-bold text-xs flex items-center justify-center gap-2 bg-naka-blue hover:bg-[#0f2147] text-white transition-all duration-200 cursor-pointer uppercase tracking-widest"
          >
            <span
              className="material-symbols-outlined text-sm"
              aria-hidden="true"
            >
              download
            </span>
            Tải xuống ngay
          </button>

          <p className="text-[11px] font-display text-slate-400 text-center uppercase tracking-widest">
            Tài liệu sản phẩm Nakao Vietnam
          </p>
        </div>
      </div>
    </div>
  );
}
