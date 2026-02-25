"use client";

import { useEffect, useState } from "react";
import { useFullCategoriesTree } from "@/features/admin/components/quan-ly-danh-muc/hooks/useCategories";
import { Category } from "@/features/admin/components/quan-ly-danh-muc/types/category.types";
import { useTranslations } from "next-intl";
import { Globe } from "lucide-react";

interface Props {
  value: string; // The category code
  onChange: (value: string) => void;
  activeLang: string;
}

export default function CategoryCascadedSelect({
  value,
  onChange,
  activeLang,
}: Props) {
  const t = useTranslations("Category");
  const { data: treeItems } = useFullCategoriesTree();
  // Ensure we get the items array or empty array
  const safeTreeItems: Category[] = treeItems || [];

  // Local states for hierarchical selection
  const [l1Code, setL1Code] = useState("");
  const [l2Code, setL2Code] = useState("");
  const [l3Code, setL3Code] = useState("");

  // Unify language codes (Post module uses zh, Category uses cn)
  const normalizedLang = activeLang === "zh" ? "cn" : activeLang;

  const getLangName = (cat: Category, lang: string) => {
    if (!cat.details) return cat.code;
    return (
      cat.details.find((d) => d.lang === lang)?.name ||
      cat.details.find((d) => d.lang === "vi")?.name ||
      cat.details.find((d) => d.lang === "en")?.name ||
      cat.code
    );
  };

  // Sync when safeTreeItems or value changes
  useEffect(() => {
    if (value && safeTreeItems.length > 0) {
      let f1 = "",
        f2 = "",
        f3 = "";

      for (const c1 of safeTreeItems) {
        if (c1.code === value) {
          f1 = value;
          break;
        }
        if (c1.children) {
          for (const c2 of c1.children) {
            if (c2.code === value) {
              f1 = c1.code;
              f2 = value;
              break;
            }
            if (c2.children) {
              for (const c3 of c2.children) {
                if (c3.code === value) {
                  f1 = c1.code;
                  f2 = c2.code;
                  f3 = value;
                  break;
                }
              }
            }
            if (f2) break;
          }
        }
        if (f1) break;
      }

      setL1Code(f1);
      setL2Code(f2);
      setL3Code(f3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, safeTreeItems.length]);

  const handleL1Change = (code: string) => {
    setL1Code(code);
    setL2Code("");
    setL3Code("");
    onChange(code);
  };

  const handleL2Change = (code: string) => {
    setL2Code(code);
    setL3Code("");
    onChange(code || l1Code);
  };

  const handleL3Change = (code: string) => {
    setL3Code(code);
    onChange(code || l2Code);
  };

  const l1List = safeTreeItems;
  const l2List =
    l1List.find((c: Category) => c.code === l1Code)?.children || [];
  const l3List =
    l2List.find((c: Category) => c.code === l2Code)?.children || [];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-400" />
        {t("classification")}
      </h3>

      <div className="space-y-4">
        {/* Level 1 */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest">
            {t("mainCategory")} (L1)
          </label>
          <select
            title="L1"
            value={l1Code}
            onChange={(e) => handleL1Change(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm shadow-sm transition-all"
          >
            <option value="">-- {t("selectMain")} --</option>
            {l1List.map((cat: Category) => (
              <option key={cat.code} value={cat.code}>
                {getLangName(cat, normalizedLang)}
              </option>
            ))}
          </select>
        </div>

        {/* Level 2 */}
        {l1Code && l2List.length > 0 && (
          <div className="pl-4 border-l-2 border-orange-200 space-y-1.5 animate-in slide-in-from-left duration-200">
            <label className="block text-[10px] font-black text-orange-600 uppercase tracking-widest">
              {t("subCategory")} (L2)
            </label>
            <select
              title="L2"
              value={l2Code}
              onChange={(e) => handleL2Change(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm shadow-sm transition-all"
            >
              <option value="">-- {t("selectSub")} --</option>
              {l2List.map((cat: Category) => (
                <option key={cat.code} value={cat.code}>
                  {getLangName(cat, normalizedLang)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Level 3 */}
        {l2Code && l3List.length > 0 && (
          <div className="pl-8 border-l-2 border-purple-200 space-y-1.5 animate-in slide-in-from-left duration-300">
            <label className="block text-[10px] font-black text-purple-600 uppercase tracking-widest">
              {t("level3Category")} (L3)
            </label>
            <select
              title="L3"
              value={l3Code}
              onChange={(e) => handleL3Change(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm shadow-sm transition-all"
            >
              <option value="">-- {t("selectLevel3")} --</option>
              {l3List.map((cat: Category) => (
                <option key={cat.code} value={cat.code}>
                  {getLangName(cat, normalizedLang)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
