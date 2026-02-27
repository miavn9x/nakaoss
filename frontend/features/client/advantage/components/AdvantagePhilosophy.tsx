import React from "react";

export default function AdvantagePhilosophy() {
  return (
    <section className="bg-[#f8f9fa] rounded-2xl p-6 md:p-16 reveal-on-scroll">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="space-y-6 md:space-y-8 order-2 md:order-1">
          <div className="inline-block border border-naka-blue px-4 py-1 text-naka-blue text-xs font-bold tracking-widest uppercase bg-white">
            Triết lý Nakao
          </div>
          <h2 className="text-2xl md:text-4xl font-serif font-bold uppercase text-naka-blue leading-[1.3]">
            Công nghệ chính xác &amp; Vận hành êm ái
          </h2>
          <div className="space-y-4 text-slate-700 text-sm md:text-base font-light text-justify leading-relaxed">
            <p>
              Hệ thống ray trượt cao cấp giúp triệt tiêu tiếng ồn, mang lại
              không gian sống tĩnh tại tuyệt đối.
            </p>
            <p>
              Phụ kiện NAKAO hòa mình vào cánh cửa, tôn vinh vẻ đẹp của nội thất
              mà không phô trương.
            </p>
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
