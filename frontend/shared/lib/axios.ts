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
        console.log("[Axios] Attaching Sudo Token to request:", config.url);
        config.headers["x-sudo-token"] = sudoToken;
      } else {
        console.log("[Axios] No Sudo Token found in sessionStorage");
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu URL là /auth/login hoặc /auth/register thì không retry refresh token, mà trả lỗi luôn để Form xử lý
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) return Promise.reject(error);

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/re-access-token");
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Session expired or invalid - Force Logout
        localStorage.clear();
        sessionStorage.clear();
        // Không redirect cứng, để UI tự xử lý khi Promise reject
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
