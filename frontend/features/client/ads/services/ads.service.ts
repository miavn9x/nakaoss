import { fetchClient } from "@/shared/lib/fetch-client";

export enum AdvertisementPosition {
  LEFT = "left",
  RIGHT = "right",
  POPUP = "popup",
}

export interface AdvertisementMedia {
  mediaCode: string;
  url: string;
}

export interface Advertisement {
  code: string;
  title: string;
  position: AdvertisementPosition;
  media: AdvertisementMedia;
  link?: string;
  isActive: boolean;
  priority: number;
  width?: number;
  height?: number;
  offsetPercent?: number;
  offsetTop?: number;
}

export const getActiveAdvertisements = async (
  position?: AdvertisementPosition,
) => {
  const data = await fetchClient.get<Advertisement[]>("/advertisements", {
    params: {
      isActive: true,
      ...(position && { position }),
    },
    cacheStrategy: "LONG",
    next: { tags: ["ads"] },
  });
  return data || [];
};
