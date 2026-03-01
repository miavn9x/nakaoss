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
}

export const Toolbar: React.FC<ToolbarProps> = ({
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
}) => {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex gap-2">
        <button
          onClick={() => setDevice("desktop")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${device === "desktop" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        >
          PC
        </button>
        <button
          onClick={() => setDevice("ipad")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${device === "ipad" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        >
          iPad
        </button>
        <button
          onClick={() => setDevice("mobile")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${device === "mobile" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        >
          Mobile
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <button
          onClick={() => setScaleMode("fit")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${scaleMode === "fit" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          title="Tự động Thu nhỏ Canvas vừa khung hình làm việc"
          aria-label="Vừa vặn (Fit)"
        >
          🔎 Thu vừa khung ({Math.round(currentZoom * 100)}%)
        </button>

        <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden h-9">
          <button
            onClick={() => {
              setScaleMode("custom");
              setCurrentZoom((prev) => Math.max(0.1, prev - 0.1));
            }}
            className="px-3 h-full text-slate-600 hover:bg-slate-100 hover:text-indigo-600 font-bold"
            title="Thu nhỏ (-)"
          >
            -
          </button>
          <span className="px-2 text-sm font-medium text-slate-700 bg-slate-50 min-w-14 text-center h-full flex items-center justify-center border-x border-slate-200">
            {Math.round(currentZoom * 100)}%
          </span>
          <button
            onClick={() => {
              setScaleMode("custom");
              setCurrentZoom((prev) => Math.min(3, prev + 0.1));
            }}
            className="px-3 h-full text-slate-600 hover:bg-slate-100 hover:text-indigo-600 font-bold"
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
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${scaleMode === "100" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          title="Hiển thị đúng 100% kích thước pixel gốc"
          aria-label="100% Zoom"
        >
          Gốc (100%)
        </button>
      </div>

      <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
        {/* Change background IMAGE */}
        <div className="relative overflow-hidden group">
          <button
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm border border-slate-200"
            title="Chọn tải một ảnh nền mới từ máy tính"
          >
            📷 Tải Ảnh Nền
          </button>
          <input
            type="file"
            accept="image/*"
            aria-label="Tải ảnh nền mới"
            title="Tải ảnh nền mới"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Add IMAGE ELEMENT */}
        <div className="relative overflow-hidden group">
          <button
            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm border border-blue-200"
            title="Thêm một hình ảnh di động vào banner"
          >
            🖼️ Thêm Hình
          </button>
          <input
            type="file"
            accept="image/*"
            aria-label="Thêm hình ảnh vào banner"
            title="Thêm hình ảnh vào banner"
            onChange={onAddImage}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        <button
          onClick={addTextElement}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
          title="Thêm một khối văn bản mới"
        >
          + Thêm Chữ
        </button>

        <button
          onClick={onExport}
          className="ml-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm shadow-sm"
          title="Lưu cấu trúc banner hiện tại thành file JSON"
        >
          Lưu JSON
        </button>
      </div>
    </div>
  );
};
