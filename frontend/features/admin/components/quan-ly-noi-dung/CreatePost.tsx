"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { toast } from "react-toastify";
import {
  Save,
  ArrowLeft,
  Eye,
  FileText,
  Globe,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import SunEditorComponent from "@/shared/components/SunEditorComponent";
import {
  EnhancedImageUpload,
  MediaItem,
} from "@/features/admin/components/shared/EnhancedImageUpload";
import { MediaUsageEnum } from "@/features/admin/components/media/types/adminMedia.types";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import {
  usePosts,
  usePostMutations,
  type MediaCover,
  type PostDetail,
} from "@/features/admin/components/quan-ly-noi-dung/hooks/usePosts";
import { useTranslations } from "next-intl";
import CategoryCascadedSelect from "./components/CategoryCascadedSelect";

interface PostFormData {
  category: string;
  isFeatured: boolean;
  isNew: boolean;
  visibility: "PUBLIC" | "MEMBERS_ONLY";
  cover: MediaCover;
  details: Record<
    string,
    { title: string; description: string; content: string }
  >;
}

export default function CreatePost() {
  const t = useTranslations("Content");
  const { setCurrentPage } = useAdminPage();
  const { createPost } = usePostMutations();

  // Define LANGUAGES and CATEGORIES inside component to access t()
  const LANGUAGES = [
    { code: "vi", label: t("languageLabels.vi"), flag: "🇻🇳" },
    { code: "en", label: t("languageLabels.en"), flag: "🇬🇧" },
    { code: "cn", label: t("languageLabels.zh"), flag: "🇨🇳" },
    { code: "bo", label: t("languageLabels.bo"), flag: "🏳️" },
  ];

  const [activeLang, setActiveLang] = useState("vi");
  const [postData, setPostData] = useState<PostFormData>({
    category: "",
    isFeatured: false,
    isNew: true,
    visibility: "PUBLIC",
    cover: { mediaCode: "", url: "" },
    details: {
      vi: { title: "", description: "", content: "" },
      en: { title: "", description: "", content: "" },
      cn: { title: "", description: "", content: "" },
      bo: { title: "", description: "", content: "" },
    },
  });

  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Helper to get current detail
  const currentDetail = postData.details[activeLang];

  const handleDetailChange = (field: keyof PostDetail, value: string) => {
    setPostData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [activeLang]: {
          ...prev.details[activeLang],
          [field]: value,
        },
      },
    }));
  };

  // EnhancedImageUpload handles upload/delete automatically
  const handleCoverChange = (newCover: MediaItem | MediaItem[] | null) => {
    setPostData((prev) => ({
      ...prev,
      cover: (newCover as MediaItem) || { mediaCode: "", url: "" },
    }));
  };

  const handleSave = async () => {
    // Validation: Require title in Vietnamese at least
    if (!postData.details.vi.title.trim()) {
      setSaveError(t("titleRequiredVi"));
      setActiveLang("vi");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Transform details object to array
      const detailsArray = Object.entries(postData.details)
        .map(([lang, detail]) => ({
          lang,
          ...detail,
        }))
        .filter((d) => d.title.trim() !== ""); // Only keep languages with content? Or keep all?
      // Should keep all or at least VI. Let's keep all to ensure structure.

      const payload: any = {
        category: postData.category,
        isFeatured: postData.isFeatured,
        isNew: postData.isNew,
        visibility: postData.visibility,
        cover: postData.cover,
        details: Object.entries(postData.details).map(([lang, detail]) => ({
          lang,
          title:
            detail.title || (lang === "vi" ? "" : postData.details.vi.title), // Fallback? No, just send empty
          description: detail.description,
          content: detail.content,
        })),
      };

      const response = await createPost(payload);

      // Handle success message from backend code
      const successMsg = response?.message || "CREATE_POST_SUCCESS";
      toast.success(t(`messages.${successMsg}`));

      // Reset
      setPostData({
        category: "",
        isFeatured: false,
        isNew: true,
        visibility: "PUBLIC",
        cover: { mediaCode: "", url: "" },
        details: {
          vi: { title: "", description: "", content: "" },
          en: { title: "", description: "", content: "" },
          cn: { title: "", description: "", content: "" },
          bo: { title: "", description: "", content: "" },
        },
      });
      setCurrentPage("content-posts");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;

      // Try to localize known error codes
      const translated = t(`errors.${errorMsg}`);

      // If translation key is returned (meaning missing), use generic or original
      if (translated === `errors.${errorMsg}`) {
        toast.error(errorMsg || t("failedToSavePost"));
      } else {
        toast.error(translated);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isPreview) {
    const displayDetail = postData.details[activeLang];
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm border max-w-7xl mx-auto">
          <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg">
            <button
              onClick={() => setIsPreview(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              {t("backToEditor")}
            </button>
            <div className="flex gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`px-3 py-1 rounded text-sm ${activeLang === lang.code ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-8">
            <article className="prose max-w-none">
              {postData.cover.url && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={postData.cover.url}
                    alt="Cover"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              <h1 className="text-4xl font-bold mb-4">
                {displayDetail.title || t("noTitle")}
              </h1>
              <div className="flex gap-3 mb-6">
                {postData.isNew && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                    Mới
                  </span>
                )}
                {postData.isFeatured && (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                    Nổi bật
                  </span>
                )}
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase">
                  {postData.category}
                </span>
              </div>
              <p className="text-xl text-gray-600 italic mb-8 border-l-4 border-gray-300 pl-4">
                {displayDetail.description || t("noDescription")}
              </p>
              <div
                dangerouslySetInnerHTML={{
                  __html: displayDetail.content || "<p>(Chưa có nội dung)</p>",
                }}
              />
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <button
              id="btn-back-to-list"
              title="Back to Posts List"
              onClick={() => setCurrentPage("content-posts")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {t("createNewPost")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("multilingualContentEditor")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPreview(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all"
            >
              <Eye className="w-4 h-4" />
              {t("preview")}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? t("saving") : t("publishPost")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 border-r border-gray-200 bg-white min-h-[calc(100vh-80px)]">
            {/* Language Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${
                    activeLang === lang.code
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {saveError && (
              <div className="m-6 mb-0 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                {saveError}
              </div>
            )}

            {/* Editor Inputs */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("postTitleLabel")} (
                  {LANGUAGES.find((l) => l.code === activeLang)?.label}){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentDetail.title}
                  onChange={(e) => handleDetailChange("title", e.target.value)}
                  placeholder={t("titlePlaceholder", {
                    language:
                      LANGUAGES.find((l) => l.code === activeLang)?.label ?? "",
                  })}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("description")}
                </label>
                <textarea
                  value={currentDetail.description}
                  onChange={(e) =>
                    handleDetailChange("description", e.target.value)
                  }
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("content")}
                </label>
                <div className="prose-editor">
                  <SunEditorComponent
                    key={activeLang}
                    value={currentDetail.content}
                    onChange={(content) =>
                      handleDetailChange("content", content)
                    }
                    placeholder={t("contentEditorPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings (Right) */}
          <div className="lg:col-span-4 bg-gray-50 p-6 space-y-8 h-full">
            {/* 1. Cover Image */}
            <EnhancedImageUpload
              mode="single"
              value={postData.cover.url ? postData.cover : null}
              onChange={handleCoverChange}
              usage={MediaUsageEnum.POST}
              title={t("coverImage")}
            />

            {/* 2. Categorization (Dynamic) */}
            <CategoryCascadedSelect
              value={postData.category}
              onChange={(code) =>
                setPostData((prev) => ({ ...prev, category: code }))
              }
              activeLang={activeLang}
            />

            {/* 3. Visibility & Flags */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-500" />
                {t("form.sections.visibilityAndPermissions")}
              </h3>

              <div className="space-y-4">
                {/* Visibility */}
                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    {t("form.sections.accessRights")}
                  </span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="PUBLIC"
                        checked={postData.visibility === "PUBLIC"}
                        onChange={() =>
                          setPostData((prev) => ({
                            ...prev,
                            visibility: "PUBLIC",
                          }))
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {t("form.options.publicWithIcon")}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="MEMBERS_ONLY"
                        checked={postData.visibility === "MEMBERS_ONLY"}
                        onChange={() =>
                          setPostData((prev) => ({
                            ...prev,
                            visibility: "MEMBERS_ONLY",
                          }))
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {t("membersOnlyLabelWithIcon")}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Flags */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={postData.isNew}
                      onChange={(e) =>
                        setPostData((prev) => ({
                          ...prev,
                          isNew: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500 fill-current" />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900">
                          {t("form.options.isNew")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("form.options.isNewDesc")}
                        </span>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={postData.isFeatured}
                      onChange={(e) =>
                        setPostData((prev) => ({
                          ...prev,
                          isFeatured: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
                    />
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900">
                          {t("form.options.isFeatured")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t("form.options.isFeaturedDesc")}
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
