"use client";

import { Search, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { useTranslations, useLocale } from "next-intl";
import { API_URL } from "@/shared/config/api.config";
import { PostClientListItem, getPostLink } from "../../post/types/post.types";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<PostClientListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Search");
  const locale = useLocale();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${API_URL}/client/posts?search=${encodeURIComponent(searchTerm)}&limit=5`,
          );
          const json = await response.json();
          if (json.data && json.data.items) {
            setResults(json.data.items);
          }
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navigate to full search page or first result
      console.log("Searching for:", searchTerm);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-xl z-40 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Search Input */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <div className="flex items-center bg-gray-50 rounded-full border border-[#7a1e1e] focus-within:bg-white transition-all p-1.5 pl-5">
                <Search className="text-[#7a1e1e] w-5 h-5 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t("placeholder")}
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSearch}
                  aria-label="Submit search"
                  className="w-10 h-10 flex items-center justify-center bg-[#7a1e1e] text-white rounded-full hover:bg-[#5e1717] transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Suggestions or Results */}
          {!searchTerm ? (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {/* <span className="font-medium uppercase text-xs tracking-wider opacity-70">
                {t("suggestions")}:
              </span> */}
              {/* <div className="flex flex-wrap gap-2">
                {["sutra", "statue", "mala", "incense"].map((tagKey) => (
                  <button
                    key={tagKey}
                    onClick={() => setSearchTerm(t(`tags.${tagKey}`))}
                    className="hover:text-[#7a1e1e] hover:underline transition-colors capitalize"
                  >
                    {t(`tags.${tagKey}`)}
                  </button>
                ))}
              </div> */}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {isLoading ? t("searching") : t("results")} ({results.length})
                </h3>
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-[#7a1e1e] animate-spin" />
                )}
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((post) => {
                    const detail =
                      post.details.find((d) => d.lang === locale) ||
                      post.details[0];
                    const postLink = getPostLink(post, locale);
                    const finalLink =
                      locale === "vi" ? postLink : `/${locale}${postLink}`;

                    return (
                      <Link
                        key={post.code}
                        href={finalLink}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <Image
                            src={post.cover?.url || "/img/placeholder.png"}
                            alt={detail.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#7a1e1e] transition-colors">
                            {detail.title}
                          </h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                !isLoading && (
                  <p className="text-sm text-gray-500 py-4 italic">
                    {t("noResults")}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
