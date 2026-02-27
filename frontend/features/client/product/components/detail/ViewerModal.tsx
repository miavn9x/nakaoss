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
      <div className="relative bg-white w-full container mx-auto flex flex-col overflow-hidden max-h-[95vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-naka-blue shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white text-xl"
                aria-hidden="true"
              >
                picture_as_pdf
              </span>
            </div>
            <div>
              <h2 className="text-white font-display font-bold text-xs uppercase tracking-widest">
                {fileName}
              </h2>
              <p className="text-white/60 text-xs font-display mt-0.5">
                Xem trực tiếp
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

        {/* PDF viewer */}
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
