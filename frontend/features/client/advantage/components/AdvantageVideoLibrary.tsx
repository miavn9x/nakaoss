import React from "react";

interface AdvantageVideoLibraryProps {
  onPlay: (url: string) => void;
}

export default function AdvantageVideoLibrary({
  onPlay,
}: AdvantageVideoLibraryProps) {
  const VIDEOS = {
    sealing: "https://youtu.be/N24NjVfReCc",
    hinge: "https://youtu.be/N24NjVfReCc",
    motion: "https://youtu.be/N24NjVfReCc",
    durability: "https://youtu.be/N24NjVfReCc",
  };

  return (
    <section className="space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 md:pb-8 reveal-on-scroll">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-naka-blue font-serif leading-tight">
            Thư viện Video Kỹ thuật
          </h2>
          <p className="text-slate-500 mt-2 text-sm md:text-base font-light">
            Dữ liệu thực nghiệm &amp; Chứng nhận chất lượng tiêu chuẩn quốc tế
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-naka-blue">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-naka-blue">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-16">
        {/* Card 1 */}
        <div className="flex flex-col reveal-on-scroll">
          <div className="group overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500 relative aspect-16/10 mb-6 cursor-pointer bg-gray-100">
            <div
              className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-700 ease-out video-thumb-1"
              data-alt="Technical close-up of Air Tight sealing system on a window"
            ></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
            <div className="absolute top-4 left-4 bg-naka-blue text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-lg">
              Acoustic Control
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => onPlay(VIDEOS.sealing)}
            >
              <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform duration-300 play-btn-pulse group-hover:bg-naka-blue/80 group-hover:border-naka-blue">
                <span className="material-symbols-outlined text-4xl! fill-1">
                  play_arrow
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 uppercase text-naka-blue font-serif leading-tight">
            Hệ thống đóng kín khí Air Tight
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 text-justify font-light">
            Giải pháp tối ưu giúp cố định form cửa, tăng cường khả năng chống
            ồn, ngăn bụi và cản gió lùa, giữ cho không gian luôn kín khít và an
            toàn. Tối ưu hóa hiệu quả cho các hệ cửa lùa hiện đại.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col reveal-on-scroll delay-100">
          <div className="group overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500 relative aspect-16/10 mb-6 cursor-pointer bg-gray-100">
            <div
              className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-700 ease-out video-thumb-2"
              data-alt="Detail of a 3D adjustable hidden door hinge"
            ></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
            <div className="absolute top-4 left-4 bg-naka-blue text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-lg">
              Precision Engineering
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => onPlay(VIDEOS.hinge)}
            >
              <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform duration-300 play-btn-pulse group-hover:bg-naka-blue/80 group-hover:border-naka-blue">
                <span className="material-symbols-outlined text-4xl! fill-1">
                  play_arrow
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 uppercase text-naka-blue font-serif leading-tight">
            Bản lề âm 3D thông minh
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 text-justify font-light">
            Thiết kế chắc chắn, linh hoạt, là giải pháp hoàn hảo cho các công
            trình cao cấp đòi hỏi tính thẩm mỹ vô khuyết và khả năng vận hành
            trơn tru, duy trì tuổi thọ lâu dài.
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col reveal-on-scroll">
          <div className="group overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500 relative aspect-16/10 mb-6 cursor-pointer bg-gray-100">
            <div
              className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-700 ease-out video-thumb-3"
              data-alt="Sliding door track with high-tech rollers"
            ></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
            <div className="absolute top-4 left-4 bg-naka-blue text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-lg">
              Ultra-Smooth Motion
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => onPlay(VIDEOS.motion)}
            >
              <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform duration-300 play-btn-pulse group-hover:bg-naka-blue/80 group-hover:border-naka-blue">
                <span className="material-symbols-outlined text-4xl! fill-1">
                  play_arrow
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 uppercase text-naka-blue font-serif leading-tight">
            Ray trượt siêu êm (Soft-Close)
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 text-justify font-light">
            Hệ thống ray trượt siêu êm, chịu tải trọng tốt, đảm bảo chuyển động
            mượt mà, không rung lắc và đặc biệt bền bỉ cho các hệ cửa lùa, cửa
            trượt.
          </p>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col reveal-on-scroll delay-100">
          <div className="group overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500 relative aspect-16/10 mb-6 cursor-pointer bg-gray-100">
            <div
              className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-700 ease-out video-thumb-4"
              data-alt="Laboratory machine testing door durability cycles"
            ></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
            <div className="absolute top-4 left-4 bg-naka-blue text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest shadow-lg">
              Durability Test
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => onPlay(VIDEOS.durability)}
            >
              <div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform duration-300 play-btn-pulse group-hover:bg-naka-blue/80 group-hover:border-naka-blue">
                <span className="material-symbols-outlined text-4xl! fill-1">
                  play_arrow
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 uppercase text-naka-blue font-serif leading-tight">
            CHẾ TÁC CHÍNH XÁC &amp; ĐỘ BỀN CAO
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 text-justify font-light">
            Sản phẩm được chế tác với dung sai cực nhỏ, đảm bảo sự vận hành trơn
            tru và tuổi thọ lên tới hàng trăm ngàn chu kỳ đóng mở theo tinh thần
            Monozukuri Nhật Bản.
          </p>
        </div>
      </div>
    </section>
  );
}
