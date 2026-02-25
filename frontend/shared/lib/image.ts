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
  // If IMAGE_URL is empty (Local Dev Rewrite mode or Tunnel Proxy mode)
  // return relative path so Next.js handles it via rewrites
  if (!IMAGE_URL || process.env.NEXT_PUBLIC_API_URL === "/api-proxy") {
    const path = url.startsWith("/") ? url : `/${url}`;
    return path;
  }

  // 3. For production or specified IMAGE_URL
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${IMAGE_URL}${path}`;
}

export function getRelativeImageUrl(url: string): string {
  if (!url) return "";
  const envImageUrl = IMAGE_URL;

  if (envImageUrl && url.startsWith(envImageUrl)) {
    return url.replace(envImageUrl, "");
  }

  // Also handle localhost fallbacks if env var is not set matches
  const localhostAliases = ["http://localhost:4000", "http://127.0.0.1:4000"];
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
