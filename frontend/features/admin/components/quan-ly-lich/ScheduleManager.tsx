"use client";

import { useState, useEffect } from "react";
import { Save, Trash2, Edit, X } from "lucide-react";
import { useSchedule } from "@/features/admin/components/quan-ly-lich/hooks/useSchedule";
import TinyMCEComponent from "@/shared/components/TinyMCEComponent";
import TinyMCEContent from "@/shared/components/TinyMCEContent";
import { useTranslations } from "next-intl";

const ScheduleManager = () => {
  const t = useTranslations("AdminSchedule");
  const {
    schedules,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    isLoading,
  } = useSchedule();

  /* Refactored for Multi-language support */
  const [activeTab, setActiveTab] = useState("vi");
  const [details, setDetails] = useState<{
    [key: string]: { title: string; content: string };
  }>({
    vi: { title: "", content: "" },
    en: { title: "", content: "" },
    cn: { title: "", content: "" },
    bo: { title: "", content: "" },
  });

  const LANGUAGES = [
    { code: "vi", label: t("languages.vi") },
    { code: "en", label: t("languages.en") },
    { code: "cn", label: t("languages.cn") },
    { code: "bo", label: t("languages.bo") },
  ];

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  // Load existing schedule on mount
  useEffect(() => {
    fetchSchedules(1, "");
  }, [fetchSchedules]);

  // Sync data
  useEffect(() => {
    if (schedules.length > 0) {
      const existing = schedules[0];
      const newDetails: any = {
        vi: { title: "", content: "" },
        en: { title: "", content: "" },
        cn: { title: "", content: "" },
        bo: { title: "", content: "" },
      };

      if (existing.details && Array.isArray(existing.details)) {
        existing.details.forEach((d) => {
          if (newDetails[d.lang]) {
            newDetails[d.lang] = { title: d.title, content: d.content };
          }
        });
      }
      setDetails(newDetails);
      setIsEditing(false);
    } else {
      // Reset if no schedules
      setDetails({
        vi: { title: "", content: "" },
        en: { title: "", content: "" },
        cn: { title: "", content: "" },
        bo: { title: "", content: "" },
      });
      setIsEditing(true);
    }
  }, [schedules]);

  const handleDetailChange = (
    lang: string,
    field: "title" | "content",
    value: string,
  ) => {
    setDetails((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    // Validate: At least one language must have content (e.g., VI)
    if (!details.vi.content) {
      alert(t("validationMessage"));
      return;
    }

    setIsSaving(true);

    // Transform state to array for backend
    const detailsArray = Object.keys(details).map((lang) => ({
      lang,
      title:
        details[lang].title ||
        (lang === "vi"
          ? t("defaultTitle", { date: new Date().toLocaleDateString("vi-VN") })
          : details[lang].title),
      content: details[lang].content,
    }));

    const payload = { details: detailsArray };

    try {
      if (schedules.length > 0) {
        const existingCode = schedules[0].code;
        await updateSchedule(existingCode, payload);
      } else {
        await createSchedule(payload);
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (schedules.length > 0) {
      const existingCode = schedules[0].code;
      await deleteSchedule(existingCode);
    }
  };

  const handleCancelEdit = () => {
    if (schedules.length > 0) {
      const existing = schedules[0];
      const newDetails: any = { ...details }; // Keep current or revert? Revert is better.
      // Re-sync logic similar to useEffect
      const resetDetails: any = {
        vi: { title: "", content: "" },
        en: { title: "", content: "" },
        cn: { title: "", content: "" },
        bo: { title: "", content: "" },
      };
      if (existing.details && Array.isArray(existing.details)) {
        existing.details.forEach((d) => {
          if (resetDetails[d.lang]) {
            resetDetails[d.lang] = { title: d.title, content: d.content };
          }
        });
      }
      setDetails(resetDetails);
      setIsEditing(false);
    }
  };

  if (isLoading && schedules.length === 0) {
    return <div className="p-6 text-center text-gray-500">{t("loading")}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        </div>

        {!isEditing && schedules.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <Edit size={18} />
              {t("editContent")}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              {t("delete")}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
        {/* Languages Tabs */}
        <div className="flex border-b mb-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveTab(lang.code)}
              className={`px-6 py-3 font-medium text-sm focus:outline-none transition-colors ${
                activeTab === lang.code
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {isEditing ? (
          // EDIT MODE
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                {t("editorTitle", {
                  language:
                    LANGUAGES.find((l) => l.code === activeTab)?.label || "",
                })}
              </h3>
              {schedules.length > 0 && (
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                  title={t("cancel")}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("contentLabel", { language: activeTab })}
              </label>
              <TinyMCEComponent
                key={activeTab} // Force re-render when switching tabs
                value={details[activeTab].content}
                onChange={(content) =>
                  handleDetailChange(activeTab, "content", content)
                }
                placeholder={t("enterContentPlaceholder", {
                  language:
                    LANGUAGES.find((l) => l.code === activeTab)?.label || "",
                })}
                height="500px"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              {schedules.length > 0 && (
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t("cancel")}
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading || isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {isSaving ? t("saving") : t("saveAll")}
              </button>
            </div>
          </div>
        ) : (
          // VIEW MODE
          <div className="sun-editor border-none!">
            <style jsx global>{`
              .tinymce-content-container {
                border: none !important;
                padding: 0 !important;
                outline: none !important;
              }
            `}</style>
            <TinyMCEContent
              content={details[activeTab].content}
              className="border-0! p-0! font-inherit min-h-auto outline-none!"
            />
            {!details[activeTab].content && (
              <p className="text-gray-500 italic">{t("noContent")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManager;
