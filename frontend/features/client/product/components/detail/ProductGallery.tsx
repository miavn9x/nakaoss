"use client";

import React, { useState } from "react";
import { galleryImages } from "./productData";

export default function ProductGallery() {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image — object-contain để không bị cắt ảnh sản phẩm */}
      <div className="w-full aspect-video bg-white rounded-xl overflow-hidden border border-slate-200 relative shadow-sm">
        <img
          src={galleryImages[activeImage].src}
          alt={galleryImages[activeImage].alt}
          className="absolute inset-0 w-full h-full object-contain transition-all duration-500 p-4"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {galleryImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            aria-label={`Xem ảnh: ${img.alt}`}
            title={img.alt}
            className={`aspect-square bg-white rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
              activeImage === i
                ? "border-naka-blue shadow-md"
                : "border-slate-200 hover:border-naka-blue/40"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-contain p-2"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
