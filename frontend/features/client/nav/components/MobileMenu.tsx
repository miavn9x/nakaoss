"use client";

import React from "react";

import {
  X,
  Phone,
  Mail,
  User,
  LogIn,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  MapPin,
  Globe,
} from "lucide-react";
import { Link, useRouter, usePathname } from "@/language/i18n/navigation";
import { useAuthModal } from "@/features/auth/shared/contexts/AuthModalContext";
import { useAuth } from "@/features/auth/shared/contexts/AuthContext";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { openModal } = useAuthModal();
  const { user, logout } = useAuth();

  const t = useTranslations("Navigation");
  const tAuth = useTranslations("Auth");

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLanguage = (locale: string) => {
    router.replace(pathname as any, { locale });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      {/* Sidebar Wrapper with Flex to position Close button outside */}
      <div className="fixed inset-y-0 left-0 z-51 flex h-full pointer-events-none">
        {/* Main Sidebar Content */}
        <div className="h-full w-[80vw] max-w-75 bg-white shadow-2xl overflow-y-auto flex flex-col pointer-events-auto animate-in slide-in-from-left duration-300 relative">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 flex items-end justify-center pb-20 opacity-60 pointer-events-none">
            <div className="w-4/5 relative aspect-square">
              <Image
                src="/bg/ico_quote_home.png"
                alt="Background Pattern"
                fill
                sizes="(max-width: 768px) 320px, 400px"
                className="object-contain"
              />
            </div>
          </div>
          {/* Header */}
          <div className="p-5 flex items-center justify-center border-b border-gray-100">
            {/* Language Switcher */}
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-400">
              <div className="mr-2 text-gray-700">
                <Globe size={16} />
              </div>
              <button
                onClick={() => changeLanguage("vi")}
                className={`hover:text-[#7a1e1e] transition-colors ${
                  currentLocale === "vi" ? "text-[#7a1e1e]" : ""
                }`}
              >
                VN
              </button>
              <span className="w-px h-3 bg-gray-300"></span>
              <button
                onClick={() => changeLanguage("en")}
                className={`hover:text-[#7a1e1e] transition-colors ${
                  currentLocale === "en" ? "text-[#7a1e1e]" : ""
                }`}
              >
                EN
              </button>
              <span className="w-px h-3 bg-gray-300"></span>
              <button
                onClick={() => changeLanguage("cn")}
                className={`hover:text-[#7a1e1e] transition-colors ${
                  currentLocale === "cn" ? "text-[#7a1e1e]" : ""
                }`}
              >
                CN
              </button>
              <span className="w-px h-3 bg-gray-300"></span>
              <button
                onClick={() => changeLanguage("bo")}
                className={`hover:text-[#7a1e1e] transition-colors ${
                  currentLocale === "bo" ? "text-[#7a1e1e]" : ""
                }`}
              >
                BO
              </button>
            </div>
          </div>

          {/* Menu List */}
          <div className="flex-1 px-5 flex flex-col">
            <div className="flex flex-col">
              {[
                { label: t("home"), href: "/" },
                // {
                //   label: t("tue_quang_library"),
                //   href: "/tue-quang",
                //   hasSub: true,
                // },
                // {
                //   label: t("longchen_lineage"),
                //   href: "/longchen",
                //   hasSub: true,
                // },
                // { label: t("about"), href: "/about" },
                { label: t("schedule"), href: "/schedule" },
                { label: t("contact"), href: "/contact" },
                { label: t("support_us"), href: "/support-us" },
              ].map(
                (item: { label: string; href: string; hasSub?: boolean }) => (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    onClick={onClose}
                    className="group border-b border-gray-100 py-4 flex items-center justify-between"
                  >
                    <span className="text-gray-800 font-bold text-sm uppercase group-hover:text-[#7a1e1e] transition-colors">
                      {item.label}
                    </span>
                    {item.hasSub && (
                      <span className="text-gray-400 text-lg font-light group-hover:text-[#7a1e1e]">
                        +
                      </span>
                    )}
                  </Link>
                ),
              )}
            </div>

            {/* Auth Section - Minimalist */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#7a1e1e] text-[#fdfce8] flex items-center justify-center font-bold text-sm">
                      {user.lastName?.[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">
                        {user.lastName} {user.firstName}
                      </div>
                      <div className="text-xs text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="text-sm text-gray-700 hover:text-[#7a1e1e] py-1"
                  >
                    {tAuth("profile")}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-[#7a1e1e] py-1 text-left"
                  >
                    {tAuth("logout")}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      openModal("login");
                      onClose();
                    }}
                    className="text-left text-sm font-bold text-gray-800 hover:text-[#7a1e1e] uppercase tracking-wide"
                  >
                    {tAuth("login")}
                  </button>
                  <button
                    onClick={() => {
                      openModal("register");
                      onClose();
                    }}
                    className="text-left text-sm font-bold text-gray-800 hover:text-[#800000] uppercase tracking-wide"
                  >
                    {tAuth("register")}
                  </button>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="mt-auto py-8 flex items-center gap-6 text-gray-400">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-[#7a1e1e] transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-[#800000] transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="hover:text-[#800000] transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-[#800000] transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>{" "}
        {/* End of Main Sidebar Content */}
        {/* Close Button Outside */}
        <div className="pointer-events-auto animate-in fade-in duration-500 delay-100 pt-10">
          <button
            onClick={onClose}
            className="group flex items-center justify-center bg-white p-2 shadow-lg hover:bg-gray-50 transition-colors"
            title="Đóng menu"
          >
            <div className="rounded-full border border-black p-0.5">
              <X size={20} strokeWidth={1.5} className="text-black" />
            </div>
          </button>
        </div>
      </div>{" "}
      {/* End of Wrapper */}
    </>
  );
};

export default MobileMenu;
