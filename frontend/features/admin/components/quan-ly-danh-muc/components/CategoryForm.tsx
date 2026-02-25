"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { CreateCategoryRequest, Category } from "../types/category.types";
import { useCategoriesTree } from "../hooks/useCategories";
import { Save, ArrowLeft, Plus } from "lucide-react";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import NestedSubForm from "./NestedSubForm";
import { useTranslations } from "next-intl";
import { isValidName } from "@/shared/utils/validation";

interface Props {
  initialData?: Category;
  onSubmit: (data: CreateCategoryRequest) => Promise<void>;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const LANGUAGES = ["vi", "en", "cn", "bo"];

export default function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting,
  isEdit,
}: Props) {
  const { setCurrentPage } = useAdminPage();
  const t = useTranslations("Category");
  const { data: treeData } = useCategoriesTree();
  const [activeLang, setActiveLang] = useState("vi");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryRequest>({
    defaultValues: {
      code: initialData?.code || "",
      parentCode: initialData?.parentCode || null,
      order: initialData?.order || 0,
      isActive: initialData?.isActive ?? true,
      details: LANGUAGES.map((lang) => ({
        lang,
        name: initialData?.details?.find((d) => d.lang === lang)?.name || "",
        slug: initialData?.details?.find((d) => d.lang === lang)?.slug || "",
      })),
      children: initialData?.children || [],
    },
  });

  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: "children",
  });

  const myCode = watch("code");

  // Cascade Level 1 isActive → Level 2, 3
  useEffect(() => {
    const subscription = watch((_, { name: fieldName }) => {
      if (fieldName === "isActive") {
        const level1IsActive = watch("isActive");

        // Nếu Level 1 bị ẩn, ẩn toàn bộ Level 2 và 3
        if (!level1IsActive && childFields.length > 0) {
          childFields.forEach((_, index) => {
            setValue(`children.${index}.isActive` as any, false);

            // Cascade xuống Level 3 nếu có
            const level2Children =
              watch(`children.${index}.children` as any) || [];
            level2Children.forEach((__: any, childIndex: number) => {
              setValue(
                `children.${index}.children.${childIndex}.isActive` as any,
                false,
              );
            });
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, childFields]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-2 max-w-7xl mx-auto space-y-4 text-gray-700"
    >
      {/* HEADER SECTION - RESPONSIVE */}
      <div className="sticky top-0  bg-white/98 backdrop-blur shadow-sm border-2 border-gray-200 rounded-2xl px-4 py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setCurrentPage("category-list")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 shrink-0"
            title={t("back")}
            aria-label={t("back")}
          >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-gray-700 tracking-tight truncate">
            {isEdit ? t("editTitle") : t("createTitle")}
          </h1>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          {/* Global Language Bar */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLang(lang)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  activeLang === lang
                    ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                    : "text-gray-500"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 sm:px-10 py-2 sm:py-3 bg-blue-600 text-white font-black uppercase text-[11px] sm:text-sm tracking-widest rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
          >
            <Save size={16} />
            <span className="hidden xs:inline">
              {isSubmitting ? t("saving") : t("save")}
            </span>
            <span className="xs:hidden">
              {isSubmitting ? "..." : t("save")}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 py-6 px-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 border-b-2 border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg">
            1
          </div>
          <h2 className="text-lg font-bold uppercase text-gray-700">
            {t("mainCategory")}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="text-sm md:text-base font-bold text-gray-500 uppercase mt-2">
            {t("fields.name")} (
            {t(`languageLabels.${activeLang as "vi" | "en" | "cn" | "bo"}`)}):
          </div>

          <div className="flex items-center gap-3">
            {/* Input Field */}
            <div className="flex-1">
              <input type="hidden" {...register("code")} />
              {LANGUAGES.map((lang, idx) => (
                <div
                  key={lang}
                  className={activeLang === lang ? "block" : "hidden"}
                >
                  <input
                    type="hidden"
                    {...register(`details.${idx}.lang`)}
                    defaultValue={lang}
                  />
                  <input
                    {...register(`details.${idx}.name`, {
                      required: lang === "vi",
                      validate: (val) =>
                        isValidName(val, lang) || t("validation.invalidName"),
                    })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl text-sm md:text-base text-black outline-none focus:border-blue-600 transition-all bg-white"
                    placeholder={t("clickToAddHint")}
                    autoFocus={activeLang === lang}
                  />
                  {errors.details?.[idx]?.name && (
                    <p className="text-red-600 text-[10px] font-bold uppercase mt-1">
                      {errors.details[idx].name.type === "required"
                        ? t("required")
                        : (errors.details[idx].name.message as string)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 p-3  bg-gray-50">
              <span className="text-sm text-gray-700">
                {t("fields.active")}
              </span>
              <input
                type="checkbox"
                checked={watch("isActive")}
                onChange={(e) => {
                  setValue("isActive", e.target.checked);
                }}
                className="w-5 h-5 accent-blue-600 cursor-pointer"
                title={t("fields.active")}
              />
            </div>
            <input type="hidden" {...register("parentCode")} />
          </div>
        </div>
      </div>

      {/* DEBUG MARKER */}
      <div className="space-y-4 border-2 border-dashed border-red-500 p-2">
        <p className="text-red-500 font-bold text-center">
          --- KHU VỰC DANH MỤC CẤP 2 & 3 ---
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50/50 px-4 py-6  rounded-2xl border border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg shrink-0">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase text-gray-700">
                {t("subCategory")}
              </h3>
              <p className="text-[11px] md:text-sm text-gray-400 font-bold">
                {t("addSubHint")}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-col items-end gap-1">
            <button
              type="button"
              disabled={childFields.length >= 8}
              onClick={() =>
                appendChild({
                  code: "",
                  details: LANGUAGES.map((l) => ({
                    lang: l,
                    name: "",
                    slug: "",
                  })),
                  children: [],
                  isActive: true,
                })
              }
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-orange-500 text-orange-500 font-black text-xs md:text-sm uppercase rounded-xl hover:bg-blue-50 transition-all ${
                childFields.length >= 8
                  ? "opacity-50 cursor-not-allowed grayscale"
                  : ""
              }`}
            >
              <Plus size={18} /> {t("addLevel2")}{" "}
              {childFields.length > 0 && `(${childFields.length}/8)`}
            </button>
            {childFields.length >= 8 && (
              <span className="text-[10px] text-red-500 font-bold uppercase">
                {t("max8Reached")}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-10">
          {childFields.map((field, index) => (
            <NestedSubForm
              key={field.id}
              nestingPath={`children.${index}`}
              control={control}
              register={register}
              watch={watch}
              setValue={setValue}
              depth={1}
              onRemove={() => removeChild(index)}
              parentCode={myCode}
              activeLang={activeLang}
            />
          ))}

          {childFields.length === 0 && (
            <div className="py-24 text-center border-2 border-dashed border-gray-300 rounded-[2.5rem] bg-gray-50 opacity-60">
              <p className="text-lg font-black text-gray-400 uppercase tracking-widest">
                {t("hierarchyEmpty")}
              </p>
              <p className="text-sm text-gray-400 font-bold mt-3">
                {t("clickToAddHint")}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-16 pb-10 border-t-2 border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-bold text-gray-400 italic text-center mb-10">
            {t("saveNote")}
          </p>
          {/* SIMULATION PREVIEW */}
          <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest shadow-sm">
              {t("previewNote")}
            </div>

            <HierarchyPreview watch={watch} activeLang={activeLang} />
          </div>
        </div>
      </div>
    </form>
  );
}

function HierarchyPreview({
  watch,
  activeLang,
}: {
  watch: any;
  activeLang: string;
}) {
  const t = useTranslations("Category");
  const formData = watch();
  const langIdx = ["vi", "en", "cn", "bo"].indexOf(activeLang);
  const rootName = formData.details?.[langIdx]?.name || "...";
  const children = formData.children || [];

  return (
    <div>
      {/* Level 1 Simulation (The Header) */}
      <div className="flex items-center gap-4 border-gray-100">
        <div className="bg-red-800 text-white px-6 py-2 uppercase font-black text-sm tracking-widest shadow-lg">
          {rootName}
        </div>
        <div className="hidden md:flex gap-6 mt-1">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            {t("otherItem1")}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-red-800 text-red-800">
            {t("selectedItem")}
          </span>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            {t("otherItem2")}
          </span>
        </div>
      </div>

      {/* Mega Menu Grid for L2 & L3 (4 Columns) */}
      <div className="p-4 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {(() => {
            const displayChildren = [...children];
            while (displayChildren.length < 4) {
              displayChildren.push({
                isPlaceholder: true,
                details: [],
                children: [
                  { details: [], isPlaceholder: true },
                  { details: [], isPlaceholder: true },
                  { details: [], isPlaceholder: true },
                ],
              });
            }

            return displayChildren.map((l2: any, i: number) => {
              const l2Name =
                l2.details?.[langIdx]?.name ||
                (l2.isPlaceholder
                  ? `${t("level2Placeholder")} (#${i + 1})`
                  : `${t("level2Placeholder")} (${i + 1})`);
              const isL2Hidden = l2.isActive === false;

              return (
                <div
                  key={i}
                  className={`space-y-5 flex flex-col ${isL2Hidden || l2.isPlaceholder ? "opacity-30 grayscale" : ""}`}
                >
                  {/* Level 2 Title */}
                  <h4 className="text-sm font-black uppercase text-gray-900 border-b-2 border-gray-100 pb-3 flex items-center justify-between group-hover:text-red-800 transition-colors">
                    {l2Name}
                    <span className="text-[10px] text-gray-400">▼</span>
                  </h4>

                  {/* Level 3 Items */}
                  <ul className="space-y-3">
                    {(l2.children || []).map((l3: any, j: number) => {
                      const l3Name =
                        l3.details?.[langIdx]?.name ||
                        (l3.isPlaceholder
                          ? `${t("level3Placeholder")} (#${j + 1})`
                          : `${t("level3Placeholder")} (#${j + 1})`);
                      const isL3Hidden = l3.isActive === false;
                      return (
                        <li
                          key={j}
                          className={`text-sm text-gray-500 hover:text-red-700 cursor-pointer transition-all flex items-center gap-3 group/item ${isL3Hidden || l3.isPlaceholder ? "opacity-40" : ""}`}
                        >
                          <div className="w-1.5 h-px bg-gray-300 group-hover/item:w-3 group-hover/item:bg-red-700 transition-all"></div>
                          <span className="truncate">{l3Name}</span>
                        </li>
                      );
                    })}
                    {(!l2.children || l2.children.length === 0) && (
                      <li className="text-[10px] italic text-gray-300 uppercase tracking-widest font-medium py-2">
                        ({t("noData")})
                      </li>
                    )}
                  </ul>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
