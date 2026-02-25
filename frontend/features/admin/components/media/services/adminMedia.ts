// TUYỆT ĐỐI KHÔNG SỬA CODE NAY (Updated to use Axios for Auto-Refresh Token)
import axiosInstance from "@/shared/lib/axios";
import { MediaUsageEnum } from "../types/adminMedia.types";

const API_BASE = "/media";

export const mediaService = {
  async uploadSingle(file: File, usage: MediaUsageEnum) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("usage", usage);

    const res = await axiosInstance.post(`${API_BASE}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  async uploadMultiple(files: File[], usage: MediaUsageEnum) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("usage", usage);

    const res = await axiosInstance.post(`${API_BASE}/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  async hardDelete(mediaCode: string) {
    const res = await axiosInstance.delete(
      `${API_BASE}/${mediaCode}/hard-delete`,
    );
    return res.data;
  },

  async hardDeleteByUrl(url: string) {
    const res = await axiosInstance.delete(`${API_BASE}/by-url`, {
      data: { url },
    });
    return res.data;
  },
};
