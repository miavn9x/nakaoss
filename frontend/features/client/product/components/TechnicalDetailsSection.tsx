import { CATEGORIES } from "./CategorySection";

interface TechnicalDetailsSectionProps {
  activeCategory: string;
}

export default function TechnicalDetailsSection({
  activeCategory,
}: TechnicalDetailsSectionProps) {
  const activeCategoryName =
    CATEGORIES.find((cat) => cat.id === activeCategory)?.name || "......";

  return (
    <section className="mt-24">
      <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
        <h3 className="font-serif text-2xl md:text-3xl text-naka-blue font-bold flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl">
            precision_manufacturing
          </span>
          Sản phẩm danh mục {activeCategoryName}
        </h3>
        <div className="hidden md:flex gap-2">
          <button className="p-2 rounded-[4px] bg-naka-blue text-white hover:bg-[#152c5b] shadow-sm">
            <span className="material-symbols-outlined text-xl">grid_view</span>
          </button>
          <button className="p-2 rounded-[4px] bg-white text-gray-400 hover:text-naka-blue border border-gray-200 hover:border-naka-blue/50">
            <span className="material-symbols-outlined text-xl">view_list</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-200 group flex flex-col h-full">
          <div className="relative h-72 bg-white p-6 flex items-center justify-center border-b border-gray-100">
            <div className="absolute top-4 left-4 bg-slate-100 text-naka-blue text-[10px] font-bold font-display px-3 py-1 rounded-[4px] uppercase tracking-[0.2em] border border-slate-200 z-10">
              Anodized Finish
            </div>
            <img
              alt="Mặt cắt kỹ thuật macro thanh ray nhôm anodized xám K-150"
              className="max-h-full max-w-full object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzlo9euuJYBMMbJcDKocwzgVKZAQLVrMqN8XbleII0qc5Qz4N8dOH6HaDBgip252O6d9-8Yg27WP72ZEa1IM_s6Efun1q1XkZUoesn8g9lEcxcJEAO_HNxRMhgbHk2X1dpG6LzhOHEcMqKDLpsRQc8HDqYvPo7AncGuNTNsz3yAvw2DuDrbyXbsAtqjjn7Yg1izR5sjBVwhf0DZQccm5RsuO9DTXMAgKZfftBHRB0V2RlwHd0HJ_CkjYGFwbqG2U0sHxnMx7pMzEeV"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h4 className="font-serif font-bold text-lg text-naka-blue mb-2">
              Ray trượt nhôm K-150
            </h4>
            <p className="text-sm text-slate-500 font-display font-light mb-6 line-clamp-2 leading-relaxed">
              Hệ thống ray trượt siêu êm, hợp kim nhôm 6063-T5 xử lý bề mặt
              anodized chống mài mòn.
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8 mt-auto">
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  fitness_center
                </span>{" "}
                Tải trọng:{" "}
                <span className="text-[#333333] ml-1 font-semibold">150kg</span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  straighten
                </span>{" "}
                Chiều dài:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  3000mm
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  settings
                </span>{" "}
                Chất liệu:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  Nhôm 6063
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  verified
                </span>{" "}
                Bảo hành:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  24 tháng
                </span>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-[4px] border border-naka-blue text-naka-blue hover:bg-naka-blue hover:text-white font-bold font-display text-xs transition-all duration-300 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
              Thông số kỹ thuật{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-200 group flex flex-col h-full">
          <div className="relative h-72 bg-white p-6 flex items-center justify-center border-b border-gray-100">
            <div className="absolute top-4 left-4 bg-slate-100 text-naka-blue text-[10px] font-bold font-display px-3 py-1 rounded-[4px] uppercase tracking-[0.2em] border border-slate-200 z-10">
              Silent Run Technology
            </div>
            <img
              alt="Ảnh thực tế cụm 4 bánh xe treo đôi chuyên dụng K-150"
              className="max-h-full max-w-full object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM6v_E9QrHwI5gA_0SJ8d45VN06Rp5wb5VPhDkcqz2gK-JxOExzYODkNs9ertlXDAUrbPRaGpbpAfOPheV4qnTMshxfeXU5mcmzdmJjovdLt1fxc-Go7rlI8kI0gPg5OABEtWddEFXf3llP1Ex1zxMNFd_hdSId-FqFbgYRmCAnFn6_3uNt8hVW4nE3kEtPzioxJf7XFo8ElzfyVjPq-h6TF0byqhcJ8gjODPz0dJVBJobZ-jHFb-Myy_AoT5zDvv1FLp9vk32qb9-"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h4 className="font-serif font-bold text-lg text-naka-blue mb-2">
              Bộ bánh xe treo K-150
            </h4>
            <p className="text-sm text-slate-500 font-display font-light mb-6 line-clamp-2 leading-relaxed">
              Cụm bánh xe đôi trục bi kín, thiết kế tối ưu với công nghệ Silent
              Run vận hành êm ái tuyệt đối.
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8 mt-auto">
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  layers
                </span>{" "}
                Cấu tạo:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  4 bánh/cụm
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  build
                </span>{" "}
                Lắp đặt:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  Treo trên
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  science
                </span>{" "}
                Công nghệ:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  Silent Run
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  verified
                </span>{" "}
                Bảo hành:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  24 tháng
                </span>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-[4px] border border-naka-blue text-naka-blue hover:bg-naka-blue hover:text-white font-bold font-display text-xs transition-all duration-300 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
              Thông số kỹ thuật{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-200 group flex flex-col h-full">
          <div className="relative h-72 bg-white p-6 flex items-center justify-center border-b border-gray-100">
            <div className="absolute top-4 left-4 bg-slate-100 text-naka-blue text-[10px] font-bold font-display px-3 py-1 rounded-[4px] uppercase tracking-[0.2em] border border-slate-200 z-10">
              Soft Close Metal
            </div>
            <img
              alt="Piston giảm chấn Soft-close kim loại chuyên dụng Nakao"
              className="max-h-full max-w-full object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNURQPbOSnlVeOnKNO-l_aWNC88FJk1yGSvhxgMG5Z43B-nYAnq4e3mg6lqFz9emBt-ZoKrJN6CHjcZuDVKw81ZzrXCU_pUu7qfKcTGDONmktFlQD2rIK1JZ7UVzlfYwUo7DzShLEFVmdxfhWfTXSipaJtZwg944dGANqgPTCmSAZOW0cbXDPpFGl4CPu_bgqU-V1T2XoBRuYJHp8Ioaqrfg7jWKd28EE6NS3TqXewtola-Cax9owCXgZuh7i_VzzfOjhthKcWgmCC"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h4 className="font-serif font-bold text-lg text-naka-blue mb-2">
              Bộ giảm chấn hơi K-150
            </h4>
            <p className="text-sm text-slate-500 font-display font-light mb-6 line-clamp-2 leading-relaxed">
              Công nghệ piston thủy lực (Soft-close) giúp triệt tiêu tiếng ồn va
              chạm, bảo vệ cấu trúc cửa.
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-8 mt-auto">
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  compress
                </span>{" "}
                Piston:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  Kim loại
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  timer
                </span>{" "}
                Tuổi thọ:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  100k lần
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  tune
                </span>{" "}
                Chỉnh lực:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  Có sẵn
                </span>
              </div>
              <div className="flex items-center text-xs text-[#555555] font-medium">
                <span className="material-symbols-outlined text-naka-blue text-base mr-2">
                  verified
                </span>{" "}
                Bảo hành:{" "}
                <span className="text-[#333333] ml-1 font-semibold">
                  24 tháng
                </span>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-[4px] border border-naka-blue text-naka-blue hover:bg-naka-blue hover:text-white font-bold font-display text-xs transition-all duration-300 tracking-[0.2em] uppercase flex items-center justify-center gap-2">
              Thông số kỹ thuật{" "}
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
