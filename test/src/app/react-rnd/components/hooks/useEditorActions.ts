import React, { useCallback } from "react";
import { BannerBg, BannerElement, DeviceType } from "../types";

export function useEditorActions(
      bannerBg: BannerBg,
      bannerHeight: number,
      elements: BannerElement[],
      setElements: React.Dispatch<React.SetStateAction<BannerElement[]>>,
      setBannerHeights: React.Dispatch<React.SetStateAction<Record<DeviceType, number>>>,
      setBannerBg: React.Dispatch<React.SetStateAction<BannerBg>>,
      setSelectedId: React.Dispatch<React.SetStateAction<string | null>>
) {
      const handleExport = useCallback(() => {
            const data = { bannerBg, bannerHeight, elements };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `banner-${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
      }, [bannerBg, bannerHeight, elements]);

      const handleReset = useCallback(() => {
            if (confirm("Sẽ xóa toàn bộ nội dung và thông số nền về mặc định. Chắc chắn chứ?")) {
                  setElements([]);
                  setBannerHeights({ desktop: 300, ipad: 300, mobile: 300 });
                  setBannerBg({ type: "color", value: "#ffffff" });
                  setSelectedId(null);
            }
      }, [setElements, setBannerHeights, setBannerBg, setSelectedId]);

      return { handleExport, handleReset };
}
