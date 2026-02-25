import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Phật Giáo - Kênh tin tức, sự kiện Phật giáo Việt Nam",
    short_name: "Phật Giáo",
    description:
      "Cổng thông tin tin tức, sự kiện và kiến thức Phật giáo chính thống tại Việt Nam.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d3b78",
    icons: [
      {
        src: "/img/VvAzinO9.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
