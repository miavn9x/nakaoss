"use client";

import { useTranslations } from "next-intl";

import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/shared/lib/image";
import TinyMCEContent from "@/shared/components/TinyMCEContent";
import { BannerType, IBanner } from "../types";

interface BannerListProps {
  banners: IBanner[];
  loading: boolean;
  togglingMap: Record<string, boolean>;
  onCreate: () => void;
  onEdit: (banner: IBanner) => void;
  onDelete: (code: string) => void;
  onToggleVisibility: (banner: IBanner) => void;
}

export default function BannerList({
  banners,
  loading,
  togglingMap,
  onCreate,
  onEdit,
  onDelete,
  onToggleVisibility,
}: BannerListProps) {
  const t = useTranslations("AdminBanner");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">{t("columns.image")}</th>
                <th className="px-6 py-4">{t("columns.title")}</th>
                <th className="px-6 py-4">{t("columns.type")}</th>
                <th className="px-6 py-4">{t("columns.order")}</th>
                <th className="px-6 py-4">{t("columns.visibility")}</th>
                <th className="px-6 py-4 text-right">{t("columns.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    {t("noBanners")}
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner.code} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="relative w-24 h-12 rounded overflow-hidden bg-gray-100 border">
                        <Image
                          src={getImageUrl(banner.imageUrl)}
                          alt={banner.title.replace(/<[^>]*>/g, "")}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TinyMCEContent
                        content={banner.title}
                        className="font-medium text-gray-900"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          banner.type === BannerType.MAIN
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {banner.type === BannerType.MAIN
                          ? t("mainBanner")
                          : t("subBanner")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{banner.order}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onToggleVisibility(banner)}
                        disabled={togglingMap[banner.code]}
                        title={t("columns.visibility")}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                          banner.isVisible ? "bg-green-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            banner.isVisible ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onEdit(banner)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t("editBanner")}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(banner.code)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t("columns.action")} // Use generic action or delete specific key if needed, reused action header for now or add 'delete'
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
