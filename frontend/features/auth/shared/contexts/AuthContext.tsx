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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (): Promise<User | null> => {
    try {
      const response = await axiosInstance.get("/user/me");
      if (response.data && response.data.data) {
        setUser(response.data.data);
        return response.data.data;
      } else {
        setUser(null);
        return null; // Return null explicitly
      }
    } catch (error) {
      // 401 Unauthorized is handled by axios interceptor (mostly), but if it returns error, we set user null
      setUser(null);
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

    window.addEventListener("storage", handleStorageChange);

    return () => {
      authChannel.close();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = async (userData?: User) => {
    const authChannel = new BroadcastChannel("auth-sync");
    if (userData) {
      setUser(userData);
      authChannel.postMessage({ type: "login", timestamp: Date.now() });
      authChannel.close();
      return userData;
    }

    const data = await fetchProfile();
    // Broadcast login to other tabs
    if (data) {
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

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshProfile }}
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
