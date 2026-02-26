"use client";

import React from "react";
import Image from "next/image";

export default function TechBreakdownSection() {
  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 reveal-on-scroll">
        <div className="mb-12 border-b border-naka-blue/10 pb-6">
          <div>
            <span className="text-naka-blue text-[10px] font-bold font-display tracking-[0.4em] uppercase mb-3 block">
              Kỹ thuật Xuất sắc
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-naka-blue uppercase mb-6">
              THÀNH TỰU TẠI NHẬT BẢN
            </h2>
            <p className="text-slate-600 font-display font-light leading-relaxed text-lg max-w-4xl text-justify">
              Tại thị trường Nhật Bản, nơi yêu cầu về độ chính xác và tính ứng
              dụng luôn ở mức cao nhất, Nakao được vinh danh nhờ năng lực kiểm
              soát toàn diện từ khâu R&D (Nghiên cứu & Phát triển) đến gia công
              và phân phối.
            </p>
          </div>
        </div>

        {/* Feature 1: Airtight System */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center group">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -left-4 -top-4 w-full h-full border border-naka-blue/20 pointer-events-none"></div>
            <div className="relative bg-white p-4 shadow-xl z-10">
              <div className="bg-slate-800 h-[400px] w-full overflow-hidden relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8oV850YM10brOB3v5U9dtkFdCTZOKZr_yNKSenrD1-nl9n-jqUJgi_f8qwxi5RtIwyR7BHNCLXut9L4m6FG2-bQFP-HyhpqYyM0sB3R_IJ52oNEbREBKgWTgEnWxYqgLJuV-HG-NAjwCSl_LdxCT4nZX-fiRdlt-tVpEhp0-KnLVQHilslHGNH-j8B7EVYS4LvRvkfBxtRLleTcZGlif2rSbVuP6Vld6FrN5cp9HsXHRmneheVn3yRKbRwIrrVeRkkxRkmjod4qGJ"
                  alt="Hệ thống đóng kín khí"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-naka-blue/90 text-white px-4 py-2 text-[10px] font-display backdrop-blur-sm">
                  HÌNH 01: HỆ THỐNG KÍN KHÍ
                </div>
                <svg
                  className="absolute bottom-6 right-6 w-24 h-24 text-white/50"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="2 2"
                    strokeWidth="0.5"
                  ></circle>
                  <line
                    stroke="currentColor"
                    strokeWidth="0.5"
                    x1="50"
                    x2="50"
                    y1="10"
                    y2="90"
                  ></line>
                  <line
                    stroke="currentColor"
                    strokeWidth="0.5"
                    x1="10"
                    x2="90"
                    y1="50"
                    y2="50"
                  ></line>
                </svg>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:pl-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-8 bg-naka-blue"></span>
              <span className="text-naka-blue font-display text-xs">
                MÃ: SD-AT-2023
              </span>
            </div>
            <h3 className="text-3xl font-serif text-naka-blue mb-6">
              Hệ thống đóng kín khí cho cửa lùa
            </h3>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.25em] mb-4 block">
              (Sliding Door Air Tight System)
            </span>
            <p className="text-slate-600 font-light leading-relaxed mb-8 text-justify">
              Tối ưu hóa khả năng chống ồn, ngăn bụi và cản gió lùa hiệu quả.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
              <div>
                <span className="text-[10px] font-display uppercase text-slate-400 tracking-[0.25em] block mb-1">
                  Tính năng
                </span>
                <span className="text-naka-blue font-serif text-xl">
                  Chống ồn, Ngăn bụi
                </span>
              </div>
              <div>
                <span className="text-[10px] font-display uppercase text-slate-400 tracking-[0.25em] block mb-1">
                  Thẩm mỹ
                </span>
                <span className="text-naka-blue font-serif text-xl">
                  Vô khuyết
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: 3D Hinge */}
        <div className="grid lg:grid-cols-2 gap-16 items-center group">
          <div className="lg:pr-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-8 bg-naka-blue"></span>
              <span className="text-naka-blue font-display text-xs">
                MÃ: 3D-H-2024
              </span>
            </div>
            <h3 className="text-3xl font-serif text-naka-blue mb-6">
              Bản lề âm điều chỉnh 3 chiều
            </h3>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.25em] mb-4 block">
              (3D Adjustable Hinge)
            </span>
            <p className="text-slate-600 font-display font-light leading-relaxed mb-8 text-justify">
              Giải pháp hoàn hảo cho các công trình cao cấp, đòi hỏi tính thẩm
              mỹ vô khuyết và khả năng vận hành êm ái.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
              <div>
                <span className="text-[10px] font-display uppercase text-slate-400 tracking-[0.25em] block mb-1">
                  Điều chỉnh
                </span>
                <span className="text-naka-blue font-serif text-xl">
                  3 Chiều X-Y-Z
                </span>
              </div>
              <div>
                <span className="text-[10px] font-display uppercase text-slate-400 tracking-[0.25em] block mb-1">
                  Thiết kế
                </span>
                <span className="text-naka-blue font-serif text-xl">
                  Ẩn mình
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -bottom-4 w-full h-full border border-naka-blue/20 pointer-events-none"></div>
            <div className="relative bg-white p-4 shadow-xl z-10">
              <div className="bg-slate-800 h-[400px] w-full overflow-hidden relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZCFJmvhd3qbgV9F_oaZFM1xJ4h0XQa2VAYt8i39daMglNISweFCCN5hC2VvOuOqVhEWR8lcKci-raBM3g6z_pU4211XEx-bez91EMRyHg1Navo4NmJ3NR4YCvSbGFiczmH0tNHCxrGZ9ULmtxSIkIdpECQpuj64wdNNoL5SqJHTmKXkH_TiS1v5GSDQmZ2Ok1sz17XvKwVuSrjlI0Ko5j-CjCldRWHnYPLgYCyr7hpm-gj-_3bY4HEnWnBmbMc0f0kuTO7Aw45Kkz"
                  alt="Bản lề 3D"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-6 left-6 bg-white/95 text-slate-800 p-4 shadow-lg backdrop-blur-sm border-l-2 border-naka-blue">
                  <span className="text-[10px] font-bold uppercase block mb-2 text-naka-blue">
                    Phạm vi điều chỉnh
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-display text-[10px] text-slate-500">
                    <div className="flex flex-col items-center">
                      <span className="block font-bold text-naka-blue">X</span>
                      <span>±3mm</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block font-bold text-naka-blue">Y</span>
                      <span>±3mm</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block font-bold text-naka-blue">Z</span>
                      <span>±2mm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
