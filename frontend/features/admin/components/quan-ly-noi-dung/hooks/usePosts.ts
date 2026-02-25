import { useState, useCallback, useRef } from "react";
import type React from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  postService,
  type Post,
  type PostListItem,
  type MediaCover,
  type PostDetail,
  type Pagination,
  type ApiResponse,
} from "@/features/admin/components/quan-ly-noi-dung/services/postService";
import { useAdminMedia } from "@/features/admin/components/media/hooks/useAdminMedia";
import { MediaUsageEnum } from "@/features/admin/components/media/types/adminMedia.types";

interface UsePostsReturn {
  posts: PostListItem[];
  pagination: Pagination | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  createPost: (_postData: Partial<Post>) => Promise<ApiResponse<Post>>;
  updatePost: (
    _code: string,
    _postData: Partial<Post>,
  ) => Promise<ApiResponse<Post>>;
  deletePost: (_code: string) => Promise<ApiResponse<Post>>;
  getPost: (_code: string) => Promise<Post | null>;
  refreshPosts: (filters?: any) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  uploadImage: (_file: File) => Promise<MediaCover>;
  deleteImage: (_mediaCode: string) => Promise<void>;
  uploadState: {
    isLoading: boolean;
    error: string | null;
  };
  coverImageInputRef: React.RefObject<HTMLInputElement | null>;
  clearCoverInput: () => void;
}

export function usePostMutations() {
  const [uploadState, setUploadState] = useState({
    isLoading: false,
    error: null as string | null,
  });

  const { uploadSingle, uploadSingleState, hardDelete } = useAdminMedia();
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const clearCoverInput = useCallback(() => {
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
  }, []);

  const uploadImage = useCallback(
    async (file: File): Promise<MediaCover> => {
      setUploadState({ isLoading: true, error: null });
      try {
        if (!file) throw new Error("No file selected");
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE)
          throw new Error("File size exceeds 5MB limit");

        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Only JPG, PNG, GIF, and WebP files are allowed");
        }

        const result = await uploadSingle(file, MediaUsageEnum.POST);
        setUploadState({ isLoading: false, error: null });

        return {
          mediaCode: result.data.mediaCode,
          url: result.data.url,
        };
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Upload failed";
        setUploadState({ isLoading: false, error: msg });
        throw new Error(msg);
      }
    },
    [uploadSingle],
  );

  const deleteImage = useCallback(
    async (mediaCode: string): Promise<void> => {
      try {
        if (!mediaCode) return;
        await hardDelete(mediaCode);
        clearCoverInput();
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Delete failed",
        );
      }
    },
    [hardDelete, clearCoverInput],
  );

  const createPost = useCallback(
    async (postData: Partial<Post>): Promise<ApiResponse<Post>> => {
      try {
        const response = await postService.createPost(postData);
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        clearCoverInput();
        return response;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to create post",
        );
      }
    },
    [queryClient, clearCoverInput],
  );

  const updatePost = useCallback(
    async (
      code: string,
      postData: Partial<Post>,
    ): Promise<ApiResponse<Post>> => {
      try {
        const response = await postService.updatePost(code, postData);
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        await queryClient.invalidateQueries({ queryKey: ["post", code] }); // Invalidate detail as well
        return response;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to update post",
        );
      }
    },
    [queryClient],
  );

  const deletePost = useCallback(
    async (code: string): Promise<ApiResponse<Post>> => {
      try {
        const response = await postService.deletePost(code);
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        await queryClient.invalidateQueries({ queryKey: ["post", code] });
        return response;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to delete post",
        );
      }
    },
    [queryClient],
  );

  const getPost = useCallback(async (code: string): Promise<Post | null> => {
    try {
      return await postService.getPost(code);
    } catch (err) {
      throw err;
    }
  }, []);

  const combinedUploadState = {
    isLoading: uploadState.isLoading || uploadSingleState.isLoading,
    error:
      uploadState.error ||
      (uploadSingleState.error ? String(uploadSingleState.error) : null),
  };

  return {
    createPost,
    updatePost,
    deletePost,
    getPost,
    uploadImage,
    deleteImage,
    uploadState: combinedUploadState,
    coverImageInputRef,
    clearCoverInput,
  };
}

export function usePosts(): UsePostsReturn {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<any>({});

  const {
    createPost,
    updatePost,
    deletePost,
    getPost,
    uploadImage,
    deleteImage,
    uploadState,
    coverImageInputRef,
    clearCoverInput,
  } = usePostMutations();

  // --- React Query ---
  const {
    data,
    isLoading,
    isError,
    error: queryError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["posts", page, limit, filters],
    queryFn: () => postService.getPosts(page, limit, filters),
    placeholderData: keepPreviousData, // Giữ data cũ khi chuyển trang
    staleTime: 5000,
  });

  const refreshPosts = useCallback(
    async (newFilters?: any) => {
      if (newFilters) {
        setFilters(newFilters);
        // Query key changes, React Query handles fetch
      } else {
        await refetch();
      }
    },
    [refetch],
  );

  return {
    posts: data?.items || [],
    pagination: data?.pagination || null,
    isLoading,
    isFetching,
    error: isError ? (queryError as Error).message : null,
    createPost,
    updatePost,
    deletePost,
    getPost,
    refreshPosts,
    setPage,
    setLimit,
    uploadImage,
    deleteImage,
    uploadState,
    coverImageInputRef,
    clearCoverInput,
  };
}

// Hook to fetch a single post by code
export function usePost(code: string | null) {
  return useQuery({
    queryKey: ["post", code],
    queryFn: () => (code ? postService.getPost(code) : null),
    enabled: !!code,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export type { Post, PostListItem, MediaCover, PostDetail, Pagination };
