"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Edit,
  Trash2,
  Calendar,
  RefreshCw,
  ImageIcon,
  Filter,
  Globe,
  Lock,
  Star,
  Zap,
  MoreVertical,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { getImageUrl } from "@/shared/lib/image";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import { usePosts } from "@/features/admin/components/quan-ly-noi-dung/hooks/usePosts";
import { useAllCategories } from "@/features/admin/components/quan-ly-danh-muc/hooks/useCategories";
import { useTranslations, useFormatter, useLocale } from "next-intl";

import ConfirmModal from "@/features/admin/components/shared/ConfirmModal";

export default function PostsList() {
  const t = useTranslations("Content");
  const format = useFormatter();
  const locale = useLocale();

  // Build categories from dynamic data
  const { data: allCategoriesRaw } = useAllCategories();
  const allCategories = allCategoriesRaw || [];

  const CATEGORY_OPTIONS = useMemo(() => {
    const options = [{ value: "ALL", label: t("categories.all") }];
    allCategories.forEach((cat) => {
      const name =
        cat.details?.find((d) => d.lang === locale)?.name ||
        cat.details?.find((d) => d.lang === "vi")?.name ||
        cat.code;
      options.push({ value: cat.code, label: name });
    });
    return options;
  }, [allCategories, locale, t]);

  const VISIBILITY_OPTIONS = [
    { value: "ALL", label: t("visibility.all") },
    { value: "PUBLIC", label: t("visibility.public") },
    { value: "MEMBERS_ONLY", label: t("visibility.membersOnly") },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterVisibility, setFilterVisibility] = useState("ALL");

  const { setCurrentPage } = useAdminPage();
  const {
    posts,
    pagination,
    setPage,
    isLoading,
    isFetching,
    deletePost,
    refreshPosts,
  } = usePosts();
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>(
    {},
  );

  const filteredPosts = useMemo(() => {
    let result = posts;

    // 1. Search (Client-side)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((post) => {
        // Search in all details
        const matchesDetail = post.details?.some(
          (d) =>
            d.title?.toLowerCase().includes(lowerTerm) ||
            d.description?.toLowerCase().includes(lowerTerm),
        );
        const matchesLegacy = (post as any).title
          ?.toLowerCase()
          .includes(lowerTerm);
        return matchesDetail || matchesLegacy;
      });
    }

    // 2. Filter Category
    if (filterCategory !== "ALL") {
      result = result.filter((p) => p.category === filterCategory);
    }

    // 3. Filter Visibility
    if (filterVisibility !== "ALL") {
      result = result.filter((p) => p.visibility === filterVisibility);
    }

    return result;
  }, [posts, searchTerm, filterCategory, filterVisibility]);

  const handleEditPost = (postCode: string) => {
    localStorage.setItem("editPostCode", postCode);
    setCurrentPage("content-edit-post");
  };

  const handleRefresh = async () => {
    try {
      await refreshPosts();
    } catch {
      // ignore
    }
  };

  const handleImageError = (postCode: string) => {
    setImageSources((prev) => ({
      ...prev,
      [postCode]: "/img/user.png",
    }));
  };

  const getPostTitle = (post: any) => {
    if (post.details && post.details.length > 0) {
      // 1. Try to find content in current locale
      const current = post.details.find((d: any) => d.lang === locale);
      if (current && current.title) return current.title;

      // 2. Fallback to Vietnamese if current not found
      const vi = post.details.find((d: any) => d.lang === "vi");
      if (vi && vi.title) return vi.title;

      // 3. Fallback to first available
      return post.details[0].title;
    }
    // 4. Fallback to legacy field
    return (post as any).title || t("noTitle");
  };

  const getPostDescription = (post: any) => {
    if (post.details && post.details.length > 0) {
      const current = post.details.find((d: any) => d.lang === locale);
      if (current && current.description) return current.description;
      const vi = post.details.find((d: any) => d.lang === "vi");
      if (vi && vi.description) return vi.description;
      return post.details[0]?.description || "";
    }
    return "";
  };

  const getCategoryBreadcrumbs = (code: string) => {
    if (!code) return [];

    const normalizedLang = locale === "zh" ? "cn" : locale;
    const findCat = (c: string) => allCategories.find((cat) => cat.code === c);

    const breadcrumbs: { name: string; level: number }[] = [];
    let currentCode: string | null = code;

    // Trace back through parents to build breadcrumbs
    while (currentCode) {
      const cat = findCat(currentCode);
      if (!cat) break;

      const name =
        cat.details?.find((d) => d.lang === normalizedLang)?.name ||
        cat.details?.find((d) => d.lang === "vi")?.name ||
        cat.details?.find((d) => d.lang === "en")?.name ||
        cat.code;

      breadcrumbs.unshift({ name, level: 0 }); // Placeholder
      currentCode = cat.parentCode;
    }

    return breadcrumbs.map((b, idx) => ({ ...b, level: idx + 1 }));
  };

  const renderCategoryBreadcrumbs = (code: string) => {
    const breadcrumbs = getCategoryBreadcrumbs(code);
    if (breadcrumbs.length === 0) return code || "-";

    return (
      <div className="flex flex-wrap items-center justify-center gap-1">
        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={idx}>
            <span
              className={`text-[10px] font-bold transition-colors ${
                b.level === 1
                  ? "text-blue-600"
                  : b.level === 2
                    ? "text-orange-600"
                    : "text-purple-600"
              }`}
            >
              {b.name}
            </span>
            {idx < breadcrumbs.length - 1 && (
              <span className="text-gray-300 mx-0.5">&gt;</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // State for delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const confirmDelete = (postCode: string) => {
    setPostToDelete(postCode);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await deletePost(postToDelete);
      const successMsg = response?.message || "DELETE_POST_SUCCESS";
      toast.success(t(`messages.${successMsg}`));
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error: any) {
      const errorMsg = error.message;
      const translated = t(`errors.${errorMsg}`);
      if (translated === `errors.${errorMsg}`) {
        toast.error(t("deleteFailed"));
      } else {
        toast.error(translated);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 m-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">{t("loadingData")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
        {/* Header Toolbar */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {t("pageTitle")}
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {filteredPosts.length}
                </span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {t("pageDescription")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
                {t("refresh")}
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-center pt-2">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm transition-all"
              />
            </div>

            <select
              title={t("filterByCategory")}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              title={t("filterByVisibility")}
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="w-full md:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="ALL" className="text-gray-700">
                {t("allPermissions")}
              </option>
              <option value="PUBLIC" className="text-gray-700">
                {t("visibility.public")}
              </option>
              <option value="MEMBERS_ONLY" className="text-gray-700">
                {t("visibility.membersOnly")}
              </option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`flex-1 overflow-auto bg-gray-50/50 transition-opacity duration-200 ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Filter className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t("noPostsFound")}
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchTerm
                  ? t("noResultsFor", { query: searchTerm })
                  : t("noPostsYet")}
              </p>
            </div>
          ) : (
            <>
              {/* PC View: Table */}
              <div className="hidden lg:block w-full overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50 sticky top-0 z-10 text-xs font-bold uppercase text-gray-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Ảnh</th>
                      <th className="px-6 py-4">Thông tin bài viết</th>
                      <th className="px-6 py-4 text-center">
                        {t("tableHeaders.category")}
                      </th>
                      <th className="px-6 py-4 text-center">
                        {t("tableHeaders.status")}
                      </th>
                      <th className="px-6 py-4 text-center">
                        {t("tableHeaders.createdDate")}
                      </th>
                      <th className="px-6 py-4 text-right">
                        {t("tableHeaders.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredPosts.map((post) => (
                      <tr
                        key={post.code}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4 align-middle">
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                            {post.cover?.url ? (
                              <Image
                                src={
                                  imageSources[post.code]
                                    ? imageSources[post.code]
                                    : getImageUrl(post.cover?.url)
                                }
                                alt={getPostTitle(post)}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={() => handleImageError(post.code)}
                                unoptimized={true} // Hỗ trợ ảnh động
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Tối ưu size
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <h3
                            className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 cursor-pointer line-clamp-2 leading-relaxed"
                            onClick={() => handleEditPost(post.code)}
                          >
                            {getPostTitle(post)}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2 max-w-xl">
                            {getPostDescription(post)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">
                              #{post.code}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />{" "}
                              {post.details?.map((d) => d.lang).join(", ") ||
                                "vi"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-center">
                          {renderCategoryBreadcrumbs(post.category)}
                        </td>
                        <td className="px-6 py-4 align-middle text-center">
                          <div className="flex flex-col gap-2 items-center">
                            {post.visibility === "MEMBERS_ONLY" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100 w-fit">
                                <Lock className="w-3 h-3" />{" "}
                                {t("membersOnlyLabel")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 w-fit">
                                <Globe className="w-3 h-3" />{" "}
                                {t("visibility.public")}
                              </span>
                            )}

                            <div className="flex gap-1">
                              {post.isNew && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold border border-red-200 shadow-sm">
                                  {t("badges.new")}
                                </span>
                              )}
                              {post.isFeatured && (
                                <span className="text-[10px] bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded font-bold border border-yellow-200 shadow-sm">
                                  {t("badges.hot")}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-center text-xs text-gray-500">
                          <div className="flex items-center justify-center gap-1.5 bg-gray-50 py-1 px-2 rounded-lg border border-gray-100 w-fit mx-auto">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {post.createdAt
                              ? format.dateTime(new Date(post.createdAt), {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })
                              : t("notAvailable")}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              title={t("editPost")}
                              onClick={() => handleEditPost(post.code)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              title={t("deletePost")}
                              onClick={() => confirmDelete(post.code)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Cards */}
              <div className="lg:hidden grid grid-cols-1 gap-4 p-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.code}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-4 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                      {post.cover?.url ? (
                        <Image
                          src={
                            imageSources[post.code] ||
                            getImageUrl(post.cover.url)
                          }
                          alt=""
                          fill
                          className="object-cover"
                          onError={() => handleImageError(post.code)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex gap-1.5 mb-1">
                          {post.isNew && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">
                              {t("badges.new")}
                            </span>
                          )}
                          {post.isFeatured && (
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-600 text-[10px] font-bold rounded">
                              {t("badges.hot")}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3
                        className="text-base font-bold text-gray-900 leading-tight mb-1 line-clamp-2"
                        onClick={() => handleEditPost(post.code)}
                      >
                        {getPostTitle(post)}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {getPostDescription(post)}
                      </p>
                      <div className="mb-2">
                        {renderCategoryBreadcrumbs(post.category)}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {format.dateTime(new Date(post.createdAt), {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEditPost(post.code)}
                            className="text-blue-600 text-xs font-semibold"
                          >
                            {t("edit")}
                          </button>
                          <button
                            onClick={() => confirmDelete(post.code)}
                            className="text-red-600 text-xs font-semibold"
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.total > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between sticky bottom-0 z-10 shadow-up">
              <div className="text-sm text-gray-500">
                {t("showing")}{" "}
                <span className="font-medium text-gray-900">
                  {((pagination?.page || 1) - 1) * (pagination?.limit || 10) +
                    1}
                </span>{" "}
                {t("to")}{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(
                    (pagination?.page || 1) * (pagination?.limit || 10),
                    pagination?.total || 0,
                  )}
                </span>{" "}
                {t("outOf")}{" "}
                <span className="font-medium text-gray-900">
                  {pagination?.total || 0}
                </span>{" "}
                {t("totalPosts")}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((pagination?.page || 1) - 1)}
                  disabled={(pagination?.page || 1) <= 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t("previousPage")}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                  {t("pageOfTotal", {
                    page: pagination?.page || 1,
                    total: Math.ceil(
                      (pagination?.total || 0) / (pagination?.limit || 10),
                    ),
                  })}
                </div>
                <button
                  onClick={() => setPage((pagination?.page || 1) + 1)}
                  disabled={
                    (pagination?.page || 1) >=
                    Math.ceil(
                      (pagination?.total || 0) / (pagination?.limit || 10),
                    )
                  }
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={t("nextPage")}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title={t("deletePost")}
        message={t("deletePostConfirmation")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        type="danger"
      />
    </div>
  );
}
