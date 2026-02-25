"use client";

import { useState, useEffect } from "react";
import type React from "react";
import {
  Save,
  ArrowLeft,
  Eye,
  FileText,
  Trash2,
  Globe,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import SunEditorComponent from "@/shared/components/SunEditorComponent";
import {
  EnhancedImageUpload,
  MediaItem,
} from "@/features/admin/components/shared/EnhancedImageUpload";
import { MediaUsageEnum } from "@/features/admin/components/media/types/adminMedia.types";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import {
  usePosts,
  usePost,
  usePostMutations,
  type Post,
  type MediaCover,
  type PostDetail,
} from "@/features/admin/components/quan-ly-noi-dung/hooks/usePosts";
import { useTranslations } from "next-intl";
import CategoryCascadedSelect from "./components/CategoryCascadedSelect";

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "cn", label: "中文", flag: "🇨🇳" },
  { code: "bo", label: "Tibetan", flag: "🏳️" },
];

// Main component state
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

export default function EditPost() {
  const t = useTranslations("Content");
  const { setCurrentPage } = useAdminPage();
  const { updatePost, deletePost } = usePostMutations(); // Use mutation hook to avoid fetching list

  /*
    Redefine LANGUAGES here if we want translated labels.
    However, language names themselves are usually kept in their native form or a standard form.
    If you want to translate "Tiếng Việt" to "Vietnamese" based on interface language, you can do:
  */
  const TRANSLATED_LANGUAGES = [
    { code: "vi", label: t("languageLabels.vi"), flag: "🇻🇳" },
    { code: "en", label: t("languageLabels.en"), flag: "🇬🇧" },
    { code: "cn", label: t("languageLabels.zh"), flag: "🇨🇳" },
    { code: "bo", label: t("languageLabels.bo"), flag: "🏳️" },
  ];

  const [postCode, setPostCode] = useState<string | null>(null);

  useEffect(() => {
    // Get code from localStorage only once on mount
    const code = localStorage.getItem("editPostCode");
    if (!code) {
      setCurrentPage("content-posts");
    } else {
      setPostCode(code);
    }
  }, [setCurrentPage]);

  // Use React Query hook
  const {
    data: post,
    isLoading: isQueryLoading,
    error: queryError,
  } = usePost(postCode);

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

  const [originalPost, setOriginalPost] = useState<Post | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  // Sync data from React Query to local state
  useEffect(() => {
    if (post) {
      setOriginalPost(post);

      // Map details array to object
      const detailsMap: any = {
        vi: { title: "", description: "", content: "" },
        en: { title: "", description: "", content: "" },
        cn: { title: "", description: "", content: "" },
        bo: { title: "", description: "", content: "" },
      };

      post.details?.forEach((detail) => {
        if (detailsMap[detail.lang]) {
          detailsMap[detail.lang] = {
            title: detail.title,
            description: detail.description,
            content: detail.content,
          };
        }
      });

      // Fallback for legacy data
      if ((!post.details || post.details.length === 0) && (post as any).title) {
        detailsMap.vi.title = (post as any).title;
        detailsMap.vi.description = (post as any).description;
        detailsMap.vi.content = (post as any).content;
      }

      setPostData({
        category: post.category || "",
        isFeatured: !!post.isFeatured,
        isNew: !!post.isNew,
        visibility: post.visibility || "PUBLIC",
        cover: post.cover,
        details: detailsMap,
      });
    }
  }, [post]);

  // Handle errors or missing post
  useEffect(() => {
    if (queryError) {
      toast.error(t("failedToLoadPost"));
      setCurrentPage("content-posts");
    }
  }, [queryError, t, setCurrentPage]);

  // Combined Loading State
  const isLoading = isQueryLoading && !post; // Only show loading if no data yet

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

    if (!originalPost) {
      setSaveError(t("originalPostNotFound"));
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const payload: any = {
        category: postData.category,
        isFeatured: postData.isFeatured,
        isNew: postData.isNew,
        visibility: postData.visibility,
        cover: postData.cover,
        details: Object.entries(postData.details).map(([lang, detail]) => ({
          lang,
          title:
            detail.title || (lang === "vi" ? "" : postData.details.vi.title),
          description: detail.description,
          content: detail.content,
        })),
      };

      const response = await updatePost(originalPost.code, payload);

      const successMsg = response?.message || "UPDATE_POST_SUCCESS";
      toast.success(t(`messages.${successMsg}`));

      setCurrentPage("content-posts");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      const translated = t(`errors.${errorMsg}`);
      if (translated === `errors.${errorMsg}`) {
        toast.error(errorMsg || t("failedToUpdatePost"));
      } else {
        toast.error(translated);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!originalPost) return;
    try {
      const response = await deletePost(originalPost.code);
      const successMsg = response?.message || "DELETE_POST_SUCCESS";
      toast.success(t(`messages.${successMsg}`));

      setShowDeleteModal(false);
      setCurrentPage("content-posts");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      const translated = t(`errors.${errorMsg}`);
      if (translated === `errors.${errorMsg}`) {
        toast.error(errorMsg || t("failedToDeletePost"));
      } else {
        toast.error(translated);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loadingPost")}</p>
        </div>
      </div>
    );
  }

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
              {TRANSLATED_LANGUAGES.map((lang) => (
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
                {t("editPost")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("postCode")}:{" "}
                <span className="font-mono text-gray-700">
                  {originalPost?.code}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-delete-post-header"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              {t("delete")}
            </button>
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
              {isSaving ? t("updating") : t("update")}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 border-r border-gray-200 bg-white min-h-[calc(100vh-80px)]">
            {/* Language Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {TRANSLATED_LANGUAGES.map((lang) => (
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
                  {
                    TRANSLATED_LANGUAGES.find((l) => l.code === activeLang)
                      ?.label
                  }
                  ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentDetail.title}
                  onChange={(e) => handleDetailChange("title", e.target.value)}
                  placeholder={t("titlePlaceholder", {
                    language:
                      TRANSLATED_LANGUAGES.find((l) => l.code === activeLang)
                        ?.label ?? "",
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
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("deletePost")}
            </h3>
            <p className="text-gray-600 mb-6">{t("deletePostConfirmation")}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
