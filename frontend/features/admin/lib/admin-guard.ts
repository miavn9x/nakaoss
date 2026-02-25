import { cookies } from "next/headers";
import { parseJwt } from "@/shared/lib/jwt";

const ALLOWED_ADMIN_ROLES = ["admin", "employment", "cskh"];

/**
 * Kiểm tra quyền truy cập vào trang Admin
 * @returns true nếu hợp lệ, false nếu không đủ quyền
 */
export async function verifyAdminAccess(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // 1. Phải có ít nhất accessToken hoặc refreshToken
    if (!accessToken && !refreshToken) {
      return false;
    }

    // 2. Nếu có accessToken, kiểm tra Role bằng cách parse
    if (accessToken) {
      try {
        const payload = parseJwt(accessToken);

        if (!payload || !payload.roles || !Array.isArray(payload.roles)) {
          return false;
        }

        const hasPermission = payload.roles.some((role: string) =>
          ALLOWED_ADMIN_ROLES.includes(role),
        );

        return hasPermission;
      } catch (e) {
        // Parse lỗi -> Token đểu, không cho qua
        return false;
      }
    }

    // 3. Nếu không có accessToken nhưng có refreshToken
    // Chúng ta cho phép truy cập tạm thời để CLIENT-SIDE có thể thực hiện refresh token.
    // Nếu refresh thất bại, Axios interceptor sẽ thực hiện redirect về trang chủ.
    return !!refreshToken;
  } catch (error) {
    console.error("Admin Access Verification Error:", error);
    return false;
  }
}
