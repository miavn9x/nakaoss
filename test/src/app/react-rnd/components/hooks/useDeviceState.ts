import { useState, useCallback } from "react";
import { DeviceType, BannerBg } from "../types";

export function useDeviceState() {
      const [device, setDevice] = useState<DeviceType>("desktop");
      const [bannerHeights, setBannerHeights] = useState<Record<DeviceType, number>>({
            desktop: 300,
            ipad: 300,
            mobile: 300,
      });
      const bannerHeight = bannerHeights[device];

      const updateBannerHeight = useCallback(
            (h: number) => {
                  setBannerHeights((prev) => ({ ...prev, [device]: h }));
            },
            [device]
      );

      const [bannerBg, setBannerBg] = useState<BannerBg>({
            type: "color",
            value: "#ffffff",
      });

      return {
            device,
            setDevice,
            bannerHeights,
            setBannerHeights,
            bannerHeight,
            updateBannerHeight,
            bannerBg,
            setBannerBg,
      };
}
