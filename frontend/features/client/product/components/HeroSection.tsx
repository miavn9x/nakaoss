import React from "react";

export default function HeroSection() {
  return (
    <>
      <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden product-hero-bg mb-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10 reveal-on-scroll">
          <div className="flex justify-center mb-6">
            <div className="text-white">
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
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-serif font-black mb-5 tracking-tight uppercase">
            Hệ Sinh Thái Sản Phẩm Nakao
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-white opacity-60 hidden md:block"></div>
            <p className="text-slate-200 text-lg sm:text-xl font-display font-light max-w-2xl mx-auto leading-relaxed tracking-wide">
              Giải pháp các sản phẩm cần thiết để lắp đặt{" "}
              <strong className="text-white font-medium">cửa trượt</strong>,{" "}
              <strong className="text-white font-medium">cửa xếp</strong> và{" "}
              <strong className="text-white font-medium">cửa bản lề</strong>{" "}
              theo từng kiểu cửa{" "}
              <strong className="text-white font-bold tracking-wider">
                Nakao Nhật Bản
              </strong>
            </p>
            <div className="h-px w-16 bg-white opacity-60 hidden md:block"></div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-32">
        <section className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 mb-24">
          <div className="group relative aspect-3/4 w-full overflow-hidden rounded-l-[20px] cursor-pointer shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] transition-all duration-500">
            <img
              alt="Hệ cửa lùa kính khung nhôm cao cấp"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/img/01_img01.jpg"
            />
            <div className="absolute inset-0 hero-card-overlay opacity-90 transition-opacity"></div>

            {/* Interactive Hover Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-75 group-hover:scale-100">
              <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center">
                <svg
                  className="text-white w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-serif text-[10px] min-[400px]:text-base sm:text-2xl lg:text-3xl text-white mb-2 font-bold hover:text-white leading-tight sm:leading-snug">
                <span className="inline-block">Sản phẩm</span>{" "}
                <span className="inline-block whitespace-nowrap">
                  cửa trượt
                </span>
              </h3>
              <div className="w-8 sm:w-12 h-[2px] bg-white mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="group relative aspect-3/4 w-full overflow-hidden rounded-none cursor-pointer shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] transition-all duration-500">
            <img
              alt="Hệ cửa Orido xếp gọn sang trọng thực tế"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/img/01_img02.jpg"
            />
            <div className="absolute inset-0 hero-card-overlay opacity-90 transition-opacity"></div>

            {/* Interactive Hover Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-75 group-hover:scale-100">
              <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center">
                <svg
                  className="text-white w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-serif text-[10px] min-[400px]:text-base sm:text-2xl lg:text-3xl text-white mb-2 font-bold hover:text-white leading-tight sm:leading-snug">
                <span className="inline-block">Sản phẩm</span>{" "}
                <span className="inline-block whitespace-nowrap">cửa xếp</span>
              </h3>
              <div className="w-8 sm:w-12 h-[2px] bg-white mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="group relative aspect-3/4 w-full overflow-hidden rounded-r-[20px] cursor-pointer shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] transition-all duration-500">
            <img
              alt="Cửa gỗ hiện đại sử dụng bản lề âm cao cấp"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/img/01_img03.jpg"
            />
            <div className="absolute inset-0 hero-card-overlay opacity-90 transition-opacity"></div>

            {/* Interactive Hover Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 transform scale-75 group-hover:scale-100">
              <div className="w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center">
                <svg
                  className="text-white w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 md:p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-serif text-[10px] min-[400px]:text-base sm:text-2xl lg:text-3xl text-white mb-2 font-bold hover:text-white leading-tight sm:leading-snug">
                <span className="inline-block">Sản phẩm</span>{" "}
                <span className="inline-block whitespace-nowrap">mở cửa</span>
              </h3>
              <div className="w-8 sm:w-12 h-[2px] bg-white mx-auto opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
