"use client";

import { toast } from "react-toastify";
import { MediaUsageEnum } from "@/features/admin/components/media/types/adminMedia.types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { bannerService } from "../services/banner.service";
import { BannerType, IBanner } from "../types";
import { CustomColorPicker } from "./CustomColorPicker";
import SunEditorComponent from "@/shared/components/SunEditorComponent";
import { useTranslations } from "next-intl";
import {
  EnhancedImageUpload,
  MediaItem,
} from "@/features/admin/components/shared/EnhancedImageUpload";

interface BannerFormProps {
  initialData?: IBanner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface BannerFormData {
  title: string;

  description: string;
  buttonText: string;
  imageUrl: string;
  imageMediaCode: string; // MediaCode for efficient deletion
  link: string;
  order: number;
  isVisible: boolean;
  type: BannerType;
  color: string;
  titleColor: string;

  buttonPos: { top: number; left: number };

  buttonSize: number;
  buttonColor: string;
  buttonTextColor: string;
  showTitle: boolean;

  showButton: boolean;
}

export function BannerForm({
  initialData,
  onSuccess,
  onCancel,
}: BannerFormProps) {
  const t = useTranslations("AdminBanner");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    defaultValues: {
      title: "",

      description: "",
      buttonText: "",
      imageUrl: "",
      imageMediaCode: "",
      link: "",
      order: 0,
      isVisible: true,
      type: BannerType.MAIN,
      color: "from-transparent to-transparent",
      titleColor: "#ffffff",

      buttonPos: { top: 60, left: 10 },

      buttonSize: 16,
      buttonColor: "#ffffff",
      buttonTextColor: "#000000",
      showTitle: true,

      showButton: true,
    },
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,

        description: initialData.description || "",
        buttonText: initialData.buttonText || "",
        imageUrl: initialData.imageUrl,
        imageMediaCode: initialData.imageMediaCode || "",
        link: initialData.link || "",
        order: initialData.order,
        isVisible: initialData.isVisible,
        type: initialData.type,
        color: initialData.color || "from-transparent to-transparent",
        titleColor: initialData.titleColor || "#ffffff",

        buttonPos: initialData.buttonPos || { top: 60, left: 10 },

        buttonSize: initialData.buttonSize || 16,
        buttonColor: initialData.buttonColor || "#ffffff",
        buttonTextColor: initialData.buttonTextColor || "#000000",
        showTitle: initialData.showTitle !== false, // default true

        showButton: initialData.showButton !== false,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: BannerFormData) => {
    try {
      setLoading(true);
      if (initialData) {
        await bannerService.update(initialData.code, data);
        toast.success(t("form.updateSuccess"));
      } else {
        await bannerService.create(data);
        toast.success(t("form.createSuccess"));
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(t("form.error"));
    } finally {
      setLoading(false);
    }
  };

  // EnhancedImageUpload handles upload/delete automatically
  const handleImageChange = (newImage: MediaItem | MediaItem[] | null) => {
    if (newImage && !Array.isArray(newImage)) {
      setValue("imageUrl", newImage.url);
      setValue("imageMediaCode", newImage.mediaCode);
    } else {
      setValue("imageUrl", "");
      setValue("imageMediaCode", "");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                {t("form.title")} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("showTitle")}
                  id="showTitle"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="showTitle" className="text-xs text-gray-500">
                  {t("form.show")}
                </label>
              </div>
            </div>
            <SunEditorComponent
              value={watch("title")}
              onChange={(content) => setValue("title", content)}
              placeholder={t("form.title")}
            />
            <input
              type="hidden"
              {...register("title", {
                required: t("validation.required", { field: t("form.title") }),
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.order")}
            </label>
            <input
              type="number"
              {...register("order", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* IsVisible */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isVisible")}
              id="isVisible"
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label
              htmlFor="isVisible"
              className="text-sm font-medium text-gray-700"
            >
              {t("form.showBanner")}
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {/* Image Upload */}
          <div>
            <EnhancedImageUpload
              mode="single"
              value={
                imageUrl
                  ? { url: imageUrl, mediaCode: watch("imageMediaCode") || "" }
                  : null
              }
              onChange={handleImageChange}
              usage={MediaUsageEnum.OTHER}
              title={t("form.image")}
            />
            <input
              type="hidden"
              {...register("imageUrl", {
                required: t("validation.required", { field: t("form.image") }),
              })}
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          {/* Button Text */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                {t("form.buttonText")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("showButton")}
                  id="showButton"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="showButton" className="text-xs text-gray-500">
                  {t("form.show")}
                </label>
              </div>
            </div>
            <input
              {...register("buttonText")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("form.buttonText")}
            />

            {/* Button Customization */}
            <div className="mt-2 bg-gray-50 p-3 rounded-md space-y-4 border border-gray-100">
              {/* Position */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-700">
                  <span>{t("form.buttonPosition")}</span>
                  <span>
                    Top: {watch("buttonPos.top")}% - Left:{" "}
                    {watch("buttonPos.left")}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">
                      {t("form.top")}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      {...register("buttonPos.top")}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">
                      {t("form.left")}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      {...register("buttonPos.left")}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">
                    {t("form.buttonBackground")}
                  </label>
                  <input
                    type="color"
                    {...register("buttonColor")}
                    className="h-8 w-12 cursor-pointer rounded border p-0.5 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">
                    {t("form.buttonTextCol")}
                  </label>
                  <input
                    type="color"
                    {...register("buttonTextColor")}
                    className="h-8 w-12 cursor-pointer rounded border p-0.5 bg-white"
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <div className="flex justify-between text-xs font-medium text-gray-700">
                    <span>
                      {t("form.buttonSize")} {watch("buttonSize")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="1"
                    {...register("buttonSize", { valueAsNumber: true })}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.link")}
            </label>
            <input
              {...register("link")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("form.backgroundColor")}
            </label>
            <select
              {...register("color")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="from-transparent to-transparent">
                {t("gradients.transparent")}
              </option>
              <option value="from-blue-900/90 via-blue-900/40 to-transparent">
                {t("gradients.bluePurple")}
              </option>
              <option value="from-black/90 via-black/40 to-transparent">
                {t("gradients.blackOverlay")}
              </option>
              <option value="from-red-900/90 via-red-900/40 to-transparent">
                {t("gradients.redBlack")}
              </option>
              <option value="from-indigo-900/90 via-indigo-900/40 to-transparent">
                {t("gradients.indigoBlue")}
              </option>
              <option value="from-purple-900/90 via-purple-900/40 to-transparent">
                {t("gradients.purplePink")}
              </option>
              <option value="from-green-900/90 via-green-900/40 to-transparent">
                {t("gradients.greenEmerald")}
              </option>
              <option value="from-gray-900/90 via-gray-900/40 to-transparent">
                {t("gradients.darkGray")}
              </option>
              {/* <option value="custom">{t("gradients.custom")}</option> Use custom directly if selected or needed via component */}
              <option value="custom">{t("gradients.custom")}</option>
            </select>
          </div>

          {/* Custom Color Picker */}
          {watch("color")?.startsWith("linear-gradient") ||
          watch("color") === "custom" ? (
            <CustomColorPicker
              initialColor={watch("color")}
              onChange={(gradient) => {
                setValue("color", gradient);
              }}
            />
          ) : null}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {t("form.cancel")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? t("form.update") : t("form.create")}
        </button>
      </div>
    </form>
  );
}
