"use client";

import { useEffect, useState } from "react";
import { User } from "@/features/auth/shared/contexts/AuthContext";
import { userService } from "../services/user.service";
import { toast } from "react-toastify";
import { X, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/shared/lib/image";
import { useTranslations } from "next-intl";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateSuccess: (updatedUser: User) => void;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}: EditProfileModalProps) => {
  const tProfile = useTranslations("Profile");
  const tAuth = useTranslations("Auth");
  const tCommon = useTranslations("Common");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phoneNumber: currentUser.phoneNumber || "",
        address: currentUser.address || "",
      });
      setPreviewAvatar(currentUser.avatar || null);
      setAvatarFile(null);
    }
  }, [isOpen, currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        toast.error(tProfile("errors.max_file_size"));
        return;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(tProfile("errors.invalid_image_type"));
        return;
      }

      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = currentUser.avatar;

      if (avatarFile) {
        avatarUrl = await userService.uploadAvatar(avatarFile);
      }

      const updatedUser = await userService.updateProfile({
        ...formData,
        avatar: avatarUrl,
      });

      toast.success(tProfile("success_message"));
      onUpdateSuccess(updatedUser);
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || tProfile("error_message"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {tProfile("edit_profile")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title={tCommon("close")}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#FFD400] relative bg-gray-100">
                {previewAvatar ? (
                  <Image
                    src={
                      previewAvatar && previewAvatar.startsWith("blob:")
                        ? previewAvatar
                        : getImageUrl(previewAvatar, "/img/logow.jpeg")
                    }
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                    {formData.lastName?.[0] || "U"}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
              >
                <Camera size={24} />
              </label>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                title={tProfile("click_to_change_avatar")}
              />
            </div>
            <p className="text-sm text-gray-500">
              {tProfile("click_to_change_avatar")}
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="lastName"
              >
                {tAuth("lastName")}
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD400] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="firstName"
              >
                {tAuth("firstName")}
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD400] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="phoneNumber"
            >
              {tAuth("phoneNumber")}
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD400] focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="address"
            >
              {tAuth("address")}
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FFD400] focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              {tCommon("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-bold text-[#103E8F] bg-[#FFD400] hover:bg-[#FFC400] rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-1 focus:ring-[#FFD400] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {tProfile("save_changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
