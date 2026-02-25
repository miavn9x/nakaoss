import { useState } from "react";
import { User, Pagination } from "../types/user.types";
import { userService } from "../services/userService";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useUsers = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isPlaceholderData, isFetching, refetch } =
    useQuery({
      queryKey: ["users", page, limit, searchTerm],
      queryFn: () => userService.getUsers(page, limit, searchTerm),
      placeholderData: keepPreviousData, // Giữ dữ liệu cũ khi đang fetch
      staleTime: 5000, // Cache 5 giây
    });

  const refreshUsers = async (search?: string) => {
    if (search !== undefined) {
      setSearchTerm(search);
      setPage(1); // Reset vể trang 1 khi search
    } else {
      await refetch();
    }
  };

  return {
    users: data?.items || [],
    pagination: data?.pagination || null,
    isLoading,
    isPlaceholderData,
    isFetching,
    error: isError ? "Failed to fetch users" : null,
    refreshUsers,
    page,
    setPage,
    limit,
    setLimit,
  };
};
