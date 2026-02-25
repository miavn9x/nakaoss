import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/category.types";
import { categoryService } from "../services/category.service";
import { CACHE_TIMINGS } from "@/shared/lib/fetch-client";

export const useCategoryTree = (initialData?: Category[]) => {
  const {
    data: categories = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["categories", "tree-full"],
    queryFn: categoryService.getTreeFull,
    // Match server-side cache (LONG - 1 hour) for consistency
    staleTime: CACHE_TIMINGS.LONG * 1000,
    gcTime: CACHE_TIMINGS.LONG * 1000 * 24, // Keep in memory for 24h as per previous logic (or just match LONG?
    select: (data) => data.filter((cat) => cat.isActive !== false),
    refetchOnWindowFocus: false, // Prevent unnecessary refetch on window focus
    initialData: initialData,
  });

  return { categories, loading, error };
};
