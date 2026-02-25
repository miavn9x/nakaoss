"use client";

import { useAuth } from "@/features/auth/shared/contexts/AuthContext";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { EditProfileModal } from "./EditProfileModal";
import { getImageUrl } from "@/shared/lib/image";
import { UserPostList } from "./UserPostList";

export const UserProfile = () => {
  const { user, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const tProfile = useTranslations("Profile");
  const tAuth = useTranslations("Auth");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFD400]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            {/* Header / Cover */}
            <div className="h-24 bg-linear-to-r from-[#103E8F] to-[#0066cc]"></div>

            <div className="px-6 pb-6 -mt-10">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md mb-3">
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-3xl font-bold border border-gray-200 overflow-hidden relative">
                    {user.avatar ? (
                      <img
                        src={getImageUrl(user?.avatar, "/img/logow.jpeg")}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.firstName?.charAt(0) || "U"}</span>
                    )}
                  </div>
                </div>

                <h1 className="text-xl font-bold text-gray-800 text-center">
                  {user.lastName} {user.firstName}
                </h1>
                <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                <div className="w-full flex gap-2 justify-center mb-6">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex-1 py-2 px-4 bg-[#FFD400]/10 text-[#806a00] hover:bg-[#FFD400]/20 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    {tProfile("edit_profile")}
                  </button>
                </div>

                <div className="w-full space-y-3 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-[#103E8F]" />
                    <span className="text-gray-500 flex-1">
                      {tProfile("role_label")}
                    </span>
                    <div className="flex gap-1">
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 bg-blue-50 text-[#103E8F] text-xs font-bold rounded-sm uppercase"
                        >
                          {role === "user"
                            ? tProfile("roles.user")
                            : role === "admin"
                              ? tProfile("roles.admin")
                              : role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 flex-1">
                      {tAuth("phoneNumber")}
                    </span>
                    <span
                      className={`font-medium ${user.phoneNumber ? "text-gray-800" : "text-gray-400 italic"}`}
                    >
                      {user.phoneNumber || tProfile("not_updated")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 flex-1">
                      {tAuth("address")}
                    </span>
                    <span
                      className={`font-medium ${user.address ? "text-gray-800" : "text-gray-400 italic"} truncate max-w-[120px]`}
                    >
                      {user.address || tProfile("not_updated")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Marked Posts / Member Only Content */}
          <UserPostList />

          {/* Future sections (e.g. My Comments, History) can go here */}
        </div>
      </div>

      {user && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={user}
          onUpdateSuccess={(updatedUser) => {
            refreshProfile();
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
