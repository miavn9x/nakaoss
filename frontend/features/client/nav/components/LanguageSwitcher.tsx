"use client";

import { Globe } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "@/language/i18n/navigation";
import { useLocale } from "next-intl";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (locale: string) => {
    startTransition(() => {
      router.push(pathname as any, { locale });
    });
    setIsOpen(false);
  };

  const getTicker = (locale: string) => {
    switch (locale) {
      case "vi":
        return "VN";
      case "cn":
        return "CN";
      case "bo":
        return "BO";
      case "en":
        return "US";
      default:
        return locale.toUpperCase();
    }
  };

  return (
    <div className="relative group z-50">
      <div
        className="flex items-center justify-center gap-1 px-2 h-8 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
        onClick={toggleDropdown}
      >
        <Globe className="w-5 h-5 text-[#7a1e1e]" strokeWidth={1.5} />
        <span className="text-xs font-bold text-[#7a1e1e]">
          {getTicker(currentLocale)}
        </span>
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 hidden group-hover:block hover:block animate-in fade-in slide-in-from-top-1 duration-200">
        <div className="bg-[#fdfce8] p-1 shadow-xl rounded-lg border border-[#fdfce8] flex flex-col relative before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:bg-[#fdfce8] before:rotate-45 before:border-t before:border-l before:border-[#fdfce8]">
          {/* Vietnamese */}
          <button
            onClick={() => changeLanguage("vi")}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold rounded-md transition-colors ${
              currentLocale === "vi"
                ? "text-[#7a1e1e] bg-black/5"
                : "text-[#7a1e1e]/70 hover:text-[#7a1e1e] hover:bg-black/5"
            }`}
          >
            <span className="font-mono text-xs opacity-70">VN</span> Tiếng Việt
          </button>

          {/* Chinese */}
          <button
            onClick={() => changeLanguage("cn")}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold rounded-md transition-colors ${
              currentLocale === "cn"
                ? "text-[#7a1e1e] bg-black/5"
                : "text-[#7a1e1e]/70 hover:text-[#7a1e1e] hover:bg-black/5"
            }`}
          >
            <span className="font-mono text-xs opacity-70">CN</span> 中文
          </button>

          {/* Tibetan (Bodhi) */}
          <button
            onClick={() => changeLanguage("bo")}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold rounded-md transition-colors ${
              currentLocale === "bo"
                ? "text-[#7a1e1e] bg-black/5"
                : "text-[#7a1e1e]/70 hover:text-[#7a1e1e] hover:bg-black/5"
            }`}
          >
            <span className="font-mono text-xs opacity-70">BO</span> བོད་ཡིག
          </button>

          {/* English */}
          <button
            onClick={() => changeLanguage("en")}
            className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-bold rounded-md transition-colors ${
              currentLocale === "en"
                ? "text-[#7a1e1e] bg-black/5"
                : "text-[#7a1e1e]/70 hover:text-[#7a1e1e] hover:bg-black/5"
            }`}
          >
            <span className="font-mono text-xs opacity-70">US</span> English
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
