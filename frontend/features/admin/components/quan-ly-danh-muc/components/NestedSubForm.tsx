"use client";

import {
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { CreateCategoryRequest } from "../types/category.types";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { isValidName } from "@/shared/utils/validation";

interface Props {
  nestingPath: string;
  control: Control<CreateCategoryRequest>;
  register: UseFormRegister<CreateCategoryRequest>;
  watch: UseFormWatch<CreateCategoryRequest>;
  setValue: UseFormSetValue<CreateCategoryRequest>;
  depth: number;
  onRemove: () => void;
  parentCode?: string | null;
  activeLang: string;
}

const LANGUAGES = ["vi", "en", "cn", "bo"];

export default function NestedSubForm({
  nestingPath,
  control,
  register,
  watch,
  setValue,
  depth,
  onRemove,
  parentCode,
  activeLang,
}: Props) {
  const t = useTranslations("Category");
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${nestingPath}.children` as any,
  });

  const getNestedError = (langIdx: number) => {
    const parts = nestingPath.split("."); // children.0.children.1 ...
    let currentError: any = (control as any)._formState.errors;

    for (const part of parts) {
      if (!currentError) return null;
      currentError = currentError[part];
    }

    return currentError?.details?.[langIdx]?.name;
  };

  const myCode = watch(`${nestingPath}.code` as any);

  // Cascade isActive logic: Khi ẩn parent → tự động ẩn children
  useEffect(() => {
    const subscription = watch((_, { name: fieldName }) => {
      // Check if this category's isActive changed
      if (fieldName === `${nestingPath}.isActive`) {
        const myIsActive = watch(`${nestingPath}.isActive` as any);

        // Nếu category này bị ẩn, ẩn tất cả children
        if (!myIsActive && fields.length > 0) {
          fields.forEach((__, index) => {
            setValue(`${nestingPath}.children.${index}.isActive` as any, false);
          });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [nestingPath, fields, setValue, watch]);

  return (
    <div
      className={`mt-4 md:mt-4 border-l-2 pl-2 py-3 md:py-3 transition-all ${
        depth === 1 ? "border-orange-400" : "border-purple-400"
      }`}
    >
      <div>
        {/* Input Row */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input type="hidden" {...register(`${nestingPath}.code` as any)} />
            {LANGUAGES.map((lang, idx) => (
              <div
                key={lang}
                className={activeLang === lang ? "block" : "hidden"}
              >
                <input
                  type="hidden"
                  {...register(`${nestingPath}.details.${idx}.lang` as any)}
                  defaultValue={lang}
                />
                <input
                  {...register(`${nestingPath}.details.${idx}.name` as any, {
                    required: lang === "vi",
                    validate: (val) =>
                      isValidName(val, lang) || t("validation.invalidName"),
                  })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl text-sm md:text-base text-black outline-none focus:border-blue-600 transition-all bg-white"
                  placeholder={`${t("fields.name")} ${lang.toUpperCase()}...`}
                />

                {/* Specific Error for this detail/lang */}
                {getNestedError(idx) && (
                  <p className="text-red-500 text-[10px] items-center mt-1">
                    {getNestedError(idx).type === "required"
                      ? t("required")
                      : getNestedError(idx).message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Hide Toggle - Checkbox only */}
          <input
            type="checkbox"
            checked={watch(`${nestingPath}.isActive` as any)}
            onChange={(e) => {
              // Tích = Visible (true), Không tích = Hidden (false)
              setValue(`${nestingPath}.isActive` as any, e.target.checked);
            }}
            className="w-5 h-5 accent-emerald-500 cursor-pointer"
            title={t("fields.active")}
          />

          <button
            type="button"
            onClick={onRemove}
            className="p-2 md:p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title={t("delete")}
          >
            <Trash2 size={20} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Action for Level 3 */}
        {depth < 2 && (
          <div className="pl-2 md:pl-2 mt-4 space-y-2 md:space-y-2">
            {fields.map((field, index) => (
              <NestedSubForm
                key={field.id}
                nestingPath={`${nestingPath}.children.${index}`}
                control={control}
                register={register}
                watch={watch}
                setValue={setValue}
                depth={depth + 1}
                onRemove={() => remove(index)}
                parentCode={myCode}
                activeLang={activeLang}
              />
            ))}

            <div className="flex flex-col items-end gap-1 pt-2 pr-4">
              <button
                type="button"
                disabled={fields.length >= 8}
                onClick={() =>
                  append({
                    code: "",
                    details: LANGUAGES.map((l) => ({
                      lang: l,
                      name: "",
                      slug: "",
                    })),
                    isActive: true,
                    children: [],
                  })
                }
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-purple-500 text-purple-500 font-black text-xs md:text-sm uppercase rounded-xl hover:bg-blue-50 transition-all shadow-sm ${
                  fields.length >= 8
                    ? "opacity-30 cursor-not-allowed grayscale"
                    : ""
                }`}
              >
                <Plus size={16} className="md:w-5 md:h-5" /> {t("addLevel3")}{" "}
                {fields.length > 0 && `(${fields.length}/8)`}
              </button>
              {fields.length >= 8 && (
                <span className="text-[10px] text-red-500 font-bold uppercase">
                  {t("max8Limit")}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
