import React, { useState } from "react";
import { Download, HardDrive, ShieldCheck } from "lucide-react";
import OtpModal from "./OtpModal";
import { backupService } from "../services/backupService";

interface BackupPanelProps {
  userEmail?: string;
}

const BackupPanel = ({ userEmail = "[EMAIL_ADDRESS]" }: BackupPanelProps) => {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  // sudoToken state should ideally be lifted up if shared, but for now local or handled via callbacks.
  // If we want Sudo Token to persist across Backup and Restore in same session?
  // The spec said "Lưu trong Ram (React State hoặc Context)".
  // For simplicity, let's keep it local or pass it.
  // Actually, asking for OTP every time is safer and simpler for v1.
  // Or we can store it in a parent component.

  const handleSudoSuccess = (token: string) => {
    // Trigger download with token
    // Note: The backend endpoint expects 'x-sudo-token' header usually.
    // Getting it via query param is easier for window.open, BUT my backend guard checks HEADERS.
    // I need to update Backend Controller to also check Query Param OR Header?
    // Or I use axios to download blob.

    // Let's use axios to download blob properly with headers.
    downloadBackup(token);
  };

  const downloadBackup = async (token: string) => {
    try {
      const blob = await backupService.downloadBackup(token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Generate filename based on date since we can't easily access headers with blob response directly in all browsers/axios versions comfortably without full response object.
      // Actually backupService returns blob.
      // Let's modify backupService to return title if possible, or just generate client side.
      // Client side generation is safer.
      const date = new Date().toISOString().slice(0, 10);
      const filename = `backup_full_${date}.zip`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải bản backup. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <HardDrive className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Sao Lưu Hệ Thống (Backup)</h3>
          <p className="text-sm text-gray-500">Database + Hình ảnh</p>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 grow">
        Tạo bản sao lưu đầy đủ của hệ thống bao gồm cơ sở dữ liệu MongoDB và
        toàn bộ thư mục hình ảnh/video.
        <br />
        File tải về có định dạng <b>.zip</b>.
      </p>

      <button
        onClick={() => setIsOtpOpen(true)}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
      >
        <Download className="w-4 h-4" />
        Tải Bản Sao Lưu Mới
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

export default BackupPanel;
