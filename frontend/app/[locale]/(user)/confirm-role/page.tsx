import ConfirmRoleFlow from "@/features/auth/components/ConfirmRoleFlow";
import { Suspense } from "react";

// Cần Suspense vì ConfirmRoleFlow dùng useSearchParams
export default function ConfirmRolePage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <Suspense fallback={<div className="text-center p-12">Đang tải...</div>}>
        <ConfirmRoleFlow />
      </Suspense>
    </div>
  );
}
