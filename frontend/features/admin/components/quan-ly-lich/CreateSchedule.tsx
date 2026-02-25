"use client";

import { useState, useRef, useEffect } from "react";
import { Save, ArrowLeft, FileText } from "lucide-react";
import SunEditorComponent from "@/shared/components/SunEditorComponent";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import { useSchedule } from "@/features/admin/components/quan-ly-lich/hooks/useSchedule";
import { useTranslations } from "next-intl";

export default function CreateSchedule() {
  const t = useTranslations("AdminSchedule");
  const { setCurrentPage } = useAdminPage();
  const { createSchedule } = useSchedule();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    startDate: "",
    location: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.content) return;
    setIsSaving(true);
    try {
      await createSchedule({
        ...formData,
        title:
          formData.title ||
          t("defaultTitle", { date: new Date().toLocaleDateString("vi-VN") }),
        cover: { mediaCode: "", url: "" },
      });
      setCurrentPage("schedule-manager");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage("schedule-manager")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </button>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t("createEvent")}
            </h2>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !formData.content}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? t("saving") : t("saveEvent")}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("contentDetail")}
            </label>
            <SunEditorComponent
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder={t("enterContentPlaceholder", { language: "" })}
              height="400px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
