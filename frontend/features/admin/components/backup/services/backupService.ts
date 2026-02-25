import axiosInstance from "@/shared/lib/axios";

export interface BackupResponse {
  success: boolean;
  message: string;
}

export interface OtpResponse {
  message: string;
  data?: {
    sudoToken: string;
  };
}

class BackupService {
  private baseUrl = "/backup";
  private authUrl = "/auth/sudo";

  // Request Sudo OTP
  async requestOtp(): Promise<OtpResponse> {
    const response = await axiosInstance.post<OtpResponse>(
      `${this.authUrl}/request`,
    );
    return response.data;
  }

  // Verify Sudo OTP
  async verifyOtp(otp: string): Promise<OtpResponse> {
    const response = await axiosInstance.post<OtpResponse>(
      `${this.authUrl}/verify`,
      { otp },
    );
    return response.data;
  }

  // Download Backup (Returns Blob)
  async downloadBackup(token: string): Promise<Blob> {
    const response = await axiosInstance.get(`${this.baseUrl}/download`, {
      headers: {
        "x-sudo-token": token,
      },
      responseType: "blob",
    });
    return response.data;
  }

  // Restore Backup
  async restoreBackup(
    file: File,
    token: string,
    onProgress?: (percent: number) => void,
  ): Promise<BackupResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<BackupResponse>(
      `${this.baseUrl}/restore`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-sudo-token": token,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percentCompleted);
          }
        },
      },
    );
    return response.data;
  }
}

export const backupService = new BackupService();
