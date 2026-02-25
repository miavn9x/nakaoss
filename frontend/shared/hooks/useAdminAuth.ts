"use client";
import axiosInstance from "@/shared/lib/axios";
import { useEffect, useState } from "react";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        await axiosInstance.post("/auth/re-access-token");
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    refresh();

    // Listen for logout from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      // localStorage.clear() triggers this with key: null
      if (
        event.key === null ||
        event.key === "user" ||
        (event.key === "auth-sync" && event.newValue?.startsWith("logout"))
      ) {
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { loading };
};
