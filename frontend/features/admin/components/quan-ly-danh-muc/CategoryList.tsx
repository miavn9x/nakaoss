"use client";

import { useCategoriesTree, useCategoryMutations } from "./hooks/useCategories";
import { Category } from "./types/category.types";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  RefreshCw,
  FolderTree,
  ChevronLeft,
} from "lucide-react";
import { useState, Fragment } from "react";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import ConfirmModal from "../shared/ConfirmModal";

const LANGUAGES = ["vi", "en", "cn", "bo"];

export default function CategoryList() {
  const t = useTranslations("Category");
  const {
    data: responseData,
    isLoading,
    refetch,
    isRefetching,
    page,
    setPage,
    limit,
  } = useCategoriesTree();

  const treeData = responseData?.items || [];
  const pagination = responseData?.pagination;
  const { deleteCategory } = useCategoryMutations();
  const { setCurrentPage } = useAdminPage();

  // State for expanded rows
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (code: string) => {
    setExpanded((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const handleEdit = (code: string) => {
    localStorage.setItem("editCategoryCode", code);
    setCurrentPage("category-edit");
  };

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    code: string | null;
  }>({ open: false, code: null });

  const handleDelete = (code: string) => {
    setConfirmModal({ open: true, code });
  };

  const onConfirmDelete = async () => {
    if (!confirmModal.code) return;

    try {
      await deleteCategory.mutateAsync(confirmModal.code);
      toast.success(t("messages.deleteSuccess"));
    } catch (error: any) {
      // Check for backend error message
      const errorMsg = error.response?.data?.message || error.message;

      if (errorMsg === "CATEGORY_HAS_POSTS") {
        toast.error(t("messages.errorHasPosts"));
      } else {
        const translated = t(`errors.${errorMsg}`);
        if (translated === `errors.${errorMsg}`) {
          toast.error(errorMsg || t("messages.deleteFailed"));
        } else {
          toast.error(translated);
        }
      }
    } finally {
      setConfirmModal({ open: false, code: null });
    }
  };

  // Lang helper
  const getLangName = (cat: Category, lang: string) => {
    return cat.details.find((d) => d.lang === lang)?.name || cat.code;
  };

  // Recursive Row Renderer
  const renderRows = (categories: Category[] | undefined, depth = 0) => {
    if (!categories || !Array.isArray(categories)) return null;

    return categories.map((cat) => {
      const isExpanded = expanded[cat.code] === true;
      const hasChildren = cat.children && cat.children.length > 0;

      // Determine Level Label
      let levelLabel = t("level1"); // Default to Cấp 1
      let levelClass = "bg-blue-50 text-blue-600";
      if (depth === 1) {
        levelLabel = t("level2");
        levelClass = "bg-indigo-50 text-indigo-600";
      } else if (depth >= 2) {
        levelLabel = t("level3");
        levelClass = "bg-purple-50 text-purple-600";
      }

      return (
        <Fragment key={cat.code}>
          <tr
            className={`hover:bg-gray-50/80 transition-colors border-b border-gray-100 ${depth === 0 ? "bg-white" : "bg-gray-50/30"}`}
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                {/* Indentation Spacers */}
                {depth > 0 &&
                  Array.from({ length: depth }).map((_, i) => (
                    <span
                      key={i}
                      className="w-8 h-8 shrink-0 flex items-center justify-center"
                    >
                      <div className="w-px h-full bg-gray-200" />
                    </span>
                  ))}

                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpand(cat.code)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                  ) : (
                    <div className="w-6 shrink-0" />
                  )}

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${levelClass}`}
                      >
                        {levelLabel}
                      </span>
                      <span className="font-medium text-gray-700 truncate">
                        {getLangName(cat, "vi")}
                      </span>
                    </div>

                    {/* Other Languages Row */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
                      {LANGUAGES.filter((l: string) => l !== "vi").map(
                        (lang: string) => (
                          <div key={lang} className="flex items-center gap-1">
                            <span className="uppercase font-semibold opacity-60">
                              {lang}:
                            </span>
                            <span className="truncate max-w-[120px] italic">
                              {cat.details.find((d) => d.lang === lang)?.name ||
                                "---"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono text-gray-400 mb-1">
                  {cat.code}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  #{cat.order}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 text-center">
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  cat.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {cat.isActive ? <Check size={12} /> : <X size={12} />}
                {cat.isActive ? t("active") : t("inactive")}
              </div>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => handleEdit(cat.code)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title={t("edit")}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cat.code)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title={t("delete")}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
          {/* Recursion */}
          {hasChildren && isExpanded && renderRows(cat.children, depth + 1)}
        </Fragment>
      );
    });
  };

  if (isLoading)
    return <div className="p-8 text-center">{t("messages.loading")}</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <FolderTree className="w-6 h-6 text-blue-600" />
                {t("title")}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{t("description")}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className={`flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all ${isRefetching ? "opacity-70 cursor-wait" : ""}`}
              >
                <RefreshCw
                  size={16}
                  className={isRefetching ? "animate-spin" : ""}
                />
                {isRefetching ? t("messages.loading") : t("refresh")}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 sticky top-0 z-10 text-xs font-bold uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-4 py-4">{t("columns.name")}</th>
                <th className="px-4 py-4 text-center">{t("columns.order")}</th>
                <th className="px-4 py-4 text-center">{t("columns.status")}</th>
                <th className="px-6 py-4 text-right">{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {renderRows(treeData)}
              {(!treeData || treeData.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between sticky bottom-0 z-10 shadow-up">
            <div className="text-sm text-gray-500">
              {t("showing")}{" "}
              <span className="font-medium text-gray-900">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              {t("to")}{" "}
              <span className="font-medium text-gray-900">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              {t("outOf")}{" "}
              <span className="font-medium text-gray-900">
                {pagination.total}
              </span>{" "}
              {t("totalCategories") || "danh mục"}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title={t("previousPage")}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                {t("pageOfTotal", {
                  page: pagination.page,
                  total: Math.ceil(pagination.total / pagination.limit),
                })}
              </div>
              <button
                onClick={() => setPage(pagination.page + 1)}
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.limit)
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
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, code: null })}
        onConfirm={onConfirmDelete}
        title={t("messages.confirmDelete")}
        message={t("messages.confirmDeleteDesc") || t("messages.confirmDelete")}
        type="danger"
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />
    </div>
  );
}
