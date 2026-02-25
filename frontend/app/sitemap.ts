import { MetadataRoute } from "next";
import { getPostsServer } from "@/features/client/post/services/post.server";
import { APP_URL } from "@/shared/config/api.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["vi", "en", "cn", "bo"];

  // 1. Fetch all posts (max depth for sitemap)
  // Note: we might need a dedicated endpoint for sitemap if we have thousands of posts
  const { items: posts } = await getPostsServer("page=1&limit=500");

  const postEntries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    return locales.map((locale) => {
      const detail =
        post.details.find((d) => d.lang === locale) || post.details[0];
      const slug = `${detail.slug}-${post.code}`;
      const catPath = post.categoryPath || [
        post.category.toLowerCase().replace(/_/g, "-"),
      ];
      const path = [locale, ...catPath, slug]
        .filter((p) => (locale === "vi" ? p !== "vi" : true))
        .join("/");

      return {
        url: `${APP_URL}/${path}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });
  });

  // 2. Add static pages and category entries here if needed
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const prefix = locale === "vi" ? "" : `/${locale}`;
    return [
      {
        url: `${APP_URL}${prefix}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      {
        url: `${APP_URL}${prefix}/tin-moi`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${APP_URL}${prefix}/tin-noi-bat`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
    ];
  });

  return [...staticEntries, ...postEntries];
}
