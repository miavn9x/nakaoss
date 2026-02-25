import axiosInstance from "@/shared/lib/axios";

export interface LicenseInfo {
  licenseKey: string;
  status: string;
  licenseeName?: string;
  licenseeEmail?: string;
  lastCheck: Date;
  rawResponse?: {
    valid?: boolean;
    valid_until?: string; // e.g. "2026-12-31"
    end_time?: string; // Keyzy v2 field
    sku_name?: string;
    sku_number?: string;
  };
}

export interface ActivationResponse {
  success: boolean;
  message: string;
  data?: any;
}

class LicenseService {
  private baseUrl = "/license";

  // Check license status
  async checkStatus(): Promise<{ active: boolean; info?: LicenseInfo }> {
    try {
      const response = await axiosInstance.get(
        `${this.baseUrl}/status?_t=${new Date().getTime()}`,
      );
      // Backend returns { message: string, data: { active: boolean, license: LicenseInfo | null } }
      // Axios wraps this in 'data'
      const responseData = response.data as any;
      console.log("Full Response Data:", responseData);

      // Check if data is nested inside 'data' property
      const resultData = responseData.data || responseData;

      return {
        active: resultData.active,
        info: resultData.license,
      };
    } catch (error) {
      console.error("Critical: License Status Check FAILED:", error);
      return { active: false };
    }
  }

  // Activate license
  async activate(key: string): Promise<ActivationResponse> {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
      data: any;
    }>(`${this.baseUrl}/activate`, { key });
    return response.data;
  }

  // Remove license (optional, for debugging/admin)
  async remove(): Promise<ActivationResponse> {
    const response = await axiosInstance.post(`${this.baseUrl}/remove`);
    return response.data;
  }
}

export const licenseService = new LicenseService();
