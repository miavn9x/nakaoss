"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Schedule } from "@/features/admin/components/quan-ly-lich/types/schedule.types";
import { scheduleService } from "../services/schedule.service";
import SunEditorContent from "@/shared/components/SunEditorContent";

export default function ScheduleList() {
  const locale = useLocale();
  const t = useTranslations("Schedule");
  const tCommon = useTranslations("Common");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await scheduleService.getAll({ limit: 10, page: 1 });
        setSchedules(response.data?.items || []);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 mt-8 text-center text-gray-600">
        {tCommon("loading")}
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="container mx-auto px-4 mt-8 text-center text-gray-600">
        {t("no_events")}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-8 space-y-12">
      {schedules.map((schedule) => {
        // Find detail for current locale, fallback to first available or empty
        const detail =
          schedule.details.find((d) => d.lang === locale) ||
          schedule.details[0];

        if (!detail) return null;

        return (
          <div key={schedule.code} className="schedule-item">
            {/* HTML Content */}
            <div className="mt-8 bg-white p-4 md:p-8 rounded shadow-sm text-gray-700 leading-relaxed text-base md:text-lg">
              <SunEditorContent content={detail.content} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
