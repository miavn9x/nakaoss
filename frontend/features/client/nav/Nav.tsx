"use client";

import { useState } from "react";
import NavigationMenu from "./components/NavigationMenu";
import TopBar from "./components/TopBar";
import MobileMenu from "./components/MobileMenu";

import { Category } from "@/features/client/category/types/category.types";

interface NavProps {
  banner?: React.ReactNode;
  initialCategories?: Category[];
}

const Nav = ({ banner, initialCategories }: NavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full font-sans text-sm relative flex flex-col">
      {/* 1. Top Bar: Social, Language, Auth */}
      <div className="hidden md:block">
        <TopBar />
      </div>

      {/* 2. Banner Image */}
      <div className="hidden md:block">{banner}</div>

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
    </div>
  );
};

export default Nav;
