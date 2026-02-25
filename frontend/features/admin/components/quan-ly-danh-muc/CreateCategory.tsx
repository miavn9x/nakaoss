"use client";

import { useCategoryMutations } from "./hooks/useCategories";
import { CreateCategoryRequest } from "./types/category.types";
import CategoryForm from "./components/CategoryForm";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

export default function CreateCategory() {
  const { createCategory } = useCategoryMutations();
  const { setCurrentPage } = useAdminPage();
  const t = useTranslations("Category");

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
    try {
      console.log("📦 RAW DATA:", JSON.stringify(data, null, 2));

      // Validation
      const validationError = validateCategory(data, t("validation.level1"));
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const payload = { ...data, parentCode: null };
      console.log("✅ PAYLOAD GỬI LÊN:", JSON.stringify(payload, null, 2));

      await createCategory.mutateAsync(payload);
      toast.success(t("messages.createSuccess"));
      setCurrentPage("category-list");
    } catch (error: any) {
      console.error("❌ LỖI TẠO DANH MỤC:", error);
      const errorMsg = error.response?.data?.message || error.message;

      // Try to localize known error codes
      const translated = t(`errors.${errorMsg}`);

      // If translation key is returned (meaning missing), use generic or original
      if (translated === `errors.${errorMsg}`) {
        toast.error(errorMsg || t("messages.createFailedGeneric"));
      } else {
        toast.error(translated);
      }
    }
  };

  return (
    <CategoryForm
      onSubmit={handleSubmit}
      isSubmitting={createCategory.isPending}
    />
  );
}
