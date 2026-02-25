"use client";

import React from "react";
import Image from "next/image";

export default function GlobalVisionSection() {
  return (
    <section className="relative py-12 bg-white border-b border-naka-blue/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-4/3 bg-slate-100 overflow-hidden relative group">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRdbJnrLfTAeBN0DtemIvNY8dkI2Q7z0_jRdkp6FTwNoYX0YorDypHcxYeGLP5Pkb0fk4m6Q3LRuDcd-VHTe7NLpAooVCNKqyKjxaOChlK08txD74Jty2mIQcxP3O_53zLDky9t79iZD4-jLl-N73BdB4CDFjiXDM-jOnbVKYGmEPf9X8ykVRfQDqM4-VGnsnenoVvNcGdyY-zBjfYL-lUfe2Y1gzwzInVf5Q8BU6ZSnfjrUv9-eq9a5o8E2tgyK90kEp2A6NGon_t"
              alt="Dây chuyền sản xuất nhà máy"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-naka-blue/10 mix-blend-multiply"></div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#fbfbf9] border border-naka-blue/10 p-6 hidden md:flex flex-col justify-center items-center shadow-lg">
            <span className="text-4xl font-['Playfair_Display',serif] text-naka-blue mb-2 text-center">
              1991
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500 text-center">
              Cột mốc Quốc tế
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-naka-blue text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
            Tầm nhìn Quốc tế
          </span>
          <h2 className="text-3xl md:text-4xl font-['Playfair_Display',serif] text-slate-800 mb-6">
            Mở rộng Nhà máy tại Trung Quốc
          </h2>
          <p className="text-slate-600 font-light leading-relaxed mb-6 text-justify">
            Năm 1991 đánh dấu một cột mốc quan trọng trong lịch sử công ty với
            việc thành lập nhà máy tại Trung Quốc. Đây là bước đi chiến lược
            nhằm mở rộng năng lực sản xuất, đáp ứng nhu cầu ngày càng cao của
            thị trường quốc tế về phụ kiện cửa chất lượng cao.
          </p>
          <p className="text-slate-600 font-light leading-relaxed text-justify">
            Dưới sự giám sát trực tiếp và nghiêm ngặt của các kỹ sư Nhật Bản,
            nhà máy mới vẫn duy trì nguyên vẹn các tiêu chuẩn chất lượng khắt
            khe của Nakao Seisakusho, đảm bảo tính đồng nhất trên toàn cầu dù
            sản phẩm được sản xuất ở bất kỳ đâu.
          </p>
        </div>
      </div>
    </section>
  );
}
