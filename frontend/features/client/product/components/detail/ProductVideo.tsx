import React from "react";

interface ProductVideoProps {
  /** Đường dẫn video local trong public/, ví dụ: "/product/video.mp4" */
  src?: string;
  title?: string;
}

export default function ProductVideo({
  src = "/product/NAKAO b\u1ea3n l\u1ec1 \u0111i\u1ec1u ch\u1ec9nh 3 chi\u1ec1u (VNM) (1).mp4",
  title = "Video s\u1ea3n ph\u1ea9m",
}: ProductVideoProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined" aria-hidden="true">
          play_circle
        </span>
        Video sản phẩm
      </h3>

      {/* aspect-video = 16/9 */}
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
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
