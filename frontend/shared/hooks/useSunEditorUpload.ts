"use client";
import { useCallback } from "react";
import { mediaService } from "@/features/admin/components/media/services/adminMedia";
import { MediaUsageEnum } from "@/features/admin/components/media/types/adminMedia.types";

export function useSunEditorUpload() {
  const handleImageUpload = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const result = await mediaService.uploadSingle(
          file,
          MediaUsageEnum.POST
        );
        // console.log("📦 Upload response:", result);
        let url = result?.data?.url || result?.url;
        if (!url) {
          return null;
        }

        // ✅ Trích xuất pathname từ URL tuyệt đối để luôn có đường dẫn tương đối
        try {
          const urlObj = new URL(url);
          url = urlObj.pathname; // Ví dụ: "/uploads/2025/08/..."
        } catch (e) {
          // Nếu URL không phải là URL tuyệt đối hợp lệ (ví dụ: đã là đường dẫn tương đối),
          // chúng ta giả định nó đã ở định dạng tương đối mong muốn.
        }

        return url; // Trả về đường dẫn tương đối
      } catch (error) {
        return null;
      }
    },
    []
  );

  const handleImageDelete = useCallback(async (src: string): Promise<void> => {
    try {
      // Normalize URL: convert full URL to relative path
      let normalizedSrc = src;

      if (src.startsWith("http://") || src.startsWith("https://")) {
        try {
          const url = new URL(src);
          normalizedSrc = url.pathname; // Extract only the path: /uploads/...
        } catch (e) {
          // Silently fail to parse URL
        }
      }

      // Delete by URL directly instead of trying to extract mediaCode
      await mediaService.hardDeleteByUrl(normalizedSrc);
    } catch (error) {
      // Silently fail - image already removed from content
    }
  }, []);

  return { handleImageUpload, handleImageDelete };
}
