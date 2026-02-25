"use client";

import React from "react";
import { Database, Download, RefreshCw, ShieldCheck } from "lucide-react";
import { useAdminPage } from "../../contexts/AdminPageContext";

const BackupDashboardWidget = () => {
  const { setCurrentPage } = useAdminPage();

  return (
    <div className="bg-linear-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Database className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 text-indigo-200">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">
            Bảo Trì Hệ Thống beta trả phí
          </span>
        </div>

        <h3 className="text-xl font-bold mb-1">Backup & Restore</h3>
        <p className="text-indigo-200 text-sm mb-6 max-w-md">
          Sao lưu dữ liệu định kỳ hoặc khôi phục hệ thống khi gặp sự cố.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage("backup")}
            className="bg-white text-indigo-900 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Sao Lưu Ngay
          </button>
          <button
            onClick={() => setCurrentPage("backup")}
            className="bg-indigo-800/50 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border border-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Khôi Phục
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupDashboardWidget;
