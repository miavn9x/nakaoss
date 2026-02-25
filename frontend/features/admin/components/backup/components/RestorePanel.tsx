"use client";

import axiosInstance from "@/shared/lib/axios";
import React, { useState, useRef } from "react";
import {
  UploadCloud,
  RefreshCw,
  AlertTriangle,
  FileArchive,
  CheckCircle2,
} from "lucide-react";
import OtpModal from "./OtpModal";
import { backupService } from "../services/backupService";

interface RestorePanelProps {
  userEmail?: string;
}

const RestorePanel = ({
  userEmail = "admin@example.com",
}: RestorePanelProps) => {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sudoToken, setSudoToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".zip")) {
        alert("Chỉ chấp nhận file .zip");
        return;
      }
      setFile(selectedFile);
    }
  };

  const triggerRestore = () => {
    if (!file) {
      alert("Vui lòng chọn file backup (.zip)");
      return;
    }
    setIsOtpOpen(true);
  };

  const handleSudoSuccess = (token: string) => {
    setSudoToken(token);
    executeRestore(token);
  };

  const executeRestore = async (token: string) => {
    if (!file) return;

    setIsRestoring(true);
    setUploadProgress(0);

    try {
      await backupService.restoreBackup(file, token, (percent) => {
        setUploadProgress(percent);
      });

      alert("Khôi phục thành công! Hệ thống sẽ tự động đăng xuất.");

      // Perform full logout
      try {
        await axiosInstance.post("/auth/logout");
      } catch (err) {
        console.warn("Logout API failed", err);
      } finally {
        localStorage.setItem("auth-sync", `logout-${Date.now()}`);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/wfourtech";
      }
    } catch (error: any) {
      console.error(error);
      alert(`Lỗi khôi phục: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsRestoring(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Khôi Phục (Restore)</h3>
          <p className="text-sm text-gray-500">Ghi đè Data + Ảnh mới</p>
        </div>
      </div>

      <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
        <p className="text-xs text-orange-800 flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Cảnh báo: Hành động này sẽ xóa toàn bộ dữ liệu hiện tại và thay thế
          bằng bản backup.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-6 mb-4 text-center cursor-pointer transition-colors ${
          file
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
        }`}
        onClick={() => !isRestoring && fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".zip"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isRestoring}
          title="Chọn file backup"
        />

        {file ? (
          <div className="flex flex-col items-center text-green-700">
            <FileArchive className="w-8 h-8 mb-2" />
            <span className="font-medium truncate max-w-full">{file.name}</span>
            <span className="text-xs text-green-600">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <UploadCloud className="w-8 h-8 mb-2" />
            <span className="text-sm">Chọn file .zip để restore</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isRestoring && (
        <div className="mb-4 space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Đang tải lên & xử lý...</span>
            <span>{uploadProgress}%</span>
          </div>
          <progress
            value={uploadProgress}
            max={100}
            className="w-full h-2 rounded-full overflow-hidden bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-orange-500 [&::-moz-progress-bar]:bg-orange-500"
          />
        </div>
      )}

      <button
        onClick={triggerRestore}
        disabled={!file || isRestoring}
        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
      >
        {isRestoring ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        {isRestoring ? "Đang Khôi Phục..." : "Tiến Hành Khôi Phục"}
      </button>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleSudoSuccess}
        email={userEmail}
      />
    </div>
  );
};

// Helper for loading icon
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default RestorePanel;
