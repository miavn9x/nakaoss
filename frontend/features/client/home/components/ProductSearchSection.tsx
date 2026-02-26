"use client";

import React from "react";
import Image from "next/image";
import {
  Layers,
  SlidersHorizontal,
  DoorOpen,
  ArrowDownToLine,
  CheckCircle2,
} from "lucide-react";

export default function ProductSearchSection() {
  return (
    <section className="py-16 md:py-24 bg-[#fbfbf9] relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 relative z-10 reveal-on-scroll">
        <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <span className="text-naka-blue text-[10px] font-bold font-display tracking-[0.4em] uppercase mb-4">
            Sản phẩm &amp; Dịch vụ
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-naka-blue uppercase tracking-wider">
            TRA CỨU SẢN PHẨM
          </h2>
          <div className="h-px w-24 bg-naka-blue/20 mt-8"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-1 mb-4 md:mb-6 bg-white shadow-xl  mx-auto">
          <div className="flex-1 lg:w-1/3 bg-naka-blue text-white p-6 md:p-8 lg:p-12 flex flex-col justify-center items-start relative overflow-hidden group min-h-[250px] lg:min-h-[300px]">
            <div className="absolute right-0 top-0 opacity-10 w-full h-full pointer-events-none">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 50 L150 50 L150 150 L50 150 Z"
                  strokeWidth="0.5"
                ></path>
                <path
                  d="M50 50 L30 70 M150 50 L130 70 M150 150 L130 170 M50 150 L30 170"
                  strokeWidth="0.5"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold font-display tracking-[0.2em] mb-2 uppercase z-10">
              Tra theo loại cửa
            </h3>
            <span className="text-[10px] font-display tracking-[0.25em] uppercase opacity-70 mb-8 z-10 block">
              Search by Set
            </span>
            <div className="w-8 h-px bg-white/30 mb-8 z-10"></div>
            <p className="text-xs font-display font-light leading-relaxed opacity-80 z-10 max-w-[80%] text-justify">
              Lựa chọn sản phẩm dựa trên quy cách và cách vận hành của hệ thống
              cửa.
            </p>
          </div>

          <div className="flex-1 lg:w-2/3 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
            <div className="relative group p-6 md:p-8 flex flex-col items-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="h-24 md:h-32 w-full mb-4 md:mb-6 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-20 h-20 md:w-24 md:h-24 text-naka-blue"
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 100 100"
                >
                  <rect fill="none" height="60" width="40" x="30" y="20"></rect>
                  <line x1="30" x2="50" y1="50" y2="50"></line>
                  <line x1="50" x2="65" y1="50" y2="50"></line>
                  <path
                    d="M70 50 L65 48 L65 52 Z"
                    fill="currentColor"
                    stroke="none"
                  ></path>
                </svg>
              </div>
              <h4 className="font-serif text-xl text-naka-blue font-bold mb-2">
                Cửa trượt
              </h4>
              <span className="text-[10px] font-display text-slate-400 uppercase tracking-wider mb-6 block">
                Sliding Door Systems
              </span>
              <button className="text-xs font-bold font-display text-naka-blue uppercase tracking-[0.25em] border-b border-naka-blue/20 hover:border-naka-blue pb-1 transition-all cursor-pointer">
                Xem chi tiết
              </button>
            </div>

            <div className="relative group p-6 md:p-8 flex flex-col items-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="h-24 md:h-32 w-full mb-4 md:mb-6 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-20 h-20 md:w-24 md:h-24 text-naka-blue"
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 100 100"
                >
                  <path d="M25 20 L45 80 L65 20 L85 80" fill="none"></path>
                  <circle cx="25" cy="20" fill="currentColor" r="2"></circle>
                  <circle cx="85" cy="80" fill="currentColor" r="2"></circle>
                </svg>
              </div>
              <h4 className="font-serif text-xl text-naka-blue font-bold mb-2">
                Cửa gấp
              </h4>
              <span className="text-[10px] font-display text-slate-400 uppercase tracking-wider mb-6 block">
                Folding Door Systems
              </span>
              <button className="text-xs font-bold font-display text-naka-blue uppercase tracking-[0.25em] border-b border-naka-blue/20 hover:border-naka-blue pb-1 transition-all cursor-pointer">
                Xem chi tiết
              </button>
            </div>

            <div className="relative group p-6 md:p-8 flex flex-col items-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="h-24 md:h-32 w-full mb-4 md:mb-6 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-20 h-20 md:w-24 md:h-24 text-naka-blue"
                  stroke="currentColor"
                  strokeWidth="1"
                  viewBox="0 0 100 100"
                >
                  <rect fill="none" height="60" width="40" x="30" y="20"></rect>
                  <path d="M30 20 L20 80" strokeDasharray="2 2"></path>
                  <path d="M30 80 L60 75" strokeDasharray="2 2"></path>
                </svg>
              </div>
              <h4 className="font-serif text-xl text-naka-blue font-bold mb-2">
                Cửa mở
              </h4>
              <span className="text-[10px] font-display text-slate-400 uppercase tracking-wider mb-6 block">
                Swing Door Systems
              </span>
              <button className="text-xs font-bold font-display text-naka-blue uppercase tracking-[0.25em] border-b border-naka-blue/20 hover:border-naka-blue pb-1 transition-all cursor-pointer">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-1 mb-4 md:mb-6 bg-white shadow-xl  mx-auto">
          <div className="flex-1 lg:w-1/3 bg-[#152a55] text-white p-6 md:p-8 lg:p-12 flex flex-col justify-center items-start relative overflow-hidden group min-h-[200px] lg:min-h-auto">
            <h3 className="text-lg font-bold font-display tracking-[0.2em] mb-2 uppercase z-10">
              Tra theo danh mục
            </h3>
            <span className="text-[10px] font-display tracking-[0.25em] uppercase opacity-70 mb-8 z-10 block">
              Search by Category
            </span>
            <div className="w-8 h-px bg-white/30 mb-8 z-10"></div>
            <p className="text-xs font-display font-light leading-relaxed opacity-80 z-10 max-w-full md:max-w-[80%] text-justify">
              Tìm kiếm nhanh các linh kiện và phụ kiện lẻ theo tên gọi kỹ thuật.
            </p>
          </div>
          <div className="flex-1 lg:w-2/3 bg-white p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <a
                className="group flex flex-col items-center text-center gap-3 hover:bg-slate-50 p-4 rounded transition-colors"
                href="#"
              >
                <Layers className="text-naka-blue w-8 h-8 group-hover:scale-110 transition-transform origin-center" />
                <div className="flex flex-col items-center">
                  <span className="font-bold font-display text-slate-700 text-sm group-hover:text-naka-blue">
                    Bản lề
                  </span>
                  <span className="text-[10px] font-display text-slate-400 uppercase tracking-wide">
                    Hinges
                  </span>
                </div>
              </a>
              <a
                className="group flex flex-col items-center text-center gap-3 hover:bg-slate-50 p-4 rounded transition-colors"
                href="#"
              >
                <SlidersHorizontal className="text-naka-blue w-8 h-8 group-hover:scale-110 transition-transform origin-center" />
                <div className="flex flex-col items-center">
                  <span className="font-bold font-display text-slate-700 text-sm group-hover:text-naka-blue">
                    Ray trượt
                  </span>
                  <span className="text-[10px] font-display text-slate-400 uppercase tracking-wide">
                    Sliding Systems
                  </span>
                </div>
              </a>
              <a
                className="group flex flex-col items-center text-center gap-3 hover:bg-slate-50 p-4 rounded transition-colors"
                href="#"
              >
                <DoorOpen className="text-naka-blue w-8 h-8 group-hover:scale-110 transition-transform origin-center" />
                <div className="flex flex-col items-center">
                  <span className="font-bold font-display text-slate-700 text-sm group-hover:text-naka-blue">
                    Chặn cửa
                  </span>
                  <span className="text-[10px] font-display text-slate-400 uppercase tracking-wide">
                    Door Stoppers
                  </span>
                </div>
              </a>
              <a
                className="group flex flex-col items-center text-center gap-3 hover:bg-slate-50 p-4 rounded transition-colors"
                href="#"
              >
                <ArrowDownToLine className="text-naka-blue w-8 h-8 group-hover:scale-110 transition-transform origin-center" />
                <div className="flex flex-col items-center">
                  <span className="font-bold font-display text-slate-700 text-sm group-hover:text-naka-blue">
                    Xiết đáy
                  </span>
                  <span className="text-[10px] font-display text-slate-400 uppercase tracking-wide">
                    Door Bottom Seals
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row bg-naka-blue text-white max-w-6xl mx-auto shadow-2xl">
          <div className="lg:w-1/3 p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-[#152a55] order-2 lg:order-1">
            <span className="text-[10px] font-bold font-display tracking-[0.4em] uppercase mb-2 text-[#c5a059]">
              Sản phẩm tiêu biểu
            </span>
            <h3 className="text-3xl font-serif mb-2">Shuttle Closer</h3>
            <span className="text-xs font-display text-white/50 tracking-[0.25em] uppercase mb-6 block">
              Hệ thống đóng tự động
            </span>
            <div className="w-12 h-px bg-white/20 mb-6"></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-xs font-display font-light text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>Vận hành êm ái, giảm chấn kép</span>
              </li>
              <li className="flex items-center gap-3 text-xs font-display font-light text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>Dễ dàng lắp đặt và điều chỉnh</span>
              </li>
              <li className="flex items-center gap-3 text-xs font-display font-light text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#c5a059] shrink-0" />
                <span>Độ bền &gt; 200.000 lần đóng mở</span>
              </li>
            </ul>
            <div className="font-display text-[10px] text-white/40 mb-2">
              Part No: N-SC-202X
            </div>
            <button className="self-start text-[10px] font-bold font-display uppercase tracking-[0.25em] border border-white/30 px-6 py-3 hover:bg-white hover:text-naka-blue transition-all cursor-pointer">
              Xem kỹ thuật
            </button>
          </div>
          <div className="lg:w-2/3 relative h-[250px] md:h-[350px] lg:h-auto bg-white overflow-hidden group cursor-pointer order-1 lg:order-2">
            <Image
              alt="Shuttle Closer Technical Render"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdu6thKFJUZd0gHAXv54tAG4uj8UuoULBhbb7hmT0dihEf3PcRfEyzqdxUK0pRA8nl4mkYbSdlfcMEL6Bgdga6Hk-JxfcoS-1P5UnVl6aDk6Y1Anc3JSjYfZLLZiFVQ3qu0wqC9y_GExCNM04VIl2ZnCqrvSBK1a1QZjL2tQezF1D_xu93If5CCfSCyLBidaHvmKofutPoAMD6nw-oV6d03LPTCBw8tpsHDDxEm15TaGZUROToSQXh1OnQDxSDcIFxme6jteNoxkpB"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#152a55] via-transparent to-transparent opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
