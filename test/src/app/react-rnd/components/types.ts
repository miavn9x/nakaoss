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
  textFillType?: "color" | "gradient";
  textGradient?: string;
  fontSize: number;
  textAlign: "left" | "center" | "right" | "justify";
  fontWeight: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  fontFamily: string;
  // Nội dung (Dành cho Image)
  imageUrl?: string;
  imageUrls?: Record<DeviceType, string>;
  imageOpacity?: number;
  // Khung (Box) - Dùng chung
  backgroundColor: string;
  backgroundFillType?: "color" | "gradient";
  backgroundGradient?: string;
  padding: number;
  borderRadius: number;
  // Viền (Border) - Dùng chung
  hasBorder: boolean;
  borderColor: string;
  borderGradient?: string;
  borderFillType?: "color" | "gradient";
  borderWidth: number;
  // Đổ bóng (Shadow) - Dùng chung
  hasShadow: boolean;
  // Xoay phần tử (Rotation)
  rotation?: number;
  // Lật ngược phần tử (Flip)
  flipX?: boolean;
  flipY?: boolean;

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

export interface ActiveGuide {
  type: "vertical" | "horizontal";
  position: number;
}
