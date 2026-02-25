"use client";

import React from "react";
import Image from "next/image";

export default function CoreProductsSection() {
  return (
    <section className="py-12 bg-[#fbfbf9] relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[40px_40px]"></div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center mb-24 text-center">
          <span className="text-naka-blue text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
            Bộ sưu tập
          </span>
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display',serif] text-naka-blue uppercase">
            LĨNH VỰC KINH DOANH
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {/* Card 01 - Ray trượt */}
          <div className="group relative aspect-4/5 overflow-hidden cursor-pointer bg-slate-900">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdu6thKFJUZd0gHAXv54tAG4uj8UuoULBhbb7hmT0dihEf3PcRfEyzqdxUK0pRA8nl4mkYbSdlfcMEL6Bgdga6Hk-JxfcoS-1P5UnVl6aDk6Y1Anc3JSjYfZLLZiFVQ3qu0wqC9y_GExCNM04VIl2ZnCqrvSBK1a1QZjL2tQezF1D_xu93If5CCfSCyLBidaHvmKofutPoAMD6nw-oV6d03LPTCBw8tpsHDDxEm15TaGZUROToSQXh1OnQDxSDcIFxme6jteNoxkpB"
              alt="Ray trượt"
              fill
              className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-naka-blue/90 via-transparent to-transparent opacity-90"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <span className="font-['Noto_Serif_JP',serif] text-2xl mb-2 opacity-50">
                01
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold mb-2">
                Ray trượt
              </h3>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-4 border-t border-white/30 pt-4 inline-block">
                Vận hành mượt mà
              </p>
              <p className="text-xs font-light leading-relaxed text-white/90">
                Hệ thống ray trượt được thiết kế chính xác để cửa vận hành trơn
                tru, nhẹ nhàng với độ bền vượt trội.
              </p>
            </div>
          </div>

          {/* Card 02 - Bản lề */}
          <div className="group relative aspect-4/5 overflow-hidden cursor-pointer bg-slate-900 lg:mt-12">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA56zQfgPu8BeCw58kJ7ZVjs6X83g2K-tLB1CqHY21Qung7y46aibyvzocJPLWoMLTO0igz2DOHKTApfzBgaVIdACsIBZPVeWSCjOr_rqBH8V_F_bX05rASbJdsT0r0jdqC7xXsXy7BMCgiuHDjHJWn7ZzchLkeMygO1le6cate6lOc7Oxs5FlXRU0tCQZS_lDyWaUNq0CNlnWNsJQA-4v62mKs3p8i7how6iMny2mlZODJdXv-5kjwUZ4jzPGgx8jNzOxMalvYY6f0"
              alt="Bản lề"
              fill
              className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-naka-blue/90 via-transparent to-transparent opacity-90"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <span className="font-['Noto_Serif_JP',serif] text-2xl mb-2 opacity-50">
                02
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold mb-2">
                Bản lề
              </h3>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-4 border-t border-white/30 pt-4 inline-block">
                Kết nối vững chắc
              </p>
              <p className="text-xs font-light leading-relaxed text-white/90">
                Đảm bảo sự liên kết chắc chắn giữa cửa và khung, cho phép đóng
                mở linh hoạt và ổn định lâu dài.
              </p>
            </div>
          </div>

          {/* Card 03 - Xiết đáy */}
          <div className="group relative aspect-4/5 overflow-hidden cursor-pointer bg-slate-900">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe_6CzRwPq7odEZwKNoXcKoXmemP-w1VQ7viGw9GzZ4xPC42zLDbbu1ZtnNl1kCYB78hf2iR4e9YqtYyuaiGnkaTZrLyHOeUe3QeyFs6tBW8XChIrvlcojl2bWzyCJhLgSlYPNR8xjnkJ5MXzHMcK9fvdG5nNkyaAJB-UTtcO-OEw1VaEii6QfqCnnYvQX3N7eIffvMo8SDc3D-QPOBNOP-jh5cE1XROB0pGjaE-PwscumFlAx0ZDYYRW17bMTUpkY4qcXhM3YJTUK"
              alt="Xiết đáy"
              fill
              className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-naka-blue/90 via-transparent to-transparent opacity-90"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <span className="font-['Noto_Serif_JP',serif] text-2xl mb-2 opacity-50">
                03
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold mb-2">
                Xiết đáy
              </h3>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-4 border-t border-white/30 pt-4 inline-block">
                Kín khí tối đa
              </p>
              <p className="text-xs font-light leading-relaxed text-white/90">
                Cơ chế ép sát sàn khi đóng cửa giúp ngăn bụi, côn trùng và cách
                âm hiệu quả cho không gian.
              </p>
            </div>
          </div>

          {/* Card 04 - Chặn cửa */}
          <div className="group relative aspect-4/5 overflow-hidden cursor-pointer bg-slate-900 lg:mt-12">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRdbJnrLfTAeBN0DtemIvNY8dkI2Q7z0_jRdkp6FTwNoYX0YorDypHcxYeGLP5Pkb0fk4m6Q3LRuDcd-VHTe7NLpAooVCNKqyKjxaOChlK08txD74Jty2mIQcxP3O_53zLDky9t79iZD4-jLl-N73BdB4CDFjiXDM-jOnbVKYGmEPf9X8ykVRfQDqM4-VGnsnenoVvNcGdyY-zBjfYL-lUfe2Y1gzwzInVf5Q8BU6ZSnfjrUv9-eq9a5o8E2tgyK90kEp2A6NGon_t"
              alt="Chặn cửa"
              fill
              className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-naka-blue/90 via-transparent to-transparent opacity-90"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <span className="font-['Noto_Serif_JP',serif] text-2xl mb-2 opacity-50">
                04
              </span>
              <h3 className="font-['Playfair_Display',serif] text-2xl font-bold mb-2">
                Chặn cửa
              </h3>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/70 mb-4 border-t border-white/30 pt-4 inline-block">
                An toàn tuyệt đối
              </p>
              <p className="text-xs font-light leading-relaxed text-white/90">
                Ngăn ngừa va đập mạnh gây hư hại cửa và tường, bảo vệ an toàn
                cho người sử dụng trong mọi tình huống.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
