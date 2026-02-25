import axiosClient from "@/shared/lib/axios";
import { IBanner } from "../types";
import { fetchClient } from "@/shared/lib/fetch-client";

export const clientBannerService = {
  getAll: async (): Promise<IBanner[]> => {
    const response = await axiosClient.get("/banners/public");
    return response.data.data;
  },

  getBannersServer: async (): Promise<IBanner[]> => {
    // Use LONG cache (1 hour) for Banners as they rarely change
    const data = await fetchClient.get<IBanner[]>("/banners/public", {
      cacheStrategy: "LONG",
      next: { tags: ["banners"] },
    });
    return data || [];
  },

  revalidate: async () => {
    "use server";
    const { revalidateTag, revalidatePath } = await import("next/cache");

    // 1. Force clear data cache (Crucial for tags)
    try {
      (revalidateTag as any)("banners");
    } catch (e) {
      console.error("RevalidateTag failed", e);
    }

    // 2. Force clear page cache
    revalidatePath("/", "layout");
  },
};
