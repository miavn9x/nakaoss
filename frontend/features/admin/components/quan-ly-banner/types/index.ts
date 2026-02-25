export enum BannerType {
  MAIN = "MAIN",
  SUB = "SUB",
}

export interface IBanner {
  _id: string; // Keep for internal use if needed, but primary is code
  code: string;
  title: string;

  description?: string;
  buttonText?: string;
  imageUrl: string;
  imageMediaCode?: string; // MediaCode for efficient deletion
  link?: string;
  order: number;
  isVisible: boolean;
  type: BannerType;
  color?: string;
  titleColor?: string;

  buttonPos?: { top: number; left: number };

  buttonSize?: number;
  buttonColor?: string;
  buttonTextColor?: string;
  showTitle?: boolean;

  showButton?: boolean;
}

export interface ICreateBannerPayload {
  title: string;

  description?: string;
  buttonText?: string;
  imageUrl: string;
  imageMediaCode?: string; // MediaCode for efficient deletion
  link?: string;
  order?: number;
  isVisible?: boolean;
  type?: BannerType;
  color?: string;
  titleColor?: string;

  buttonPos?: { top: number; left: number };

  buttonSize?: number;
  buttonColor?: string;
  buttonTextColor?: string;
  showTitle?: boolean;

  showButton?: boolean;
}

export interface IUpdateBannerPayload extends Partial<ICreateBannerPayload> {}
