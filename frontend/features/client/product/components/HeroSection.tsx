import React from "react";

export default function HeroSection() {
  return (
    <>
      <div className="text-center mb-20 relative">
        <div className="flex justify-center mb-6">
          <div className="text--naka-blue">
            <svg
              fill="currentColor"
              height="56"
              viewBox="0 0 24 24"
              width="56"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 22H22L12 2ZM12 6L18 18H6L12 6Z"></path>
            </svg>
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text--naka-blue mb-5 uppercase tracking-wide leading-tight">
          Hệ Sinh Thái Sản Phẩm Nakao
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-16 bg--naka-blue opacity-60"></div>
          <h2 className="text-lg md:text-xl text-gray-500 font-light tracking-wide">
            Giải pháp linh kiện kiến trúc kỹ thuật cao - Hình ảnh chuẩn xác 100%
          </h2>
          <div className="h-px w-16 bg--naka-blue opacity-60"></div>
        </div>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <div className="group relative h-[500px] overflow-hidden rounded-[8px] cursor-pointer shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] transition-all duration-500">
          <img
            alt="Hệ cửa lùa kính khung nhôm cao cấp"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5kFb8XY8C4ZK3ex66A5-wV-gbEfEK2sG6gKjrxVkHARwfgExhjOKiTTG2tr7a8ccLMv6xLPomUowxC4G5L83SkxKJRM7xXD1xXNlSmvxDQVywiHckW_gsgNYQmQtNP8GIUyD7nSHLaAJTGF4uwTkwoBgbm1QM9n8OhC14wxSvew7j4JbP7Y-3Qy4oOPxYpoAzu0CT4JcrRBCREGf9ehXSxptMJ9-v82_C2q_1YzyOlROhHMnrVLMpMKHMehsI_EvENsDBLPm1Iwto"
          />
          <div className="absolute inset-0 hero-card-overlay opacity-90 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-serif text-3xl text-white mb-2">
              Phụ kiện
              <br />
              Cửa trượt
            </h3>
            <p className="text-white/80 text-sm font-light mb-4">
              High-end Glass Sliding Systems
            </p>
            <div className="w-12 h-[2px] bg-white mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
        <div className="group relative h-[500px] overflow-hidden rounded-[8px] cursor-pointer shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] transition-all duration-500">
          <img
            alt="Hệ cửa Orido xếp gọn sang trọng thực tế"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA04xIAoys67ue3atHb2RRkSYS-2UVH0RB24cc57TSq-S-iDsaBnkOtqnp05Ev6SZpT1wbEsg0t-iqnz0veHP35LmrUKgqpCREMII6WBlZDu7DPlnJTJnRGTqYFbjZPdiJVsINJwVKIr7ESuUfKGwrz4G692wL_-qnsBHgd2z4CAaERGdndctfnQgXKZDXlTbIuf9Qs9zsfDj3M2TxacDcKQdhTp59ZaqXl-Z26XPWNtktFbqhHNgXzTj-MSQFp44uZ2HmqqZenAp4f"
          />
          <div className="absolute inset-0 hero-card-overlay opacity-90 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-serif text-3xl text-white mb-2">
              Phụ kiện
              <br />
              Cửa xếp - Gấp
            </h3>
            <p className="text-white/80 text-sm font-light mb-4">
              Folding Door Systems (Orido)
            </p>
            <div className="w-12 h-[2px] bg-white mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
        <div className="group relative h-[500px] overflow-hidden rounded-[8px] cursor-pointer shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] transition-all duration-500">
          <img
            alt="Cửa gỗ hiện đại sử dụng bản lề âm cao cấp"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk6ldgM6jPzSa-mQg49LAFoNvc5j9SlPPN7phyOkVDpgMW2w6GQzP7iiVG9iAAW-ckzK0SR0jrQSKBBMV_SpNEXrk9Cw88odpPN_1FhL3eRnbyc0TP6CG11c-le8loBZ8DDYcnuKNinssesdj0hy-StyOXTzTWWZf9GQkQfuHMEopURaK50vgc8aMImogQGEaYFkcTFcxfs7lyalqFGe15mIg1j-pLjAoA3t9_k-PZz74b8M4qSwF0hsMIzwVOuk2b_daQvVoC4kCP"
          />
          <div className="absolute inset-0 hero-card-overlay opacity-90 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-serif text-3xl text-white mb-2">
              Phụ kiện
              <br />
              Cửa gỗ
            </h3>
            <p className="text-white/80 text-sm font-light mb-4">
              Concealed Hinge Systems
            </p>
            <div className="w-12 h-[2px] bg-white mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </section>
    </>
  );
}
