import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { bannerService } from "../services/banner.service";
import { IBanner } from "../types";

export const useBannerManager = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingMap, setTogglingMap] = useState<Record<string, boolean>>({});

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAllAdmin();
      setBanners(data);
    } catch (error) {
      // console.error(error);
      // toast.error("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (code: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;
    try {
      await bannerService.delete(code);
      toast.success("Xóa banner thành công");
      fetchBanners();
    } catch (error) {
      // console.error(error);
      // toast.error("Không thể xóa banner");
    }
  };

  const handleToggleVisibility = async (banner: IBanner) => {
    // Prevent double-clicking
    if (togglingMap[banner.code]) return;

    try {
      // Mark as toggling
      setTogglingMap((prev) => ({ ...prev, [banner.code]: true }));

      // Update backend first
      await bannerService.update(banner.code, { isVisible: !banner.isVisible });

      // Update UI after successful backend update
      setBanners((prev) =>
        prev.map((b) =>
          b.code === banner.code ? { ...b, isVisible: !b.isVisible } : b
        )
      );

      toast.success(`Banner đã ${!banner.isVisible ? "hiện" : "ẩn"}`);
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật trạng thái");
      // Refresh to ensure consistency
      fetchBanners();
    } finally {
      // Release lock
      setTogglingMap((prev) => ({ ...prev, [banner.code]: false }));
    }
  };

  return {
    banners,
    loading,
    togglingMap,
    fetchBanners,
    handleDelete,
    handleToggleVisibility,
  };
};
