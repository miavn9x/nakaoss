"use client";

import { useEffect, useState } from "react";
import { useCategory, useCategoryMutations } from "./hooks/useCategories";
import { CreateCategoryRequest } from "./types/category.types";
import CategoryForm from "./components/CategoryForm";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function EditCategory() {
  const [code, setCode] = useState<string | null>(null);
  const { data: category, isLoading } = useCategory(code);
  const { updateCategory } = useCategoryMutations();
  const { setCurrentPage } = useAdminPage();
  const t = useTranslations("Category");

  useEffect(() => {
    const c = localStorage.getItem("editCategoryCode");
    if (c) setCode(c);
  }, []);

  // Validation logic (localized)
  const validateCategory = (
    cat: CreateCategoryRequest,
    level: string,
  ): string | null => {
    const missingLangs = cat.details.filter(
      (d) => !d.name || d.name.trim() === "",
    );
    if (missingLangs.length > 0) {
      const langs = missingLangs.map((d) => d.lang.toUpperCase()).join(", ");
      return t("validation.missingLangs", { level, langs });
    }

    if (cat.children && cat.children.length > 0) {
      for (let i = 0; i < cat.children.length; i++) {
        const childLevel =
          level === t("validation.level1")
            ? t("validation.level2", { index: i + 1 })
            : t("validation.level3", { index: i + 1 });
        const error = validateCategory(cat.children[i], childLevel);
        if (error) return error;
      }
    }
    return null;
  };

  const handleSubmit = async (data: CreateCategoryRequest) => {
    if (!code) return;
    try {
      // Run Validation
      const validationError = validateCategory(data, t("validation.level1"));
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const payload = { ...data, parentCode: data.parentCode || null };
      await updateCategory.mutateAsync({ code, data: payload });
      toast.success(t("messages.updateSuccess"));
      setCurrentPage("category-list");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      const translated = t(`errors.${errorMsg}`);
      if (translated === `errors.${errorMsg}`) {
        toast.error(errorMsg || t("messages.updateFailedGeneric"));
      } else {
        toast.error(translated);
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-20 font-bold text-gray-400 uppercase tracking-widest animate-pulse">
        {t("messages.loading")}
      </div>
    );

  if (!category)
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="text-xl font-black text-red-600 uppercase">
          {t("messages.notFound")}
        </div>
        <button
          onClick={() => setCurrentPage("category-list")}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-all"
        >
          {t("back")}
        </button>
      </div>
    );

  return (
    <CategoryForm
      initialData={category}
      onSubmit={handleSubmit}
      isSubmitting={updateCategory.isPending}
      isEdit
    />
  );
}
