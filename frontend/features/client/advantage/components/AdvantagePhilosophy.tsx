import React from "react";

export default function AdvantagePhilosophy() {
  return (
    <section className="bg-[#f8f9fa] rounded-2xl p-6 md:p-16 reveal-on-scroll">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="space-y-6 md:space-y-8 order-2 md:order-1">
          <div className="inline-block border border-naka-blue px-4 py-1 text-naka-blue text-xs font-bold tracking-widest uppercase bg-white">
            Triết lý Nakao
          </div>
          <h3 className="text-2xl md:text-4xl font-serif font-bold uppercase text-naka-blue">
            Công nghệ chính xác &amp; Vận hành êm ái
          </h3>
          <div className="space-y-4 text-gray-700 text-sm md:text-base">
            <p>
              Hệ thống ray trượt cao cấp giúp triệt tiêu tiếng ồn, mang lại
              không gian sống tĩnh tại tuyệt đối.
            </p>
            <p>
              Phụ kiện NAKAO hòa mình vào cánh cửa, tôn vinh vẻ đẹp của nội thất
              mà không phô trương.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-8 py-6 border-t border-naka-blue/20">
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-naka-blue">
                0.1mm
              </div>
              <div className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Sai số cho phép
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-naka-blue">
                200K
              </div>
              <div className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Chu kỳ đóng mở
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-naka-blue">
                -45dB
              </div>
              <div className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                Khả năng cách âm
              </div>
            </div>
          </div>
        </div>
        <div className="relative group order-1 md:order-2">
          <div className="absolute -inset-4 bg-naka-blue/10 blur-xl rounded-full scale-75 opacity-50"></div>
          <img
            alt="Modern architecture detail"
            className="relative rounded-lg shadow-2xl z-10 grayscale hover:grayscale-0 transition-all duration-700 w-full object-cover aspect-square md:aspect-auto"
            data-alt="Modern minimalist architectural design with clean metal lines"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuASRtCIL-Fi8xQ_hPmQooiYstHDfXANYZ45wf_CWN58Ydu2AQDaDOIeDKWtvxL_vi-fgIdccMxvXqFhlHooKY0xxFQviwPVKcAtvGs-IxtERU0y2-BhsAqCqlRi7PtP1L_55aFVKp1FJfvhs5mpVs1RVhCc0-LZYtVci5XsuUOtGAvyv-N6EtwQb_EYdd0vhonZ8SfYNVRglrYUmCj7DSua8Bv42y8Ml6I8B4DP-mYMBjRn1PM5S-fbFbARzC3jwfiwUBSf2mRBeHit"
          />
        </div>
      </div>
    </section>
  );
}
