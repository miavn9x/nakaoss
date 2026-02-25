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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdvertisementDto {
  title: string;
  position: AdvertisementPosition;
  media: AdvertisementMedia;
  link?: string;
  isActive?: boolean;
  priority?: number;
  width?: number;
  height?: number;
  offsetPercent?: number;
  offsetTop?: number;
}

export interface UpdateAdvertisementDto {
  title?: string;
  position?: AdvertisementPosition;
  media?: AdvertisementMedia;
  link?: string;
  isActive?: boolean;
  priority?: number;
  width?: number;
  height?: number;
  offsetPercent?: number;
  offsetTop?: number;
}
