"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import MenuItems from "./MenuItems";
import { useSidebar } from "../contexts/SidebarContext";

import { useTranslations } from "next-intl";

const AdminSidebar = () => {
  const t = useTranslations("Sidebar");
  const { isSidebarOpen, toggleSidebar, isMobile } = useSidebar();

  if (isMobile) return null;

  return (
    <div
      id="admin-sidebar"
      className={`bg-white shadow-lg transition-all duration-100 ease-in-out relative ${
        isSidebarOpen ? "w-[300px]" : "w-16"
      } h-[calc(100vh-4rem)] sticky top-0 z-10`}
    >
      <button
        id="sidebar-toggle-btn"
        onClick={toggleSidebar}
        className="absolute top-4 -right-4 z-100 w-8 h-8 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center cursor-pointer transition-all duration-100 ease-in-out hover:bg-gray-50 hover:shadow-lg"
        title={isSidebarOpen ? t("collapse") : t("expand")}
      >
        {isSidebarOpen ? (
          <PanelLeftClose className="w-4 h-4 text-gray-600" />
        ) : (
          <PanelLeftOpen className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-150 scrollbar-track-gray-100 overscroll-contain [scrollbar-gutter:stable]">
        <MenuItems isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default AdminSidebar;
