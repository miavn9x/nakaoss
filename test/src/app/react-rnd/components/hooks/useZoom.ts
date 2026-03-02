import { useState, useEffect } from "react";
import { deviceWidths, DeviceType } from "../types";

export function useZoom(device: DeviceType, bannerHeight: number) {
      const [scaleMode, setScaleMode] = useState("fit");
      const [currentZoom, setCurrentZoom] = useState(1);
      const containerWidth = deviceWidths[device];

      useEffect(() => {
            const calculateZoom = () => {
                  if (scaleMode === "fit") {
                        const availableWidth = window.innerWidth - 450; // sidebar + padding
                        const availableHeight = window.innerHeight - 150; // top toolbar + padding

                        const zoomW = availableWidth / containerWidth;
                        const zoomH = availableHeight / bannerHeight;

                        // Chỉnh mức zoom để đảm bảo hiển thị đủ toàn bộ chiều rộng VÀ chiều cao trong màn hình
                        let newZoom = Math.min(zoomW, zoomH);

                        // Cấu hình max zoom là 2.5x để to rõ nhưng không bị vỡ hạt, min là 0.1x
                        newZoom = Math.max(0.1, Math.min(newZoom, 2.5));
                        setCurrentZoom(newZoom);
                  } else if (scaleMode === "100") {
                        setCurrentZoom(1);
                  }
            };

            calculateZoom();
            window.addEventListener("resize", calculateZoom);
            return () => window.removeEventListener("resize", calculateZoom);
      }, [containerWidth, bannerHeight, scaleMode]);

      return {
            scaleMode,
            setScaleMode,
            currentZoom,
            setCurrentZoom,
            containerWidth,
      };
}
