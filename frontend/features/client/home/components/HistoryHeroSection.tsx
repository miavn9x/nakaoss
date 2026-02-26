"use client";

import React from "react";
import Image from "next/image";

export default function HistoryHeroSection() {
  return (
    <section className="relative py-12 lg:py-16 bg-[#fbfbf9] overflow-hidden">
      {/* 1925 Background Watermark */}
      <div className="absolute top-[20%] left-[-5%] text-[15rem] lg:text-[25rem] leading-none font-serif font-black opacity-20 select-none z-0 rotate-90 lg:rotate-0 text-transparent [-webkit-text-stroke:1px_rgba(29,59,120,0.1)]">
        1925
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 z-10 reveal-on-scroll">
        <div className="mb-2 lg:mb-4 relative z-10">
          <span className="text-naka-blue text-sm font-bold font-display tracking-[0.4em] uppercase mb-4 block">
            Về Chúng Tôi
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-naka-blue leading-tight max-w-4xl">
            LỊCH SỬ HÌNH THÀNH &amp; <br />
            PHÁT TRIỂN NAKAO
          </h2>
          <p className="text-slate-500 font-display font-light italic mt-6 text-lg lg:text-xl border-l-2 border-naka-blue pl-6 ml-1">
            Hành trình 100 năm kiến tạo những chi tiết ẩn giấu làm nên kiệt tác.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-px h-20 bg-naka-blue/30 mt-2"></div>
              <span className="text-naka-blue font-serif text-lg tracking-[0.3em] opacity-60 py-2 [writing-mode:vertical-rl] [text-orientation:mixed]">
                歴史と伝統
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-serif font-medium text-naka-blue leading-[1.1] mb-8">
              Chế tác tại <br />
              <span className="italic font-light ml-8">Tsu, Mie (1925)</span>
            </h1>

            <div className="pl-8 border-l border-naka-blue/10 space-y-8">
              <div>
                <span className="text-xs font-bold font-display text-naka-blue uppercase tracking-[0.25em] mb-2 block">
                  Những bước đi đầu tiên
                </span>
                <p className="text-slate-600 font-display font-light leading-relaxed text-sm lg:text-base text-justify">
                  Tháng 3 năm 1925 tại thành phố Tsu, tỉnh Mie, Nhật Bản, Nakao
                  Seisakusho chính thức được thành lập. Trong giai đoạn khởi đầu
                  đầy thử thách, chúng tôi tập trung sản xuất bản lề, tay nắm và
                  các phụ kiện mộc, đặt nền móng vững chắc cho chất lượng và độ
                  chính xác của cơ khí Nhật Bản.
                </p>
              </div>
              <div>
                <span className="text-xs font-bold font-display text-naka-blue uppercase tracking-[0.25em] mb-2 block">
                  Di sản Thủ công
                </span>
                <p className="text-slate-600 font-display font-light leading-relaxed text-sm lg:text-base text-justify">
                  Từ những chiếc bản lề thủ công đầu tiên đến các hệ thống phụ
                  kiện kiến trúc phức tạp ngày nay, Nakao luôn gìn giữ triết lý
                  tôn trọng vật liệu và sự hoàn hảo trong từng chi tiết nhỏ, kế
                  thừa tinh hoa Monozukuri qua nhiều thế hệ.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 relative h-[450px] md:h-[600px] lg:h-[700px] mt-12 lg:mt-0 flex items-center justify-center">
            {/* Historic Image */}
            <div className="absolute right-0 top-0 w-[70%] md:w-[60%] h-[60%] md:h-[70%] z-10 grayscale hover:grayscale-0 transition-all duration-700">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDagSAXhsrHV_s0Tr4eb0h8b87_RJ5HpCYPjZ0xV3ZxQFPQhvNYmTci5QHiAdQQzy_RVtmvoh2AuxzXQJYCuo3n-9E23a_vROUpDP0mQcWkyLUwarOd7MXGCBCQJFbJB4NhiIB5LXonACoz0BCtVF4p7CRWJM1GMD4Xr4qysMf-cQs-gXUY3BuLiqxJGbA4XUBng8dn6_PELs0EiGedENQYDafDZSU6RNGRV0UKyJ2mmyS9z5pbIzqRYl3cqTb9OWTtvJMYaHjCFpKk"
                alt="Xưởng sản xuất lịch sử tại Tsu, Mie"
                fill
                className="object-cover shadow-2xl"
              />
            </div>

            {/* Modern Details Image */}
            <div className="absolute left-0 md:left-10 bottom-0 w-[60%] md:w-[50%] h-[50%] md:h-[60%] z-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-4 md:border-8 border-white">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4z_CgS84A0Fdnrm0pZ1b0RqoZug_bdg4zFQccScL8YcpR7xVo6MbsgTzNSAmeShTDEmLm6w7yWqmw_toYeM-sHA93RJU9lXLftAd5nBz3e-w0ggmgytm5JufO89ermKO4pwFBVha1O33jGmNZ7dmpgV2jl4MkOSdTGCKVRA_AcFh_IDFOG4GSJSAFXPjM_gWkIfaC4SokBhNArlRfRuYKK1deaITTz5LnhKn4Ez-qqRXudf0xbVVmYsC6d7JnLXzMBbjS5Kv-cBJY"
                alt="Chi tiết cơ khí hiện đại"
                fill
                className="object-cover"
              />
            </div>

            {/* Circular Rotating Badge */}
            <div className="absolute left-[20%] md:left-[35%] top-[25%] md:top-[20%] w-24 h-24 md:w-32 md:h-32 border border-naka-blue/20 rounded-full z-0 animate-[spin_10s_linear_infinite]">
              <svg className="w-full h-full p-2 md:p-2" viewBox="0 0 100 100">
                <path
                  d="M 20, 50 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"
                  fill="transparent"
                  id="curve"
                ></path>
                <text
                  className="text-[8px] md:text-[10px] uppercase font-display tracking-[0.25em] fill-naka-blue"
                  width="500"
                >
                  <textPath href="#curve">
                    Since 1925 • Nakao Japan • Since 1925 •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
