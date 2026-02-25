"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  User as UserIcon,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Edit2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getImageUrl } from "@/shared/lib/image";
import { useUsers } from "./hooks/useUsers";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import CopyButton from "@/shared/components/CopyButton";
import EditRoleModal from "./EditRoleModal";
import { User } from "./types/user.types";
import { userService } from "./services/userService";
import { toast } from "react-toastify";

export default function UserList() {
  const t = useTranslations("Users");
  const tContent = useTranslations("Content");
  const tCommon = useTranslations("AdminCommon");
  const format = useFormatter();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    users,
    pagination,
    isLoading,
    isPlaceholderData,
    isFetching,
    refreshUsers,
    page,
    setPage,
    limit,
  } = useUsers();

  // --- Modal State ---
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshUsers(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleRefresh = async () => {
    await refreshUsers();
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmRole = async (newRole: string) => {
    if (!selectedUser) return;
    try {
      setIsUpdating(true);
      await userService.promoteUser(selectedUser._id, newRole);

      toast.success(
        "Đã gửi yêu cầu thay đổi quyền (Vui lòng kiểm tra email verify)",
      );
      setIsModalOpen(false);
      await refreshUsers(searchTerm);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm border p-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {t("title")}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {pagination
                  ? t("subtitle", { count: pagination.total })
                  : t("subtitle", { count: users.length })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
                {t("refresh")}
              </button>
            </div>
          </div>
        </div>

        {/* Search & List */}
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t("noUsersFound")}
            </div>
          ) : (
            <>
              <div
                className={`overflow-x-auto hidden md:block transition-opacity duration-200 ${
                  isPlaceholderData || isFetching ? "opacity-50" : "opacity-100"
                }`}
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("list.user")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("list.contact")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("list.role")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("list.joinedDate")}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {tCommon("action")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10 relative">
                              {user.avatar ? (
                                <Image
                                  src={getImageUrl(user.avatar)}
                                  alt=""
                                  fill
                                  className="rounded-full object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.lastName} {user.firstName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {t("list.id")}: {user._id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap min-w-[250px]">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-sm text-gray-900 group">
                              <div className="flex items-center overflow-hidden">
                                <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </div>
                              <CopyButton text={user.email} />
                            </div>
                            {user.phoneNumber && (
                              <div className="flex items-center justify-between text-sm text-gray-500 group">
                                <div className="flex items-center overflow-hidden">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                                  <span>{user.phoneNumber}</span>
                                </div>
                                <CopyButton text={user.phoneNumber} />
                              </div>
                            )}
                            {user.address && (
                              <div className="flex items-center justify-between text-sm text-gray-500 group">
                                <div className="flex items-center overflow-hidden">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                                  <span
                                    className="truncate max-w-[150px]"
                                    title={user.address}
                                  >
                                    {user.address}
                                  </span>
                                </div>
                                <CopyButton text={user.address} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role) => (
                                <span
                                  key={role}
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {t(`roles.${role}`)}
                                </span>
                              ))}
                            </div>
                            {user.pendingRole &&
                              user.roleChangeExpires &&
                              new Date(user.roleChangeExpires) > new Date() && (
                                <span className="px-2 inline-flex text-[10px] leading-4 font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 w-fit">
                                  {tCommon("pending")}:{" "}
                                  {t(`roles.${user.pendingRole}`)}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {format.dateTime(new Date(user.createdAt), {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditRole(user)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa quyền"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Card Layout */}
              <div
                className={`md:hidden space-y-4 transition-opacity duration-200 ${
                  isPlaceholderData || isFetching ? "opacity-50" : "opacity-100"
                }`}
              >
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white p-4 rounded-lg border shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0 h-12 w-12 relative">
                          {user.avatar ? (
                            <Image
                              src={getImageUrl(user.avatar)}
                              alt=""
                              fill
                              className="rounded-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.lastName} {user.firstName}
                          </div>
                          <div className="flex flex-col gap-1 mt-1">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role) => (
                                <span
                                  key={role}
                                  className={`px-2 inline-flex text-[10px] leading-4 font-semibold rounded-full ${
                                    role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {t(`roles.${role}`)}
                                </span>
                              ))}
                            </div>
                            {user.pendingRole &&
                              user.roleChangeExpires &&
                              new Date(user.roleChangeExpires) > new Date() && (
                                <span className="px-2 inline-flex text-[10px] leading-4 font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 w-fit">
                                  Pending: {t(`roles.${user.pendingRole}`)}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditRole(user)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 group">
                        <div className="flex items-center overflow-hidden">
                          <Mail className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <CopyButton text={user.email} />
                      </div>

                      {user.phoneNumber && (
                        <div className="flex items-center justify-between text-sm text-gray-600 group">
                          <div className="flex items-center overflow-hidden">
                            <Phone className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                            <span>{user.phoneNumber}</span>
                          </div>
                          <CopyButton text={user.phoneNumber} />
                        </div>
                      )}

                      {user.address && (
                        <div className="flex items-center justify-between text-sm text-gray-600 group">
                          <div className="flex items-center overflow-hidden">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                            <span className="truncate">{user.address}</span>
                          </div>
                          <CopyButton text={user.address} />
                        </div>
                      )}

                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        {format.dateTime(new Date(user.createdAt), {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.total > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-between sticky bottom-0 z-10">
              <div className="text-sm text-gray-500">
                {tContent("showing")}{" "}
                <span className="font-medium text-gray-900">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                {tContent("to")}{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}
                </span>{" "}
                {tContent("outOf")}{" "}
                <span className="font-medium text-gray-900">
                  {pagination.total}
                </span>{" "}
                {tCommon("results")}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={tContent("previousPage")}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                  {tContent("pageOfTotal", {
                    page: pagination.page,
                    total: Math.ceil(pagination.total / pagination.limit),
                  })}
                </div>
                <button
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={
                    pagination.page >=
                    Math.ceil(pagination.total / pagination.limit)
                  }
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={tContent("nextPage")}
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Edit Role Modal */}
          {selectedUser && (
            <EditRoleModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleConfirmRole}
              currentRole={selectedUser.roles[0] || "user"}
              isLoading={isUpdating}
            />
          )}
        </div>
      </div>
    </div>
  );
}
