"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ImagePlus, XCircle, Loader2 } from "lucide-react";
import { getImageUrl } from "@/shared/lib/image";
import { useAdminMedia } from "@/features/admin/components/media/hooks/useAdminMedia";
import { MediaUsageEnum } from "@/features/admin/components/media/types/adminMedia.types";

export interface MediaItem {
  url: string;
  mediaCode: string;
}

interface EnhancedImageUploadProps {
  // Mode: 'single' for one image, 'multiple' for gallery
  mode?: "single" | "multiple";

  // For single mode
  value?: MediaItem | null;

  // For multiple mode
  values?: MediaItem[];

  // Callback when image(s) change
  onChange: (value: MediaItem | MediaItem[] | null) => void;

  // Media usage type (POST, USER, etc.)
  usage: MediaUsageEnum;

  // UI customization
  maxImages?: number; // For multiple mode
  disabled?: boolean;
  accept?: string;
  maxSizeMB?: number;
  title?: string;
  description?: string;
  className?: string;
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  mode = "single",
  value,
  values = [],
  onChange,
  usage,
  maxImages = 10,
  disabled = false,
  accept = "image/*",
  maxSizeMB = 5,
  title,
  description,
  className = "",
}) => {
  const { uploadSingle, uploadSingleState, replaceImage, hardDelete } =
    useAdminMedia();
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      setLocalError(null);

      try {
        if (mode === "single") {
          const file = files[0];

          // Validate file size
          if (file.size > maxSizeMB * 1024 * 1024) {
            throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
          }

          // If replacing existing image, use replaceImage
          if (value?.mediaCode) {
            const result = await replaceImage(file, usage, {
              oldMediaCode: value.mediaCode,
            });
            onChange(result);
          } else {
            // New upload
            const result = await uploadSingle(file, usage);
            onChange({
              url: result.data.url,
              mediaCode: result.data.mediaCode,
            });
          }
        } else {
          // Multiple mode - upload all files
          const currentCount = values.length;
          const availableSlots = maxImages - currentCount;
          const filesToUpload = files.slice(0, availableSlots);

          if (filesToUpload.length < files.length) {
            setLocalError(`Only ${availableSlots} more images allowed`);
          }

          // Upload files sequentially
          const newImages: MediaItem[] = [];
          for (const file of filesToUpload) {
            if (file.size > maxSizeMB * 1024 * 1024) {
              setLocalError(`${file.name} exceeds ${maxSizeMB}MB limit`);
              continue;
            }

            const result = await uploadSingle(file, usage);
            newImages.push({
              url: result.data.url,
              mediaCode: result.data.mediaCode,
            });
          }

          onChange([...values, ...newImages]);
        }

        // Clear input
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setLocalError(errorMsg);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [
      mode,
      value,
      values,
      onChange,
      usage,
      maxSizeMB,
      maxImages,
      uploadSingle,
      replaceImage,
    ],
  );

  const handleRemove = useCallback(
    async (mediaCode: string) => {
      try {
        // Physical delete from server
        await hardDelete(mediaCode);
      } catch (err) {
        // Continue even if delete fails (file might not exist)
        console.warn("Failed to delete media:", err);
      }

      // Update UI state
      if (mode === "single") {
        onChange(null);
      } else {
        onChange(values.filter((item) => item.mediaCode !== mediaCode));
      }
    },
    [mode, values, onChange, hardDelete],
  );

  const isLoading = uploadSingleState.isLoading;
  const error = localError || uploadSingleState.error;

  if (mode === "single") {
    return (
      <div
        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 ${className}`}
      >
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-gray-500" />
          {title || "Ảnh"}
        </h3>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {String(error)}
          </div>
        )}

        <div className="relative">
          {value?.url ? (
            <div className="group relative rounded-lg overflow-hidden border border-gray-200 aspect-video">
              <Image
                src={getImageUrl(value.url)}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <button
                type="button"
                title="Remove Image"
                onClick={() => handleRemove(value.mediaCode)}
                disabled={disabled || isLoading}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {description || "Upload ảnh"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    (JPG, PNG, GIF, WebP - Max {maxSizeMB}MB)
                  </span>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileSelect}
                disabled={disabled || isLoading}
              />
            </label>
          )}
        </div>
      </div>
    );
  }

  // Multiple mode
  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-gray-500" />
          {title || "Gallery"}
        </h3>
        <span className="text-sm text-gray-500">
          {values.length} / {maxImages}
        </span>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {String(error)}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        {values.map((item) => (
          <div
            key={item.mediaCode}
            className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200"
          >
            <Image
              src={getImageUrl(item.url)}
              alt="Gallery item"
              fill
              className="object-cover"
              unoptimized={true}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <button
              type="button"
              title="Remove Image"
              onClick={() => handleRemove(item.mediaCode)}
              disabled={disabled || isLoading}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
            >
              <XCircle className="w-3 h-3" />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex flex-col items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-400 mt-1">Add</span>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              accept={accept}
              onChange={handleFileSelect}
              disabled={disabled || isLoading}
            />
          </label>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
};
