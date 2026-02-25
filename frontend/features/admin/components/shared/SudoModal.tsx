"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/shared/lib/axios";
import { toast } from "react-toastify";
import { Shield, X, Lock } from "lucide-react";

export default function SudoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setOtp("");
      // Tự động request OTP khi mở modal (Optional, nhưng UX tốt hơn)
      requestOtp();
    };

    window.addEventListener("sudo-required", handleOpen);
    return () => {
      window.removeEventListener("sudo-required", handleOpen);
    };
  }, []);

  const requestOtp = async () => {
    try {
      setRequestLoading(true);
      await axiosInstance.post("/auth/sudo/request");
      toast.info("Mã xác thực đã được gửi đến email của bạn.");
    } catch (error) {
      toast.error("Không thể gửi mã xác thực. Vui lòng thử lại.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!otp) return;

    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/sudo/verify", { otp });
      const { sudoToken } = res.data.data;

      // Lưu token vào Session Storage (để axios lấy dùng lại)
      sessionStorage.setItem("sudoToken", sudoToken);

      // Thông báo cho Axios biết đã thành công để retry request
      window.dispatchEvent(new CustomEvent("sudo-success"));

      setIsOpen(false);
      toast.success("Xác thực admin thành công!");
    } catch (error) {
      toast.error("Mã xác thực không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("sudo-cancel"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Chế độ Bảo mật (Sudo Mode)</h3>
              <p className="text-xs text-blue-100 opacity-90">
                Xác thực danh tính để tiếp tục
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Đóng"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            Hành động này yêu cầu xác thực bảo mật cấp cao. Chúng tôi đã gửi mã
            OTP 6 số đến email của bạn.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập mã xác thực (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 placeholder:text-base"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={requestOtp}
                disabled={requestLoading || loading}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                {requestLoading ? "Đang gửi..." : "Gửi lại mã?"}
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all flex items-center justify-center min-w-[100px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
