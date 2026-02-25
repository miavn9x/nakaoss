"use client";

import React from "react";

export default function VietnamEstablishmentSection() {
  return (
    <section className="py-24 bg-naka-blue text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZCFJmvhd3qbgV9F_oaZFM1xJ4h0XQa2VAYt8i39daMglNISweFCCN5hC2VvOuOqVhEWR8lcKci-raBM3g6z_pU4211XEx-bez91EMRyHg1Navo4NmJ3NR4YCvSbGFiczmH0tNHCxrGZ9ULmtxSIkIdpECQpuj64wdNNoL5SqJHTmKXkH_TiS1v5GSDQmZ2Ok1sz17XvKwVuSrjlI0Ko5j-CjCldRWHnYPLgYCyr7hpm-gj-_3bY4HEnWnBmbMc0f0kuTO7Aw45Kkz')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-12 bg-white/30"></span>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/70">
              Thành lập mới
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-['Playfair_Display',serif] mb-6 leading-tight">
            Nakao Việt Nam
          </h2>
          <p className="text-white/80 text-lg font-light leading-relaxed mb-8 max-w-xl">
            Ngày 20/06/2025 đánh dấu sự ra đời chính thức của Nakao Việt Nam.
            Đây là cột mốc chiến lược quan trọng, khẳng định cam kết lâu dài và
            sự hiện diện vững chắc của chúng tôi tại thị trường Đông Nam Á đầy
            tiềm năng.
          </p>
        </div>

        <div className="flex-none">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 text-center min-w-[200px]">
            <span className="block text-5xl font-['Playfair_Display',serif] mb-2">
              20
            </span>
            <span className="block text-xl uppercase tracking-[0.25em] mb-4">
              Tháng 06
            </span>
            <span className="block text-3xl font-light">2025</span>
          </div>
        </div>
      </div>
    </section>
  );
}
