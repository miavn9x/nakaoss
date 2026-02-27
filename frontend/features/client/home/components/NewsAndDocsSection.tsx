"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

export default function NewsAndDocsSection() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 reveal-on-scroll">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-naka-blue text-[10px] font-bold font-display tracking-[0.4em] uppercase mb-2 block">
              Cập nhật
            </span>
            <h2 className="text-3xl font-serif text-naka-blue">
              Tin tức &amp; Tài liệu
            </h2>
          </div>
          <Link
            href="/news"
            className="text-xs font-display uppercase tracking-[0.25em] text-naka-blue border-b border-naka-blue pb-1 hover:opacity-70 transition-opacity"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Featured Post (Left Column) */}
          <div className="group cursor-pointer bg-slate-50 flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZSC05N40EedTTceSJ97TCnt0LnR-t6JYwEXJclaDo7M-GS33zjf0SPDAxbfTaZkz-akhu2ss89sZsZtR2EZOhHBL78dVHzFl6q4_p7XTZY1usvwYwpglQ1ITjc0OxJsOvtlsl4K_i2K6Gwo5TapTLYYFXqERgu-LzDIU4Jec364KUYN0O9SH0LYWDVseQmUC6Gi6Q3fWwgmqctT7NQ1NAa_ldrkNqcbIjnaD-UylooMFTzAqIB0lIginQW2g9SEPKYmDsPNFtPm9E"
                alt="Thành lập NAKAO VIỆT NAM"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
              />
              <div className="absolute top-4 left-4 bg-naka-blue text-white px-3 py-1 text-[10px] font-bold font-display uppercase tracking-wider">
                TIÊU ĐIỂM
              </div>
            </div>
            <div className="w-full md:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-xs text-naka-blue font-display font-medium block mb-3">
                20 Tháng 06, 2025
              </span>
              <h3 className="text-2xl font-serif text-naka-blue mb-4 group-hover:text-naka-blue transition-colors uppercase">
                Thành lập NAKAO VIỆT NAM
              </h3>
              <p className="text-slate-500 font-display font-light text-sm leading-relaxed mb-6 line-clamp-4 text-justify">
                Đánh dấu sự hiện diện chính thức của Nakao Seisakusho tại thị
                trường Việt Nam. Văn phòng mới sẽ là cầu nối trực tiếp mang đến
                các giải pháp phụ kiện kiến trúc chuẩn Nhật Bản cho cả...
              </p>
              <button className="text-[10px] uppercase font-display tracking-[0.2em] text-naka-blue font-medium border-b border-naka-blue/30 pb-1 self-start hover:border-naka-blue transition-colors cursor-pointer">
                ĐỌC THÊM
              </button>
            </div>
          </div>

          {/* List Posts (Right Column) */}
          <div className="flex flex-col justify-center gap-0">
            {/* List Item 1 */}
            <div className="group cursor-pointer py-6 border-b border-slate-100 flex gap-6 items-center hover:bg-slate-50/50 transition-colors">
              <div className="w-32 aspect-4/3 bg-slate-100 relative overflow-hidden shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4z_CgS84A0Fdnrm0pZ1b0RqoZug_bdg4zFQccScL8YcpR7xVo6MbsgTzNSAmeShTDEmLm6w7yWqmw_toYeM-sHA93RJU9lXLftAd5nBz3e-w0ggmgytm5JufO89ermKO4pwFBVha1O33jGmNZ7dmpgV2jl4MkOSdTGCKVRA_AcFh_IDFOG4GSJSAFXPjM_gWkIfaC4SokBhNArlRfRuYKK1deaITTz5LnhKn4Ez-qqRXudf0xbVVmYsC6d7JnLXzMBbjS5Kv-cBJY"
                  alt="Triển lãm Vietbuild"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#869ab8] font-display font-medium block mb-2">
                  15/10/2024
                </span>
                <h4 className="text-lg font-serif text-naka-blue group-hover:text-naka-blue transition-colors mb-1">
                  Triển lãm Quốc tế Vietbuild TP.HCM
                </h4>
                <p className="text-slate-500 text-sm font-display font-light">
                  Trưng bày các giải pháp cửa lùa mới nhất.
                </p>
              </div>
            </div>

            {/* List Item 2 */}
            <div className="group cursor-pointer py-6 border-b border-slate-100 flex gap-6 items-center hover:bg-slate-50/50 transition-colors">
              <div className="w-32 aspect-4/3 bg-slate-100 relative overflow-hidden shrink-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgC-d21j-_eUvV4l8P65yW1Q42I36n5hU-E8mB9k88xH6m0O7_V8JcZ4U0N56A7TxgVvK9f8F5x_g2iL4F_17d2O-7v9_k-04yK4g7_iO8M1X4U0z7L7M7I3S5F-1q2w3e2_p0T_o4z1qf1D0z-8g2C0S5k8G_M7J3c1T5G9R8"
                  alt="Công nghệ đóng kín khí"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#869ab8] font-display font-medium block mb-2">
                  05/09/2024
                </span>
                <h4 className="text-lg font-serif text-naka-blue group-hover:text-naka-blue transition-colors mb-1">
                  Công nghệ mới: Hệ thống đóng kín khí thế hệ 2
                </h4>
                <p className="text-slate-500 text-sm font-display font-light">
                  Cải tiến khả năng cách âm lên đến 30%.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button className="flex items-center gap-3 text-sm font-bold font-display uppercase tracking-[0.2em] text-naka-blue hover:opacity-70 transition-opacity cursor-pointer">
                <Download className="w-5 h-5 mb-1" /> TẢI CATALOGUE PHỤ KIỆN
                2025
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
