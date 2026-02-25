/**
 * Extract mediaCode from a media URL
 * @param url - The media URL (e.g., "/uploads/banner/banner-abc123.jpg" or full URL)
 * @returns The mediaCode (e.g., "banner-abc123") or null if not found
 */
export function extractMediaCodeFromUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null;

  try {
    // Remove query params and hash if any
    const cleanUrl = url.split("?")[0].split("#")[0];

    // Extract filename from path (works for both relative and absolute URLs)
    const filename = cleanUrl.split("/").pop();
    if (!filename) return null;

    // Remove file extension to get mediaCode
    const mediaCode = filename.replace(/\.[^.]+$/, "");

    return mediaCode || null;
  } catch (error) {
    console.error("Error extracting mediaCode from URL:", error);
    return null;
  }
}
