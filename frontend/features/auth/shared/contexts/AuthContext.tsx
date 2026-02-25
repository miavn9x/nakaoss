"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/shared/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Define User Type based on backend response (simplified)
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData?: User) => Promise<User | null>; // Return User for redirection logic
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setSessionHint: () => void;
  clearSessionHint: () => void;
}

const SESSION_HINT_KEY = "NAKA_SESSION_HINT";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (force: boolean = false): Promise<User | null> => {
    // Tránh gọi API cho Guest chưa từng đăng nhập (Fix Console 401 spam)
    if (
      !force &&
      typeof window !== "undefined" &&
      !localStorage.getItem(SESSION_HINT_KEY)
    ) {
      setLoading(false);
      return null;
    }

    try {
      const response = await axiosInstance.get("/user/me");
      if (response.data && response.data.data) {
        setUser(response.data.data);
        return response.data.data;
      } else {
        setUser(null);
        localStorage.removeItem(SESSION_HINT_KEY);
        return null;
      }
    } catch (error) {
      setUser(null);
      // Nếu lỗi 401 thực sự, xóa hint để lần sau không gọi nữa
      localStorage.removeItem(SESSION_HINT_KEY);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Use BroadcastChannel for cross-tab synchronization
    const authChannel = new BroadcastChannel("auth-sync");

    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data;
      if (type === "login") {
        fetchProfile();
      } else if (type === "logout") {
        setUser(null);
        router.push("/");
        router.refresh();
      }
    };

    authChannel.onmessage = handleMessage;

    // Keep storage listener for extreme fallback or other storage-based logic if any
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === "user") {
        // Other tab logged out via clear()
        setUser(null);
        router.push("/");
        router.refresh();
      }
    };

    const handleSessionExpired = () => {
      setUser(null);
      localStorage.removeItem(SESSION_HINT_KEY);
      router.push("/");
      router.refresh();
      toast.error("Phiên làm việc hết hạn. Vui lòng đăng nhập lại.");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("naka-session-expired", handleSessionExpired);

    return () => {
      authChannel.close();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("naka-session-expired", handleSessionExpired);
    };
  }, []);

  const login = async (userData?: User) => {
    const authChannel = new BroadcastChannel("auth-sync");
    if (userData) {
      setUser(userData);
      localStorage.setItem(SESSION_HINT_KEY, "true");
      authChannel.postMessage({ type: "login", timestamp: Date.now() });
      authChannel.close();
      return userData;
    }

    const data = await fetchProfile(true); // Force bypass hint check during login flow
    // Broadcast login to other tabs
    if (data) {
      localStorage.setItem(SESSION_HINT_KEY, "true");
      authChannel.postMessage({ type: "login", timestamp: Date.now() });
    }
    authChannel.close();
    return data;
  };

  const logout = async () => {
    const authChannel = new BroadcastChannel("auth-sync");
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      // Broadcast logout to other tabs
      authChannel.postMessage({ type: "logout", timestamp: Date.now() });
      localStorage.removeItem(SESSION_HINT_KEY);
      localStorage.clear();
      sessionStorage.clear();
      toast.success("Đăng xuất thành công");
      router.push("/");
      router.refresh(); // Refresh to clear server components cache if any
    } catch (error) {
      console.error("Logout failed", error);
      // Force logout even if API fails
      setUser(null);
      authChannel.postMessage({ type: "logout", timestamp: Date.now() });
      localStorage.clear();
      sessionStorage.clear();
      router.push("/");
    } finally {
      authChannel.close();
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const setSessionHint = () => localStorage.setItem(SESSION_HINT_KEY, "true");
  const clearSessionHint = () => localStorage.removeItem(SESSION_HINT_KEY);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshProfile,
        setSessionHint,
        clearSessionHint,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
