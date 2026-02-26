import { MetadataRoute } from "next";
import { APP_URL } from "@/shared/config/api.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["vi", "en", "cn", "ja"];

  // Add static entries here
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const prefix = locale === "vi" ? "" : `/${locale}`;
    return [
      {
        url: `${APP_URL}${prefix}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
    ];
  });

  return staticEntries;
}
