"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export default function PhilosophySection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  return (
    <section className="flex flex-col w-full">
      {/* Upper Philosophical Block */}
      <div className="bg-naka-blue text-white pt-4 pb-6 lg:pt-12 lg:pb-16 relative z-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center">
          <span className="inline-block py-1 px-4 border border-white/20 text-[10px] tracking-[0.3em] uppercase mb-10 backdrop-blur-sm bg-white/5 relative">
            Triết lý Doanh nghiệp
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-['Playfair_Display',serif] leading-tight mb-8 font-medium">
            "Thông qua thử thách và sáng tạo
            <br />
            <span className="text-white/80">
              để gặt hái sự tăng trưởng bền vững."
            </span>
          </h2>

          <div className="flex justify-center items-center gap-6 mb-12 opacity-80">
            <div className="h-px w-16 bg-white/20"></div>
            <span className="font-['Noto_Serif_JP',serif] text-3xl font-light tracking-[0.25em]">
              ものづくり
            </span>
            <div className="h-px w-16 bg-white/20"></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-white/80 font-light text-base md:text-lg leading-relaxed tracking-wide">
              Tinh thần{" "}
              <span className="text-white font-medium italic">Monozukuri</span>{" "}
              không chỉ là sản xuất, mà là nghệ thuật thổi hồn vào vật chất. Tại
              Nakao, chúng tôi tin rằng sự phát triển bền vững chỉ đến từ việc
              không ngừng thử thách giới hạn và sáng tạo đổi mới trong từng sản
              phẩm, mang lại giá trị thực cho người sử dụng.
            </p>
          </div>
        </div>
      </div>

      {/* Cinematic Video Area */}
      <div
        className="relative w-full h-[600px] lg:h-[800px] bg-slate-900 group cursor-pointer overflow-hidden"
        onClick={() => setIsVideoPlaying(true)}
      >
        {isVideoPlaying ? (
          <iframe
            src="https://www.youtube.com/embed/N24NjVfReCc?si=viYyFhcn6jyQqKol&autoplay=1"
            title="Đoạn phim Kỷ niệm 100 năm Nakao"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <>
            <div className="absolute inset-0">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZCFJmvhd3qbgV9F_oaZFM1xJ4h0XQa2VAYt8i39daMglNISweFCCN5hC2VvOuOqVhEWR8lcKci-raBM3g6z_pU4211XEx-bez91EMRyHg1Navo4NmJ3NR4YCvSbGFiczmH0tNHCxrGZ9ULmtxSIkIdpECQpuj64wdNNoL5SqJHTmKXkH_TiS1v5GSDQmZ2Ok1sz17XvKwVuSrjlI0Ko5j-CjCldRWHnYPLgYCyr7hpm-gj-_3bY4HEnWnBmbMc0f0kuTO7Aw45Kkz"
                alt="Kiến trúc hiện đại Nakao 100 năm"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                sizes="100vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-linear-to-t from-naka-blue/40 to-transparent"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
              <div className="relative mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                  <Play className="w-10 h-10 ml-1 text-white fill-white" />
                </div>
                <div className="absolute -inset-4 border border-white/10 rounded-full animate-pulse"></div>
              </div>

              <div className="text-center space-y-2">
                <span className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-2 text-white/80">
                  The 100th Anniversary Film
                </span>
                <h3 className="text-5xl md:text-7xl font-['Playfair_Display',serif] text-white mb-2">
                  1925 — 2025
                </h3>
                <span className="block text-sm md:text-base font-light tracking-[0.25em] uppercase text-white/90 mt-4">
                  Hành trình 100 năm kiến tạo kiệt tác
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 w-full p-8 md:p-12 bg-linear-to-t from-black/80 to-transparent z-20 text-center">
              <p className="text-white/70 text-sm md:text-base font-light italic max-w-3xl mx-auto">
                "Nhìn lại một thế kỷ hình thành và phát triển để kiến tạo tầm
                nhìn cho 100 năm tiếp theo. Nakao cam kết tiếp tục đổi mới, mang
                lại giá trị bền vững cho kiến trúc tương lai."
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
