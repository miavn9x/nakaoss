"use client";

import React from "react";

interface ViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  filePath: string;
}

export default function ViewerModal({
  isOpen,
  onClose,
  fileName,
  filePath,
}: ViewerModalProps) {
  if (!isOpen) return null;

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Xem tài liệu: ${fileName}`}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-red-400 text-xl"
                aria-hidden="true"
              >
                picture_as_pdf
              </span>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">{fileName}</h2>
              <p className="text-slate-400 text-xs">Xem trực tiếp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* PDF viewer — browser tự render PDF trong iframe */}
        <div className="flex-1 min-h-[70vh]">
          <iframe
            src={filePath}
            title={fileName}
            className="w-full h-full min-h-[70vh] border-0"
          />
        </div>
      </div>
    </div>
  );
}
