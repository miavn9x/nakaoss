import React from "react";

interface ProductVideoProps {
  src?: string;
  title?: string;
}

export default function ProductVideo({
  src = "/product/NAKAO bản lề điều chỉnh 3 chiều (VNM) (1).mp4",
  title = "Video sản phẩm",
}: ProductVideoProps) {
  return (
    <div>
      <h3 className="text-lg font-serif font-bold text-naka-blue mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined" aria-hidden="true">
          play_circle
        </span>
        Video sản phẩm
      </h3>

      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black shadow-sm">
        <video
          className="w-full h-full object-contain"
          controls
          preload="metadata"
          title={title}
        >
          <source src={src} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
      </div>
    </div>
  );
}
