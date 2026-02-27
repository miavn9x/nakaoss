"use client";

import React, { useState } from "react";
import { galleryImages } from "./productData";

export default function ProductGallery() {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
        <img
          src={galleryImages[activeImage].src}
          alt={galleryImages[activeImage].alt}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-medium text-slate-700 shadow-sm">
          Main View
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {galleryImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            aria-label={`Xem ảnh: ${img.alt}`}
            title={img.alt}
            className={`aspect-square bg-slate-100 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${
              activeImage === i
                ? "border-blue-600"
                : "border-slate-200 hover:border-blue-300"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
