"use client";

import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (role: string) => void;
  currentRole: string;
  isLoading: boolean;
}

export default function EditRoleModal({
  isOpen,
  onClose,
  onConfirm,
  currentRole,
  isLoading,
}: EditRoleModalProps) {
  const t = useTranslations("EditRoleModal");
  const [selectedRole, setSelectedRole] = useState(currentRole);

  if (!isOpen) return null;

  const roles = [
    {
      value: "user",
      label: t("roles.user.label"),
      description: t("roles.user.description"),
    },
    {
      value: "admin",
      label: t("roles.admin.label"),
      description: t("roles.admin.description"),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            {t("title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {roles.map((role) => (
            <div
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === role.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{role.label}</span>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === role.value
                      ? "border-blue-600"
                      : "border-gray-400"
                  }`}
                >
                  {selectedRole === role.value && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{role.description}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 text-right space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => onConfirm(selectedRole)}
            disabled={isLoading || selectedRole === currentRole}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("processing") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
