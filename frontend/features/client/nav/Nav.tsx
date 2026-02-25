"use client";

import { useState, useRef, useEffect } from "react";
import NavigationMenu from "./components/NavigationMenu";
import TopBar from "./components/TopBar";
import MobileMenu from "./components/MobileMenu";

import { Category } from "@/features/client/category/types/category.types";

interface NavProps {
  initialCategories?: Category[];
}

const Nav = ({ initialCategories }: NavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`,
        );
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    // Initial delay for any font/logo loading
    const timer = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      clearTimeout(timer);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      ref={headerRef}
      className="w-full font-sans text-sm relative flex flex-col"
    >
      {/* 1. Top Bar: Social, Language, Auth */}
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* 3. Menu Bar */}
      <NavigationMenu
        onToggleMobileMenu={toggleMobileMenu}
        initialCategories={initialCategories}
      />

      {/* 4. Mobile Menu Sidebar */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Nav;
