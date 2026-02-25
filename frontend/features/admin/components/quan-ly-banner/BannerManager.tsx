"use client";

import { useTranslations } from "next-intl";

import React, { useEffect, useState } from "react";
import { IBanner } from "./types";
import { BannerForm } from "./components/BannerForm";
import BannerList from "./components/BannerList";
import { useBannerManager } from "./hooks/useBannerManager";
import { useAdminPage } from "../../contexts/AdminPageContext";
interface BannerManagerProps {
  view?: "list" | "create";
}

export default function BannerManager({ view = "list" }: BannerManagerProps) {
  const t = useTranslations("AdminBanner");
  const {
    banners,
    loading,
    togglingMap,
    fetchBanners,
    handleDelete,
    handleToggleVisibility,
  } = useBannerManager();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

  useEffect(() => {
    if (view === "create") {
      handleCreate();
    } else {
      setIsFormOpen(false);
      setEditingBanner(null);
    }
  }, [view]);

  const handleCreate = () => {
    setEditingBanner(null);
    setIsFormOpen(true);
  };

  const handleEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const { currentPage, setCurrentPage } = useAdminPage();

  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
    fetchBanners();
    // Reset view to list
    if (view === "create") {
      setCurrentPage("banners-list");
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingBanner(null);
    if (view === "create") {
      setCurrentPage("banners-list");
    }
  };

  if (isFormOpen) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingBanner ? t("editBanner") : t("createBanner")}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <BannerForm
            initialData={editingBanner}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <BannerList
      banners={banners}
      loading={loading}
      togglingMap={togglingMap}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleVisibility={handleToggleVisibility}
    />
  );
}
