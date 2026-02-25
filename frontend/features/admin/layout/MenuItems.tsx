"use client";

import { useState } from "react";
import {
  FileText,
  Globe,
  Home,
  Users,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useAdminPage } from "../contexts/AdminPageContext";
import { useSidebar } from "../contexts/SidebarContext";

interface MenuItemsProps {
  isSidebarOpen: boolean;
  idPrefix?: string;
}

interface SubMenuItem {
  label: string;
  page: string;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  page?: string;
  isWebLink?: boolean;
  href?: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

import { useTranslations } from "next-intl";

const MenuItems = ({ isSidebarOpen, idPrefix = "" }: MenuItemsProps) => {
  const t = useTranslations("Sidebar");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { setCurrentPage } = useAdminPage();
  const { toggleSidebar, toggleMobileMenu, isMobile } = useSidebar();

  const toggleSubmenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Mapping cho trang mặc định khi sidebar đóng
  const getDefaultPageForCollapsedMenu = (itemId: string): string | null => {
    const defaultPages: Record<string, string> = {
      users: "users-customers",
      content: "content-posts",
      media: "media-gallery",
      settings: "settings-website",
      security: "security-password",
    };
    return defaultPages[itemId] || null;
  };

  const menuSections: MenuSection[] = [
    // },
    {
      title: t("overview"),
      items: [
        {
          id: "dashboard",
          icon: Home,
          label: t("dashboard"),
          page: "dashboard",
        },
        {
          id: "website",
          icon: Globe,
          label: t("website"),
          isWebLink: true,
          href: "/",
        },
      ],
    },

    {
      title: t("user_management"),
      items: [
        {
          id: "users",
          icon: Users,
          label: t("user_list"),
          page: "users-list",
        },
      ],
    },

    {
      title: t("content_management"),
      items: [
        {
          id: "content",
          icon: FileText,
          label: t("content"),
          hasSubmenu: true,
          submenu: [
            { label: t("post_list"), page: "content-posts" },
            { label: t("create_post"), page: "content-create-post" },
          ],
        },
        {
          id: "categories",
          icon: BookOpen,
          label: t("categories"),
          hasSubmenu: true,
          submenu: [
            { label: t("categories"), page: "category-list" },
            { label: t("create"), page: "category-create" },
          ],
        },
      ],
    },
    {
      title: t("ads_management"),
      items: [
        {
          id: "banners",
          icon: ImageIcon,
          label: t("banner_management"),
          hasSubmenu: true,
          submenu: [
            { label: t("banner_list"), page: "banners-list" },
            { label: t("create_banner"), page: "banners-create" },
          ],
        },
        // {
        //   id: "advertisements",
        //   icon: Globe, // Tạm dùng icon Globe hoặc tìm cái khác
        //   label: t("ads"),
        //   page: "ads-manager",
        // },
        {
          id: "schedule",
          icon: Calendar,
          label: t("schedule_management"),
          page: "schedule-manager",
        },
      ],
    },
    {
      title: "Hệ thống", // Hardcoded or t('system')
      items: [
        {
          id: "backup",
          icon: ShieldCheck,
          label: "Backup & Restore", // Hardcoded or t('backup_restore')
          page: "backup",
        },
      ],
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.isWebLink && item.href) {
      const newWindow = window.open(item.href, "_blank");
      if (newWindow) newWindow.opener = null; // Security: prevent reverse tabnabbing
      return;
    } else if (item.hasSubmenu) {
      // Nếu sidebar đang đóng và không phải mobile
      if (!isSidebarOpen && !isMobile) {
        // Mở trang mặc định và mở sidebar
        const defaultPage = getDefaultPageForCollapsedMenu(item.id);
        if (defaultPage) {
          setCurrentPage(defaultPage);
        }
        toggleSidebar(); // Mở sidebar
        return;
      }
      // Nếu sidebar đang mở và không phải mobile, toggle submenu
      if (isSidebarOpen && !isMobile) {
        toggleSubmenu(item.id);
        return;
      }
      // Nếu là mobile, toggle submenu
      toggleSubmenu(item.id);
    } else if (item.page) {
      // Nếu sidebar đang đóng và không phải mobile, mở sidebar và navigate
      if (!isSidebarOpen && !isMobile) {
        setCurrentPage(item.page);
        toggleSidebar();
        return;
      }
      // Nếu sidebar đã mở, navigate đến trang
      setCurrentPage(item.page);
      // Đóng menu tương ứng dựa trên thiết bị
      if (isMobile) {
        toggleMobileMenu(); // Đóng mobile menu trên thiết bị di động
      }
    }
  };

  const handleSubItemClick = (subItem: SubMenuItem) => {
    if (subItem.page) {
      setCurrentPage(subItem.page);
      // Đóng menu tương ứng dựa trên thiết bị
      if (isMobile) {
        toggleMobileMenu(); // Đóng mobile menu trên thiết bị di động
      }
    }
  };

  return (
    <div className="py-4">
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-2">
          {isSidebarOpen && (
            <h3 className="px-4 py-2 text-red-600 font-bold text-sm">
              {section.title}
            </h3>
          )}

          {section.items.map((item) => (
            <div key={item.id}>
              <div
                id={`${idPrefix}${item.id}`}
                className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${
                  item.isWebLink
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleItemClick(item)}
                title={!isSidebarOpen ? item.label : ""}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 shrink-0 ${
                    item.isWebLink ? "text-blue-600" : "text-gray-500"
                  }`}
                />

                {isSidebarOpen && (
                  <>
                    <span
                      className={`grow ${
                        item.isWebLink ? "text-blue-600 font-medium" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.hasSubmenu &&
                      (activeMenu === item.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      ))}
                  </>
                )}
              </div>

              {item.hasSubmenu &&
                activeMenu === item.id &&
                isSidebarOpen &&
                item.submenu && (
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        id={`${idPrefix}menu-subitem-${subItem.page}`}
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                        onClick={() => handleSubItemClick(subItem)}
                      >
                        <span>{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MenuItems;
