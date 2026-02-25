import { fetchClient } from "@/shared/lib/fetch-client";
import { Category } from "../types/category.types";

export const categoryService = {
  getTreeFull: async (): Promise<Category[]> => {
    // Sử dụng 'LONG' cache (1 giờ) cho Menu vì ít thay đổi
    // Tự động handle try/catch và trả về [] nếu lỗi
    const data = await fetchClient.get<Category[]>("/categories/tree-full", {
      cacheStrategy: "LONG",
      next: { tags: ["categories"] }, // Support On-Demand Revalidation
    });
    return data || [];
  },
};
