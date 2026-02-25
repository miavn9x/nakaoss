"use client";
// Force rebuild

import React, { useEffect, useState } from "react";
import { FileText, RefreshCw, Calendar } from "lucide-react";
import { useTranslations, useFormatter, useLocale } from "next-intl";

import { postService } from "../components/quan-ly-noi-dung/services/postService";
import { useAdminPage } from "../contexts/AdminPageContext";
import BackupDashboardWidget from "../components/backup/BackupDashboardWidget";

interface DashboardData {
  postsCount: number;
  loading: boolean;
}

const DashboardStats = () => {
  const t = useTranslations("Dashboard");
  const format = useFormatter();
  const locale = useLocale();
  const { setCurrentPage } = useAdminPage();

  const [data, setData] = useState<DashboardData>({
    postsCount: 0,
    loading: true,
  });

  const initDashboard = async () => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      // Fetch Posts
      const postsRes = await postService.getPosts(1, 1);
      const postsTotal = postsRes.pagination?.total || 0;

      setData({
        postsCount: postsTotal,
        loading: false,
      });
    } catch (error) {
      console.error("Dashboard init error:", error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    initDashboard();
  }, []);

  const stats = [
    {
      title: t("posts"),
      value: data.loading ? "..." : format.number(data.postsCount),
      change: t("total"),
      isPositive: true,
      icon: FileText,
      color: "purple",
      description: t("posts_desc"),
      link: "content-posts",
    },
  ];

  const getTibetanDate = (date: Date) => {
    const weekdays = [
      "གཟའ་ཉི་མ།", // Sun
      "གཟའ་ཟླ་བ།", // Mon
      "གཟའ་མིག་དམར།", // Tue
      "གཟའ་ལྷག་པ།", // Wed
      "གཟའ་ཕུར་བ།", // Thu
      "གཟའ་པ་སངས།", // Fri
      "གཟའ་སྤེན་པ།", // Sat
    ];
    // Format: Weekday, Day/Month/Year
    return `${weekdays[date.getDay()]} ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  return (
    <div
      id="dashboard-stats"
      className="p-6 space-y-8 min-h-screen bg-gray-50/50"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={initDashboard}
            className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            disabled={data.loading}
            title={t("refresh")}
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-600 ${
                data.loading ? "animate-spin" : ""
              }`}
            />
          </button>
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">
              {locale === "bo"
                ? getTibetanDate(new Date())
                : format.dateTime(new Date(), {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            id={`stat-${index}`}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-lg ${
                  stat.color === "purple"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
          </div>
        ))}
        {/* Backup Widget */}
        <div className="md:col-span-2 lg:col-span-1">
          <BackupDashboardWidget />
        </div>
      </div>

      {/* Empty State / Welcome Message since we removed ecommerce charts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h2 className="text-lg font-semibold text-gray-700">
          {t("welcome_title")}
        </h2>
        <p className="text-gray-500 mt-2">{t("welcome_desc")}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
