import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";

const withNextIntlConfig = withNextIntl("./language/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false, // Hide "X-Powered-By: Next.js" header
  productionBrowserSourceMaps: false, // SECURITY: Disable sourcemaps in production (F103/104)
  images: {
    // Trình duyệt hỗ trợ sẽ nhận AVIF/WebP; còn lại fallback jpg/png
    formats: ["image/avif", "image/webp"],

    // Thêm mốc 1536 để Next Image phát biến thể 1536w (tránh nhảy 1920w)
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1280, 1366, 1440, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cho phép tải ảnh từ các domain bên ngoài
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "vuabanhtrangjb.com", pathname: "/**" },

      // Dev API local phục vụ ảnh
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/**",
      },
      // Allow images from other device IPs during development
      {
        protocol: "http",
        hostname: "192.168.1.9",
        port: "4000",
        pathname: "/**",
      },
      // Dev Tunnel HTTPS (cho test từ xa)
      {
        protocol: "https",
        hostname: "**.devtunnels.ms", // Use double asterisk for subdomains if supported, or just verify single *
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "83xqq1xp-4000.asse.devtunnels.ms", // Explicit add for safety
        pathname: "/**",
      },
    ],
    unoptimized: false,
    minimumCacheTTL: 60,
  },
  // @ts-ignore
  allowedDevOrigins: [
    "localhost:3000",
    "http://localhost:3000",
    "192.168.1.9:3000",
    "http://192.168.1.9:3000",
    "192.168.1.9",
    "*.devtunnels.ms",
    "*.ngrok-free.app",
  ],
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        // Proxy API requests to Backend Tunnel (port 4000)
        destination: "https://83xqq1xp-4000.asse.devtunnels.ms/api/:path*",
      },
      {
        source: "/uploads/:path*",
        // Proxy Image requests to Backend Tunnel (port 4000)
        destination: "https://83xqq1xp-4000.asse.devtunnels.ms/uploads/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Balanced CSP (Secure but Next.js compatible)
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.devtunnels.ms; " + // Added unsafe-inline for Next.js
              "style-src 'self' 'unsafe-inline' https://*.devtunnels.ms https://fonts.googleapis.com; " +
              "img-src 'self' data: blob: https: http:; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "connect-src 'self' https://*.devtunnels.ms http://localhost:* http://127.0.0.1:* http://192.168.*:*; " +
              "base-uri 'self'; " +
              "form-action 'self'; " +
              "frame-ancestors 'self';",
          },
          // Cross-Origin Resource Policy (Balanced mode)
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin", // Less strict than same-origin, allows external resources
          },
          // COEP/COOP disabled - Too strict for Next.js with external fonts/images
          // Enabling these would break Google Fonts and external resources
          // {
          //   key: "Cross-Origin-Embedder-Policy",
          //   value: "require-corp",
          // },
          // {
          //   key: "Cross-Origin-Opener-Policy",
          //   value: "same-origin",
          // },
        ],
      },
    ];
  },
};

export default withNextIntlConfig(nextConfig);
