"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 200) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-32 right-6 z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <button
        onClick={scrollToTop}
        className="p-3 rounded bg-[#d6b981] text-white shadow-lg hover:bg-[#c91918] transition-transform duration-300 transform hover:scale-110 focus:outline-none flex items-center justify-center border border-[#800000]/20 hover:border-[#800000]/40"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default BackToTop;
