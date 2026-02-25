"use client";

import { useState, useEffect } from "react";

import { useAdminPage } from "../contexts/AdminPageContext";
import PostsList from "../components/quan-ly-noi-dung/PostsList";
import CreatePost from "../components/quan-ly-noi-dung/CreatePost";
import EditPost from "../components/quan-ly-noi-dung/EditPost";
import DashboardStats from "../dashboard/DashboardStats";
import GuideCenter from "../components/guide/GuideCenter";
import AdsManager from "../components/quan-ly-ads/AdsManager";
import BannerManager from "../components/quan-ly-banner/BannerManager";
import ScheduleManager from "../components/quan-ly-lich/ScheduleManager";
import CreateSchedule from "../components/quan-ly-lich/CreateSchedule";
import UserList from "../components/quan-ly-ngươi-dung/UserList";
import CategoryList from "../components/quan-ly-danh-muc/CategoryList";
import CreateCategory from "../components/quan-ly-danh-muc/CreateCategory";
import EditCategory from "../components/quan-ly-danh-muc/EditCategory";
import BackupPage from "../components/backup/BackupPage";

const AdminContent = () => {
  const { currentPage, setCurrentPage } = useAdminPage();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardStats />;

      case "users-list":
        return <UserList />;

      case "category-list":
        return <CategoryList />;
      case "category-create":
        return <CreateCategory />;
      case "category-edit":
        return <EditCategory />;

      case "guide-center":
        return <GuideCenter />;

      case "content-posts":
        return <PostsList />;
      case "content-create-post":
        return <CreatePost />;
      case "content-edit-post":
        return <EditPost />;

      // Advertisement
      case "ads-manager":
        return <AdsManager />;

      // Banner
      case "banners-list":
        return <BannerManager view="list" />;
      case "banners-create":
        return <BannerManager view="create" />;

      // Schedule
      case "schedule-manager":
        return <ScheduleManager />;
      case "schedule-create":
        return <CreateSchedule />;

      // Backup & Restore
      case "backup":
        return <BackupPage />;

      default:
        return <DefaultPage currentPage={currentPage} />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="h-full w-full overflow-auto">
        <div className="min-w-full inline-block">
          <div className="overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-150 scrollbar-track-gray-100">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useTranslations } from "next-intl";

const DefaultPage = ({ currentPage }: { currentPage: string }) => {
  const t = useTranslations("DefaultPage");

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 sm:px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("page_developing")}
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-4">🚧</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {t("feature_developing")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.rich("page_in_development_msg", {
                page: currentPage,
                bold: (chunks) => (
                  <strong className="text-blue-600">{chunks}</strong>
                ),
              })}
            </p>
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4 text-left">
                  <h4 className="text-sm font-medium text-blue-800">
                    {t("need_support")}
                  </h4>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-3">{t("contact_dev")}</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium">📧</span>
                        <span className="ml-2 text-xs sm:text-sm">
                          developer@wfourtech.com
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">📱</span>
                        <span className="ml-2 text-xs sm:text-sm">
                          0123-456-789
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">💬</span>
                        <span className="ml-2 text-xs sm:text-sm">
                          0123-456-789
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      {t("contact_now")}
                    </button>
                    <button className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50 transition-colors">
                      {t("get_quote")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
