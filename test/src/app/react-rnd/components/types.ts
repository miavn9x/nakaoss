export type ElementBounds = {
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
};

export type BannerElement = {
  id: string;
  type: "text" | "image";

  // Tọa độ và kích thước tách biệt độc lập trên từng thiết bị
  bounds: Record<DeviceType, ElementBounds>;

  // Nội dung (Dành cho Text)
  text: string;
  // Font & Chữ (Dành cho Text)
  color: string;
  fontSize: number;
  textAlign: "left" | "center" | "right";
  fontWeight: "normal" | "bold";
  fontFamily: string;
  // Nội dung (Dành cho Image)
  imageUrl?: string;
  imageUrls?: Record<DeviceType, string>;
  imageOpacity?: number;
  // Khung (Box) - Dùng chung
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  // Viền (Border) - Dùng chung
  hasBorder: boolean;
  borderColor: string;
  borderWidth: number;
  // Đổ bóng (Shadow) - Dùng chung
  hasShadow: boolean;
  // Tính năng Khóa phần tử chặn thao tác
  isLocked?: boolean;
};

export type DeviceType = "desktop" | "ipad" | "mobile";

export const deviceWidths: Record<DeviceType, number> = {
  desktop: 2560,
  ipad: 768,
  mobile: 375,
};

export type BannerBg = {
  type: "color" | "gradient" | "image";
  value: string;
};
