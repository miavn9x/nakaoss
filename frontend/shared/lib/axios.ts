import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/shared/config/api.config";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL || "http://localhost:4000/api",
  withCredentials: true,
});

let isRefreshing = false;

// --- Request Interceptor: Attach Sudo Token if available ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Chỉ chạy trên Client-side
    if (typeof window !== "undefined") {
      const sudoToken = sessionStorage.getItem("sudoToken");
      if (sudoToken) {
        config.headers["x-sudo-token"] = sudoToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.code === "ERR_NETWORK" || !error.response) {
      // toast.error(
      //   "Không thể kết nối đến Server! Vui lòng kiểm tra lại Backend."
      // );
      // Siltently fail or handled by UI boundary
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Nếu là các API xác thực cơ bản, không retry mà xử lý logout luôn
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/re-access-token")
      ) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("NAKA_SESSION_HINT");
          localStorage.clear();
          sessionStorage.clear();
          window.dispatchEvent(new CustomEvent("naka-session-expired"));
        }
        return Promise.reject(error);
      }

      if (originalRequest._retry || isRefreshing) return Promise.reject(error);

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/re-access-token");
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("NAKA_SESSION_HINT");
          localStorage.clear();
          sessionStorage.clear();
          window.dispatchEvent(new CustomEvent("naka-session-expired"));
        }
        return Promise.reject(refreshError);
      }
    }

    // --- Sudo Mode Handler ---
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const errorCode = (error.response?.data as any)?.errorCode;

    if (error.response?.status === 403 && errorCode === "REQUIRE_SUDO_MODE") {
      return new Promise((resolve, reject) => {
        const onSudoSuccess = () => {
          const sudoToken = sessionStorage.getItem("sudoToken");
          if (sudoToken) {
            originalRequest.headers["x-sudo-token"] = sudoToken;
            resolve(axiosInstance(originalRequest));
          } else {
            reject(error);
          }
          cleanup();
        };

        const onSudoCancel = () => {
          reject(error);
          cleanup();
        };

        const cleanup = () => {
          window.removeEventListener("sudo-success", onSudoSuccess);
          window.removeEventListener("sudo-cancel", onSudoCancel);
        };

        window.addEventListener("sudo-success", onSudoSuccess);
        window.addEventListener("sudo-cancel", onSudoCancel);

        // Trigger UI to show Sudo Modal
        window.dispatchEvent(new CustomEvent("sudo-required"));
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
