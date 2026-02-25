export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    // 1. Production domain
    if (host.includes("mia9x.id.vn")) return "https://demo.mia9x.id.vn";
    if (host.includes("vuabanhtrangjb.com"))
      return "https://vuabanhtrangjb.com";

    // 2. Local & Tunnel Proxy
    // Trả về rỗng để các đường dẫn trở thành tương đối, giúp Next.js Proxy/Rewrite xử lý
    // Đồng thời giúp fix lỗi Hydration Mismatch và lỗi Cookie
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.includes("devtunnels.ms")
    ) {
      return "";
    }

    return "http://localhost:4000";
  }

  // Server-side fallback (Node.js)
  // Luôn dùng absolute URL để fetch dữ liệu từ backend
  if (process.env.NEXT_PUBLIC_TUNNEL_URL)
    return process.env.NEXT_PUBLIC_TUNNEL_URL;
  if (process.env.NEXT_PUBLIC_IMAGE_URL)
    return process.env.NEXT_PUBLIC_IMAGE_URL;

  return "http://127.0.0.1:4000";
};

export const BASE_URL = getBaseUrl();

export const API_URL = (() => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Client-side: Dùng đường dẫn tương đối để Next.js Rewrites xử lý
    if (host.includes("devtunnels.ms")) return "/api-proxy";
    if (host === "localhost" || host === "127.0.0.1") return "/api";

    return `${BASE_URL}/api`;
  }

  // Server-side: Phải dùng absolute URL vì node-fetch không hiểu relative path
  if (process.env.NEXT_PUBLIC_API_URL === "/api-proxy")
    return "http://127.0.0.1:4000/api";

  return `${BASE_URL}/api`;
})();

export const IMAGE_URL = (() => {
  // Ưu tiên đường dẫn tương đối cho Image trong dev/tunnel để tránh Hydration Mismatch
  // Server và Client sẽ đều render ra cùng một chuỗi (ví dụ: /uploads/...)
  const isDevOrTunnel =
    process.env.NODE_ENV === "development" ||
    !!process.env.NEXT_PUBLIC_TUNNEL_URL ||
    (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("devtunnels.ms")));

  if (isDevOrTunnel) return "";

  // Production
  return BASE_URL || "";
})();

export const APP_URL = (() => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  if (typeof window !== "undefined") return window.location.origin;

  // Server-side fallback: Try to detect if we're in dev and use a sensible default
  return "http://localhost:3001";
})();
