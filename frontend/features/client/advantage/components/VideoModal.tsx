"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl,
}: VideoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  // Function to handle YouTube/Vimeo URLs and convert to embed format if necessary
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // Regular YouTube links
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = match && match[2].length === 11 ? match[2] : null;

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      }
    }
    return url;
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-7xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <iframe
          src={getEmbedUrl(videoUrl)}
          title="Video Player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>,
    document.body,
  );
}
