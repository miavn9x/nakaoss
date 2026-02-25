import React from "react";
import { clientBannerService } from "./services/banner.service";
import Banner from "./Banner";

export default async function BannerWrapper() {
  const banners = await clientBannerService.getBannersServer();
  return <Banner initialData={banners} />;
}
