"use client";

import { AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Wait for animation
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case "info":
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-50 text-red-900";
      case "warning":
        return "bg-yellow-50 text-yellow-900";
      case "info":
      default:
        return "bg-blue-50 text-blue-900";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
      case "info":
      default:
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-300 relative z-10 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center gap-3 ${getHeaderColor()}`}
        >
          <div className="p-2 bg-white/60 rounded-full">{getIcon()}</div>
          <h3 className="text-lg font-bold flex-1">{title}</h3>
          <button
            onClick={!isLoading ? onClose : undefined}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 ${getButtonColor()} disabled:opacity-50`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
