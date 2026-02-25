"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/shared/lib/axios";
import { toast } from "react-toastify";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ConfirmRoleFlow() {
  // --- Hooks & Init ---
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("ConfirmRole");

  // Lấy mã code từ URL
  const code = params?.code as string;

  // State lưu thông tin sau khi giải mã
  const [userId, setUserId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- Effect: Giải mã Token ---
  useEffect(() => {
    if (code) {
      try {
        // Giải mã Base64 -> JSON
        const decoded = atob(decodeURIComponent(code));
        const json = JSON.parse(decoded);
        setUserId(json.id);
        setToken(json.token);
      } catch (e) {
        // Mã xác thực lỗi -> bỏ qua
      }
    }
  }, [code]);

  // --- Render: Lỗi (Thiếu thông tin) ---
  if (!userId || !token) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-[#8B0000]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 uppercase">
            {t("invalidLink")}
          </h2>
          <p className="text-gray-600 mb-6">{t("invalidLinkDesc")}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors font-bold uppercase text-sm"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    );
  }

  // --- Xử lý: Xác nhận ---
  const handleConfirm = async () => {
    try {
      setLoading(true);
      // Gọi API xác thực
      const response = await axiosInstance.post(
        `/user/verify-role?userId=${userId}&token=${token}`,
      );

      // Kiểm tra lỗi logic từ Backend trả về
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response.data?.errorCode) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new Error(
          (response.data.message as string) || t("verificationFailed"),
        );
      }

      // Thành công
      setSuccess(true);
      toast.success(t("successMessage"));

      // Chuyển hướng sau 3s
      setTimeout(() => {
        router.push("/wfourtech");
      }, 3000);
    } catch (error) {
      toast.error(t("expiredLink"));
    } finally {
      setLoading(false);
    }
  };

  // --- Render: Thành công ---
  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white p-8 rounded-md shadow-2xl border-t-4 border-[#8B0000] animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
            <ShieldCheck className="w-10 h-10 text-green-600 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#8B0000] mb-3 uppercase">
            {t("successTitle")}
          </h2>
          <p className="text-gray-700 mb-8">{t("redirecting")}</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
            <div className="bg-[#8B0000] h-1.5 rounded-full animate-[progress_3s_ease-in-out_forwards] w-full origin-left"></div>
          </div>
          <Link
            href="/wfourtech"
            className="inline-block px-8 py-3 bg-[#8B0000] text-white font-bold uppercase hover:bg-[#A52A2A] transition-colors shadow-lg shadow-red-200"
          >
            {t("goToAdmin")}
          </Link>
        </div>
      </div>
    );
  }

  // --- Render: Mặc định (Chờ xác nhận) ---
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-md shadow-2xl border-t-4 border-[#8B0000]">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-[#8B0000]" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2 uppercase">
          {t("confirmTitle")}
        </h1>
        <p className="text-gray-700 mb-8 max-w-xs mx-auto">
          {t("confirmDesc")}
        </p>

        <div className="space-y-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-3 px-4 bg-[#8B0000] hover:bg-[#A52A2A] text-white font-bold uppercase shadow-lg shadow-red-100 transition-all transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t("confirmButton")
            )}
          </button>

          <Link
            href="/"
            className="block w-full py-3 text-gray-700 font-medium hover:text-[#8B0000] hover:bg-red-50 transition-colors uppercase text-sm"
          >
            {t("cancelButton")}
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8 italic">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
