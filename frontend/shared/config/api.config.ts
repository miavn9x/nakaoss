export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const protocol = window.location.protocol;

    // 1. Production domain
    if (host.includes("mia9x.id.vn")) {
      return "https://demo.mia9x.id.vn";
    }

    if (host.includes("vuabanhtrangjb.com")) {
      return "https://vuabanhtrangjb.com";
    }

    // 2. Tunnel Proxy (Devtunnels)
    // Nếu chạy trên tunnel, dùng api-proxy để tránh lỗi cookie/CORS
    if (host.includes("devtunnels.ms")) {
      // Return empty string because API_URL will handle the relative path
      // IMAGE_URL needs to be absolute or relative correctly
      return "";
    }

    // 3. LAN DEV (Truy cập bằng IP, ví dụ 192.168.1.9)
    // Backend thường chạy ở port 4000 trên cùng IP (Updated to 4000 based on current config)
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return `${protocol}//${host}:4000`;
    }

    // 4. Localhost Fallback
    return "http://localhost:4000";
  }

  // Server-side fallback
  // Check if NEXT_PUBLIC_IMAGE_URL indicates we're using devtunnels proxy
  if (
    process.env.NEXT_PUBLIC_API_URL === "/api-proxy" ||
    (process.env.NEXT_PUBLIC_IMAGE_URL &&
      process.env.NEXT_PUBLIC_IMAGE_URL.includes("devtunnels.ms"))
  ) {
    // Return empty string to use relative paths with Next.js rewrites
    return "";
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:4000";
  }

  // Ưu tiên dùng NEXT_PUBLIC_IMAGE_URL (thường là domain gốc không có /api)
  if (process.env.NEXT_PUBLIC_IMAGE_URL) {
    return process.env.NEXT_PUBLIC_IMAGE_URL;
  }

  // Nếu không có, dùng NEXT_PUBLIC_API_URL và cắt bỏ /api nếu có
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, "");
    // [FIX] Node.js 17+ resolves localhost to ::1 (IPv6). Force IPv4 (127.0.0.1) on server-side.
    if (typeof window === "undefined") {
      return url.replace("localhost", "127.0.0.1");
    }
    return url;
  }

  return "https://demo.mia9x.id.vn";
};

export const BASE_URL = getBaseUrl();

// Logic riêng cho API_URL và IMAGE_URL

// Với Tunnel:
// - Client-side: dùng Relative Path để Next.js Rewrites xử lý (/api-proxy -> localhost:4000/api)
// - Server-side: phải dùng absolute URL vì fetch không hiểu relative path
export const API_URL = (() => {
  // Client-side detection
  if (typeof window !== "undefined") {
    if (window.location.hostname.includes("devtunnels.ms")) {
      return "/api-proxy";
    }
    return `${BASE_URL}/api`;
  }

  // Server-side detection
  // Nếu đang dùng devtunnels proxy mode (NEXT_PUBLIC_API_URL === "/api-proxy")
  if (process.env.NEXT_PUBLIC_API_URL === "/api-proxy") {
    // Server-side phải dùng absolute URL
    return "http://localhost:4000/api";
  }

  return `${BASE_URL}/api`;
})();

// Với Image:
// - Tunnel: dùng chính domain hiện tại (để load ảnh từ public folder hoặc proxy)
// - Production/LAN/Localhost: Dùng BASE_URL (là URL của backend)
export const IMAGE_URL =
  typeof window !== "undefined" &&
  window.location.hostname.includes("devtunnels.ms")
    ? window.location.origin
    : BASE_URL;

// APP_URL: URL của Frontend (dùng cho SEO, Canonical, Alternates)
export const APP_URL = (() => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (typeof window !== "undefined") return window.location.origin;

  if (!BASE_URL || BASE_URL === "") return "http://localhost:3000";

  // Nếu là môi trường Dev (có port 4000), chuyển sang port 3000 của Frontend
  if (BASE_URL.includes(":4000")) {
    return BASE_URL.replace(":4000", ":3000");
  }

  // Production: BASE_URL chính là domain, dùng luôn làm APP_URL (loại bỏ /api nếu có)
  return BASE_URL.replace(/\/api$/, "");
})();
