// frontend/shared/lib/image.ts

import { IMAGE_URL, API_URL } from "@/shared/config/api.config";

export function getImageUrl(
  url: string | null | undefined,
  defaultValue: string = "",
): string {
  if (!url) return defaultValue;

  // 1. Handle Absolute URLs and Blobs/Data URIs - return as is
  if (
    url.startsWith("http") ||
    url.startsWith("https") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  // 2. Handle Relative URLs
  // If we're using devtunnels proxy mode, ALWAYS return relative path
  // This ensures server and client render the same URL
  if (process.env.NEXT_PUBLIC_API_URL === "/api-proxy") {
    // Return relative path so Next.js rewrites can handle it
    const path = url.startsWith("/") ? url : `/${url}`;
    return path;
  }

  // 3. For non-proxy mode (localhost dev, LAN, production)
  const imageBaseUrl = IMAGE_URL || "http://localhost:4001";
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${imageBaseUrl}${path}`;
}

export function getRelativeImageUrl(url: string): string {
  if (!url) return "";
  const envImageUrl = IMAGE_URL;

  if (envImageUrl && url.startsWith(envImageUrl)) {
    return url.replace(envImageUrl, "");
  }

  // Also handle localhost fallbacks if env var is not set matches
  const localhostAliases = ["http://localhost:4001", "http://127.0.0.1:4001"];
  for (const alias of localhostAliases) {
    if (url.startsWith(alias)) {
      return url.replace(alias, "");
    }
  }

  return url;
}

import DOMPurify from "isomorphic-dompurify";

export function transformHtmlContent(html: string): string {
  if (typeof document === "undefined" || !html) return html;

  // Sanitize potentially dangerous HTML content to prevent XSS
  const cleanHtml = DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"], // Allow iframes if needed (e.g. YouTube), otherwise remove
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, "text/html");
  const images = doc.querySelectorAll("img");

  images.forEach((img) => {
    const src = img.getAttribute("src");
    // Only transform local uploads
    if (src && src.startsWith("/uploads/")) {
      img.setAttribute("src", getImageUrl(src));
    }
  });

  return doc.body.innerHTML;
}
