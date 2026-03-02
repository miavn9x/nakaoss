import React from "react";
import { DeviceType } from "./types";

interface ToolbarProps {
  device: DeviceType;
  setDevice: (d: DeviceType) => void;
  scaleMode: string;
  setScaleMode: (m: string) => void;
  currentZoom: number;
  setCurrentZoom: React.Dispatch<React.SetStateAction<number>>;
  addTextElement: () => void;
  addImageElement: (url: string, w: number, h: number) => void;
  onAddImageAsBackground: (url: string, w: number, h: number) => void;
  onExport: () => void;
  hasBackground?: boolean;
}

export const Toolbar = ({
  device,
  setDevice,
  scaleMode,
  setScaleMode,
  currentZoom,
  setCurrentZoom,
  addTextElement,
  addImageElement,
  onAddImageAsBackground,
  onExport,
  hasBackground,
}: ToolbarProps) => {
  const onAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          const imgUrl = ev.target.result as string;
          const img = new Image();
          img.onload = () => {
            addImageElement(imgUrl, img.width, img.height);
          };
          img.src = imgUrl;
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = "";
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          onAddImageAsBackground(result, img.width, img.height);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="editor-toolbar bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-8 py-4 flex items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setDevice("desktop")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${device === "desktop" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            PC
          </button>
          <button
            onClick={() => setDevice("ipad")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${device === "ipad" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            iPad
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${device === "mobile" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Mobile
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScaleMode("fit")}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all border outline-none ${scaleMode === "fit" ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"}`}
            title="Tự động Thu nhỏ Canvas vừa khung hình làm việc"
            aria-label="Vừa vặn (Fit)"
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              Vừa màn hình
            </span>
          </button>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-9">
            <button
              onClick={() => {
                setScaleMode("custom");
                setCurrentZoom((prev) => Math.max(0.1, prev - 0.1));
              }}
              className="px-3 h-full text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-bold transition-colors"
              title="Thu nhỏ (-)"
            >
              -
            </button>
            <span className="px-3 text-sm font-bold text-slate-700 bg-slate-50 min-w-[70px] text-center h-full flex items-center justify-center border-x border-slate-200">
              {Math.round(currentZoom * 100)}%
            </span>
            <button
              onClick={() => {
                setScaleMode("custom");
                setCurrentZoom((prev) => Math.min(3, prev + 0.1));
              }}
              className="px-3 h-full text-slate-500 hover:bg-slate-50 hover:text-indigo-600 font-bold transition-colors"
              title="Phóng to (+)"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              setScaleMode("100");
              setCurrentZoom(1);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all border outline-none ${scaleMode === "100" ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"}`}
            title="Hiển thị đúng 100% kích thước pixel gốc"
            aria-label="100% Zoom"
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
              100% (Gốc)
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Add BACKGROUND IMAGE */}
        <div className="relative overflow-hidden group">
          <button
            disabled={hasBackground}
            className={`px-5 py-2.5 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm border shadow-sm ${hasBackground
                ? "bg-slate-100/50 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-white hover:bg-slate-50 hover:text-indigo-600 text-slate-700 border-slate-200"
              }`}
            title={hasBackground ? "Chỉ được phép có 1 ảnh nền. Hãy xóa ảnh cũ để thêm mới." : "Chọn tải một ảnh nền mới từ máy tính"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            Tải Ảnh Nền
          </button>
          {!hasBackground && (
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>

        {/* Add IMAGE ELEMENT */}
        <div className="relative overflow-hidden group">
          <button
            className="px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm border border-indigo-100 shadow-sm"
            title="Thêm một hình ảnh di động vào banner"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            Thêm Ảnh
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={onAddImage}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <button
          onClick={addTextElement}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all text-sm shadow-md shadow-indigo-200 flex items-center gap-2 border border-indigo-600"
          title="Thêm một khối văn bản mới"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
          Thêm Chữ
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <button
          onClick={onExport}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 text-sm shadow-md shadow-emerald-200 border border-emerald-500"
          title="Lưu cấu trúc banner hiện tại thành file JSON"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Xuất JSON
        </button>
      </div>
    </div>
  );
};
