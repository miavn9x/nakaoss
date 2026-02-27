"use client";

import React, { useState } from "react";

const CATEGORIES = [
  { id: "truot", name: "Cửa trượt" },
  { id: "orido", name: "Orido" },
  { id: "mo", name: "Mở cửa" },
  { id: "khac", name: "Khác" },
];

const SLIDING_DOOR_PRODUCTS = [
  { name: "Đóng cửa nhẹ nhàng", img: "/img/cua-truot/1.png" },
  { name: "Con lăn cửa trượt treo trên", img: "/img/cua-truot/2.png" },
  {
    name: "Ray trượt cửa",
    img: "/img/cua-truot/3.png",
    highlight: true,
    series: "Series K-150",
    subName: "Hệ Ray Anodized",
  },
  { name: "Các bộ phận cửa trượt", img: "/img/cua-truot/4.png" },
  { name: "Tay cầm lõm", img: "/img/cua-truot/5.png" },
];

export default function CategorySection() {
  const [activeCategory, setActiveCategory] = useState("truot");

  return (
    <section className="mb-6 px-4">
      <div className="text-center mb-4">
        <h2 className="font-serif text-3xl font-bold text-naka-blue mb-10 tracking-[0.2em] uppercase">
          Danh Mục Sản Phẩm
        </h2>
        <div className="flex flex-wrap justify-center gap-4 border-b border-gray-400 pb-1 max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-4 font-display transition-all duration-300 text-sm tracking-[0.2em] uppercase border-b-2 ${
                activeCategory === cat.id
                  ? "text-naka-blue font-bold border-naka-blue"
                  : "text-slate-500 font-medium border-transparent hover:text-naka-blue hover:border-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {activeCategory === "truot" &&
            SLIDING_DOOR_PRODUCTS.map((product, index) => (
              <div
                key={index}
                className="group bg-white rounded-[6px] p-0 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 hover:bg-naka-blue hover:text-white hover:border-naka-blue hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-naka-blue hover:ring-offset-2 transition-all duration-300 flex flex-col items-center cursor-pointer 
                           w-[calc(25%-8px)] sm:w-[calc(16.66%-12px)] lg:w-[calc(10%-12px)] min-w-[80px] lg:min-w-[110px] overflow-hidden"
              >
                <div className="w-full aspect-square bg-white flex items-center justify-center p-0 overflow-hidden">
                  <img
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform group-hover:scale-110"
                    src={product.img}
                  />
                </div>
                <div className="w-full p-2 pb-3 flex items-start justify-center min-h-[44px]">
                  <span className="text-[10px] font-bold font-display text-center transition-colors uppercase tracking-tight text-slate-700 group-hover:text-white line-clamp-2">
                    {product.highlight ? product.subName : product.name}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
