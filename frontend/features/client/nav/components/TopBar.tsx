"use client";

import { Facebook, Youtube, Instagram, Twitter, Search, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/language/i18n/navigation";
import { useAuthModal } from "@/features/auth/shared/contexts/AuthModalContext";
import { useAuth } from "@/features/auth/shared/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import SearchOverlay from "./SearchOverlay";
import { useTranslations } from "next-intl";

const TopBar = () => {
  const { openModal } = useAuthModal();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tAuth = useTranslations("Auth");

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <div
      ref={containerRef}
      className="bg-white border-b border-naka-blue/10 py-1 relative z-30"
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Social Icons */}
        <div className="flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <a
            href="#"
            aria-label="Facebook"
            className="text-naka-blue hover:text-blue-600 transition-colors"
          >
            <Facebook size={17} />
          </a>
          <a
            href="#"
            aria-label="Youtube"
            className="text-naka-blue hover:text-red-500 transition-colors"
          >
            <Youtube size={19} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="text-naka-blue hover:text-pink-500 transition-colors"
          >
            <Instagram size={17} />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="text-naka-blue hover:text-blue-400 transition-colors"
          >
            <Twitter size={17} />
          </a>
        </div>

        {/* Right Side: Search, Language & Auth */}
        <div className="flex items-center gap-4 text-[11px] sm:text-xs font-medium text-naka-blue">
          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
            className={`p-1 rounded-full transition-colors flex items-center justify-center ${
              isSearchOpen ? "bg-naka-blue text-white" : "hover:bg-black/5"
            }`}
          >
            {isSearchOpen ? <X size={19} /> : <Search size={19} />}
          </button>

          <div className="opacity-70 hover:opacity-100 transition-opacity">
            <LanguageSwitcher />
          </div>

          <div className="h-3 w-px bg-naka-blue"></div>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Hover Group for User Info */}
              <div className="relative group z-50">
                <div className="flex items-center gap-2 cursor-pointer py-1">
                  {/* Avatar Circle */}
                  <div className="w-7 h-7 rounded-full bg-naka-blue text-white flex items-center justify-center font-bold text-xs shadow-sm border border-white">
                    {user.lastName?.[0] || user.firstName?.[0] || "U"}
                  </div>
                  <span className="text-naka-blue font-bold text-xs sm:text-sm hidden sm:block">
                    {tAuth("hello")}, {user.lastName || user.firstName}
                  </span>
                </div>

                {/* Dropdown Menu - Show on hover of "Xin chào" */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 hidden group-hover:block animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <div className="bg-white p-2 shadow-xl rounded-lg border border-gray-100 flex flex-col gap-1 relative before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:bg-white before:rotate-45 before:border-t before:border-l before:border-gray-100">
                    <div className="px-3 py-2 text-sm text-naka-blue border-b border-naka-blue/10 mb-1">
                      <div className="font-semibold text-gray-800 truncate">
                        {user.lastName} {user.firstName}
                      </div>
                      <div className="text-xs truncate opacity-70">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="w-full text-left px-3 py-2 text-sm font-medium text-naka-blue/70 hover:text-naka-blue hover:bg-black/5 rounded-md transition-colors flex items-center gap-2"
                    >
                      {tAuth("profile")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Separator inside auth block if needed, or just gap */}

              {/* Logout Button - Visible directly */}
              <button
                onClick={() => logout()}
                className="text-naka-blue hover:underline font-bold text-xs sm:text-sm uppercase"
              >
                {tAuth("logout")}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 transition-opacity duration-200 hover:text-gray-600">
              <button
                onClick={() => openModal("login")}
                className="hover:underline"
              >
                {tAuth("login")}
              </button>
              <span>/</span>
              <button
                onClick={() => openModal("register")}
                className="hover:underline"
              >
                {tAuth("register")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Panel - Absolute to TopBar */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default TopBar;
