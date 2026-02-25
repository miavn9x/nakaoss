import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState } from "react";
import { CategoryService } from "../services/category.service";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category.types";

export const useCategoriesTree = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const query = useQuery({
    queryKey: ["categories", "tree", page, limit],
    queryFn: () => CategoryService.getTree(page, limit),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000, // Reduced to 1 minute for admin
  });

  return {
    ...query,
    page,
    setPage,
    limit,
    setLimit,
  };
};

export const useFullCategoriesTree = () => {
  return useQuery({
    queryKey: ["categories", "tree-full"],
    queryFn: () => CategoryService.getTreeFull(),
    staleTime: 5 * 60 * 1000, // 5 minutes (Menus/Selects don't change that often)
  });
};

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories", "flat"],
    queryFn: CategoryService.getAll,
    staleTime: 60 * 1000, // Reduced to 1 minute for admin
  });
};

export const useCategory = (code: string | null) => {
  return useQuery({
    queryKey: ["categories", "detail", code],
    queryFn: () => CategoryService.getOne(code!),
    enabled: !!code,
    staleTime: 60 * 1000, // Reduced to 1 minute for admin
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const createCategory = useMutation({
    mutationFn: (data: CreateCategoryRequest) => CategoryService.create(data),
    onSuccess: invalidate,
  });

  const updateCategory = useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string;
      data: UpdateCategoryRequest;
    }) => CategoryService.update(code, data),
    onSuccess: (updatedData, variables) => {
      invalidate();
      // Also specifically invalidate the detail cache for this code
      queryClient.invalidateQueries({
        queryKey: ["categories", "detail", variables.code],
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (code: string) => CategoryService.delete(code),
    onSuccess: invalidate,
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
