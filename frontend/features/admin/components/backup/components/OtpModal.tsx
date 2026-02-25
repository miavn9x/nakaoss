import React, { useState } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { backupService } from "../services/backupService";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
  email: string; // Display user email
}

const OtpModal = ({ isOpen, onClose, onSuccess, email }: OtpModalProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"request" | "verify">("request");

  if (!isOpen) return null;

  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await backupService.requestOtp();
      setStep("verify");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    setError(null);
    try {
      const res = await backupService.verifyOtp(otp);

      if (res.data?.sudoToken) {
        onSuccess(res.data.sudoToken);
        onClose();
        // Reset state
        setStep("request");
        setOtp("");
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-lg">Xác thực bảo mật (Sudo Mode)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm">
            Tính năng này yêu cầu quyền quản trị cao cấp. Vui lòng xác thực OTP
            qua email <b>{email}</b>.
          </p>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          {step === "request" ? (
            <div className="flex justify-center py-4">
              <button
                onClick={handleRequestOtp}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Gửi mã OTP qua Email
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhập mã OTP (6 số)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="000000"
                  autoFocus
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full flex justify-center items-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Xác nhận & Tiếp tục"
                )}
              </button>
              <button
                onClick={() => setStep("request")}
                className="w-full text-center text-sm text-gray-500 hover:text-red-600 mt-2"
              >
                Gửi lại mã?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
