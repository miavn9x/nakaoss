import React from "react";

interface AdvantageHeroProps {
  onPlay: (url: string) => void;
}

export default function AdvantageHero({ onPlay }: AdvantageHeroProps) {
  const HERO_VIDEO_URL = "https://youtu.be/N24NjVfReCc";
  return (
    <section className="space-y-6 md:space-y-8 reveal-on-scroll is-visible text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start gap-4">
        <span className="w-8 md:w-12 h-[2px] bg-naka-blue"></span>
        <span className="text-naka-blue font-bold tracking-widest text-xs md:text-sm uppercase">
          Kỹ thuật &amp; Sáng tạo Nhật Bản
        </span>
        <span className="w-8 md:w-0 h-[2px] bg-naka-blue md:hidden"></span>
      </div>
      <div className="max-w-4xl mx-auto md:mx-0">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] tracking-tight text-naka-blue uppercase">
          LỢI THẾ ĐỘC QUYỀN <br className="hidden md:block" />
          <span className="text-naka-blue">&amp; CÔNG NGHỆ NAKAO</span>
        </h2>
        <p className="mt-4 md:mt-6 text-base md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0 leading-relaxed">
          Khám phá sự tinh hoa trong từng chi tiết kỹ thuật và vận hành từ Nhật
          Bản qua những thước phim minh chứng chân thực.
        </p>
      </div>
      <div className="relative group mt-8 md:mt-12 overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500">
        <div className="aspect-video w-full relative bg-slate-200">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out hero-thumb"
            data-alt="Cinematic architectural luxury villa interior with Nakao products"
          ></div>
          <div className="absolute inset-0 bg-naka-blue/20 group-hover:bg-naka-blue/10 transition-colors duration-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => onPlay(HERO_VIDEO_URL)}
              className="size-16 md:size-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 play-btn-pulse"
            >
              <span className="material-symbols-outlined text-4xl! md:text-5xl! fill-1">
                play_arrow
              </span>
            </button>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4 md:p-8 flex flex-col gap-4 bg-linear-to-t from-slate-950/80 to-transparent">
            <div className="flex items-center gap-4">
              <div className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                <div className="h-full w-1/3 bg-naka-blue rounded-full"></div>
              </div>
              <span className="text-white text-xs font-bold font-mono">
                03:45 / 12:00
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
