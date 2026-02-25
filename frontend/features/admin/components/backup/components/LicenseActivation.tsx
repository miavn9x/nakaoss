import React, { useState } from "react";
import { Key, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import { licenseService } from "../services/licenseService";

interface LicenseActivationProps {
  onSuccess: () => void;
}

const LicenseActivation: React.FC<LicenseActivationProps> = ({ onSuccess }) => {
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Activating license...");
      const result = await licenseService.activate(licenseKey);
      console.log("Activation result:", result);
      setSuccess(true);
      setTimeout(() => {
        console.log("Triggering onSuccess callback...");
        // Force reload page to ensure clean state and bypass any React state caching issues
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Kích hoạt thất bại. Vui lòng kiểm tra lại key.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Kích Hoạt Thành Công!
        </h3>
        <p className="text-gray-500">Đang chuyển hướng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
        <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-90" />
        <h2 className="text-xl font-bold">Yêu Cầu Kích Hoạt</h2>
        <p className="text-blue-100 text-sm mt-1">
          Vui lòng nhập License Key để mở khóa tính năng Backup.
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !licenseKey.trim()}
            className="w-full h-11 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group border border-blue-500/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Kích Hoạt Ngay"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Liên hệ quản trị viên nếu bạn chưa có mã kích hoạt.
        </p>
      </div>
    </div>
  );
};

export default LicenseActivation;
