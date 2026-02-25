import React, { useEffect, useState } from "react";
import BackupPanel from "./components/BackupPanel";
import RestorePanel from "./components/RestorePanel";
import LicenseActivation from "./components/LicenseActivation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { licenseService, LicenseInfo } from "./services/licenseService";

const BackupPage = () => {
  const [loading, setLoading] = useState(true);
  const [isLicenseActive, setIsLicenseActive] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<LicenseInfo | undefined>(
    undefined,
  );

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = async () => {
    setLoading(true);
    console.log("Checking license status...");
    const result = await licenseService.checkStatus();
    console.log("License Status Result:", result);
    setIsLicenseActive(result.active);
    setLicenseInfo(result.info);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isLicenseActive) {
    return (
      <div className="p-6 space-y-6 min-h-screen bg-gray-50/50 flex flex-col items-center justify-center">
        <LicenseActivation onSuccess={checkLicense} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50/50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
          <p className="text-gray-500 mt-1">
            Quản lý sao lưu và khôi phục dữ liệu hệ thống
          </p>
        </div>

        {isLicenseActive && licenseInfo?.rawResponse && (
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex flex-col items-end">
            <span className="text-xs text-blue-600 font-medium uppercase tracking-wider">
              License Active
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-gray-700">
                {licenseInfo.rawResponse.sku_number ||
                  licenseInfo.rawResponse.sku_name ||
                  "PRO LICENSE"}
              </span>
              {licenseInfo.rawResponse.valid_until ||
              licenseInfo.rawResponse.end_time ? (
                <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                  Hết hạn:{" "}
                  {licenseInfo.rawResponse.valid_until ||
                    licenseInfo.rawResponse.end_time}
                </span>
              ) : (
                <span className="text-xs text-green-600 bg-white px-2 py-0.5 rounded border border-green-200 font-medium">
                  LIFETIME
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li>
              Tính năng này yêu cầu quyền <b>Super Admin</b> và xác thực 2 lớp
              (Sudo Mode).
            </li>
            <li>
              Quá trình <b>Restore</b> sẽ <b>XÓA HOÀN TOÀN</b> dữ liệu hiện tại
              và thay thế bằng bản backup.
            </li>
            <li>
              Hãy chắc chắn bạn đã sao lưu dữ liệu hiện tại trước khi thực hiện
              khôi phục.
            </li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Backup */}
        <div className="h-full">
          <BackupPanel userEmail="admin@example.com" />
        </div>

        {/* Cột phải: Restore */}
        <div className="h-full">
          <RestorePanel userEmail="admin@example.com" />
        </div>
      </div>
    </div>
  );
};

export default BackupPage;
