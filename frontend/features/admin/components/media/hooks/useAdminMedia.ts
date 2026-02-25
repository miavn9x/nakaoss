// TUYỆT ĐỐI KHÔNG SỬA CODE NAY

import { mediaService } from "@/features/admin/components/media/services/adminMedia";
import { MediaUsageEnum } from "../types/adminMedia.types";
import { useCallback, useState } from "react";

type MediaResponse<T = any> = {
  isLoading: boolean;
  error: any;
  data: T | null;
};

export function useAdminMedia() {
  // uploadSingle state
  const [uploadSingleState, setUploadSingleState] = useState<MediaResponse>({
    isLoading: false,
    error: null,
    data: null,
  });
  // uploadMultiple state
  const [uploadMultipleState, setUploadMultipleState] = useState<MediaResponse>(
    {
      isLoading: false,
      error: null,
      data: null,
    }
  );
  // hardDelete state
  const [hardDeleteState, setHardDeleteState] = useState<MediaResponse>({
    isLoading: false,
    error: null,
    data: null,
  });

  const uploadSingle = useCallback(
    async (file: File, usage: MediaUsageEnum) => {
      setUploadSingleState({ isLoading: true, error: null, data: null });
      try {
        const data = await mediaService.uploadSingle(file, usage);
        setUploadSingleState({ isLoading: false, error: null, data });
        return data;
      } catch (error) {
        setUploadSingleState({ isLoading: false, error, data: null });
        throw error;
      }
    },
    []
  );

  const uploadMultiple = useCallback(
    async (files: File[], usage: MediaUsageEnum) => {
      setUploadMultipleState({ isLoading: true, error: null, data: null });
      try {
        const data = await mediaService.uploadMultiple(files, usage);
        setUploadMultipleState({ isLoading: false, error: null, data });
        return data;
      } catch (error) {
        setUploadMultipleState({ isLoading: false, error, data: null });
        throw error;
      }
    },
    []
  );

  const hardDelete = useCallback(async (mediaCode: string) => {
    setHardDeleteState({ isLoading: true, error: null, data: null });
    try {
      const data = await mediaService.hardDelete(mediaCode);
      setHardDeleteState({ isLoading: false, error: null, data });
      return data;
    } catch (error) {
      setHardDeleteState({ isLoading: false, error, data: null });
      throw error;
    }
  }, []);

  /**
   * Replace old image with new one
   * - Deletes old image (by mediaCode if available, otherwise by URL)
   * - Uploads new image
   * - Returns new image data (url + mediaCode)
   */
  const replaceImage = useCallback(
    async (
      file: File,
      usage: MediaUsageEnum,
      options?: {
        oldMediaCode?: string;
        oldImageUrl?: string;
      }
    ) => {
      const { oldMediaCode, oldImageUrl } = options || {};

      // Step 1: Delete old image if exists (don't fail if delete fails)
      if (oldMediaCode) {
        // Fast deletion using mediaCode
        try {
          await mediaService.hardDelete(oldMediaCode);
        } catch {
          // Silently continue - old image might not exist anymore
        }
      } else if (oldImageUrl) {
        // Fallback: deletion using URL (for old records without mediaCode)
        try {
          await mediaService.hardDeleteByUrl(oldImageUrl);
        } catch {
          // Silently continue - old image might not exist anymore
        }
      }

      // Step 2: Upload new image (this can still throw errors)
      const result = await uploadSingle(file, usage);

      return {
        url: result?.data?.url || "",
        mediaCode: result?.data?.mediaCode || "",
      };
    },
    [uploadSingle]
  );

  return {
    uploadSingle,
    uploadSingleState,
    uploadMultiple,
    uploadMultipleState,
    hardDelete,
    replaceImage,
  };
}
