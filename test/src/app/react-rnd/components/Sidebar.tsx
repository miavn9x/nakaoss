import { useCallback, useRef } from "react";
import { BannerElement, BannerBg, DeviceType } from "./types";

interface SidebarProps {
  activeEl: BannerElement | undefined;
  updateSelected: (newProps: Partial<BannerElement>) => void;
  onDelete: (id: string) => void;
  // Banner global props
  setBannerHeight: (h: number) => void;
  setBannerBg: (bg: BannerBg) => void;
  device: DeviceType;
  resetElementRatio?: (id: string, device: DeviceType) => void;
  onReset?: () => void;
  bringForward?: (id: string) => void;
  sendBackward?: (id: string) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
    {children}
  </label>
);

const InputField = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <span className="text-xs font-medium mb-1.5 block text-slate-500">
      {label}
    </span>
    <input
      {...props}
      className={`w-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all p-2 text-sm rounded-lg outline-none ${props.className || ""}`}
    />
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeEl,
  updateSelected,
  onDelete,
  setBannerHeight,
  setBannerBg,
  device,
  resetElementRatio,
  onReset,
  bringForward,
  sendBackward,
}) => {
  const pendingUpdatesRef = useRef<Partial<BannerElement>>({});
  const lastUpdateRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdate = useCallback(
    (newProps: Partial<BannerElement>) => {
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...newProps };

      const applyUpdate = () => {
        updateSelected(pendingUpdatesRef.current);
        pendingUpdatesRef.current = {};
        lastUpdateRef.current = performance.now();
      };

      const now = performance.now();
      if (now - lastUpdateRef.current >= 32) {
        // approx 30fps throttle for input dragging is perfectly smooth
        applyUpdate();
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(applyUpdate, 32);
      }
    },
    [updateSelected],
  );

  if (!activeEl) {
    return (
      <div className="w-full lg:w-[340px] bg-white p-6 border-l border-slate-200/80 shrink-0 flex flex-col gap-6 h-max sticky top-0 overflow-y-auto max-h-[calc(100vh-73px)] custom-scrollbar">
        <div>
          <h3 className="font-semibold text-slate-800 text-base tracking-tight mb-1">
            Cài đặt Banner
          </h3>
          <p className="text-xs text-slate-500">Cấu hình chung cho toàn khung</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              if (onReset) {
                onReset();
              } else {
                setBannerBg({ type: "color", value: "#ffffff" });
                setBannerHeight(300);
              }
            }}
            className="w-full py-2.5 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium rounded-xl transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
            Khôi phục mặc định
          </button>
        </div>

        <div className="text-sm text-slate-400 text-center py-8 bg-slate-50/50 rounded-xl mt-4 border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" /></svg>
          <span>Nhấp vào một phần tử trên khung<br />để chỉnh sửa chi tiết</span>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-sidebar w-full lg:w-[340px] bg-white p-4 border-l border-slate-200/80 shrink-0 flex flex-col gap-2 h-max sticky top-0 overflow-y-auto max-h-[calc(100vh-73px)] custom-scrollbar">
      <div>
        <h3 className="font-semibold text-slate-800 text-base tracking-tight mb-1">
          Thuộc tính phần tử
        </h3>
        <p className="text-xs text-slate-500">Tùy chỉnh chi tiết cho {activeEl.type === 'text' ? 'Văn bản' : activeEl.type === 'button' ? 'Nút bấm' : 'Hình ảnh'}</p>
      </div>

      {/* Font & Text (For TEXT and BUTTON type) */}
      {(activeEl.type === "text" || activeEl.type === "button") && (
        <div className={`space-y-4 pt-4 border-t border-slate-100 ${activeEl.isLocked ? "opacity-60 pointer-events-none" : ""}`}>
          <SectionLabel>Văn Bản</SectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Kích thước"
              type="number"
              value={activeEl.fontSize || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleUpdate({ fontSize: Number(e.target.value) || 0 })
              }
              disabled={activeEl.isLocked}
            />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-500">Màu chữ</span>
                <select
                  value={activeEl.textFillType || "color"}
                  onChange={(e) => handleUpdate({ textFillType: e.target.value as "color" | "gradient" })}
                  className="text-[10px] bg-transparent text-slate-500 font-medium outline-none cursor-pointer uppercase tracking-wide hover:text-indigo-600"
                  disabled={activeEl.isLocked}
                >
                  <option value="color">Màu Đơn</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>

              {activeEl.textFillType === "gradient" ? (() => {
                // Parse existing gradient or use defaults
                const gStr = activeEl.textGradient || "linear-gradient(to right, #ff0080, #7928ca)";
                const dirMatch = gStr.match(/linear-gradient\(([^,]+),/);
                const colorMatches = gStr.match(/#[0-9a-fA-F]{6}/g);
                const dir = dirMatch?.[1]?.trim() ?? "to right";
                const c1 = colorMatches?.[0] ?? "#ff0080";
                const c2 = colorMatches?.[1] ?? "#7928ca";
                const buildGradient = (d: string, a: string, b: string) =>
                  `linear-gradient(${d}, ${a}, ${b})`;
                return (
                  <div className="flex flex-col gap-2 border border-slate-200 bg-slate-50/50 rounded-lg p-2">
                    <select
                      value={dir}
                      onChange={(e) => handleUpdate({ textGradient: buildGradient(e.target.value, c1, c2) })}
                      disabled={activeEl.isLocked}
                      className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded outline-none cursor-pointer"
                    >
                      <option value="to right">→ Trái sang Phải</option>
                      <option value="to left">← Phải sang Trái</option>
                      <option value="to bottom">↓ Trên xuống Dưới</option>
                      <option value="to top">↑ Dưới lên Trên</option>
                      <option value="135deg">↘ Chéo (135°)</option>
                      <option value="45deg">↗ Chéo (45°)</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <div className="relative w-7 h-7 rounded-md overflow-hidden border border-slate-200 shadow-sm shrink-0">
                          <input
                            type="color"
                            value={c1}
                            disabled={activeEl.isLocked}
                            onChange={(e) => handleUpdate({ textGradient: buildGradient(dir, e.target.value, c2) })}
                            className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">Màu 1</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <div className="relative w-7 h-7 rounded-md overflow-hidden border border-slate-200 shadow-sm shrink-0">
                          <input
                            type="color"
                            value={c2}
                            disabled={activeEl.isLocked}
                            onChange={(e) => handleUpdate({ textGradient: buildGradient(dir, c1, e.target.value) })}
                            className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">Màu 2</span>
                      </label>
                    </div>
                    <div
                      className="w-full h-5 rounded shadow-inner border border-slate-200/60"
                      style={{ background: buildGradient(dir, c1, c2) }}
                    />
                  </div>
                );
              })() : (
                <div className={`flex items-center gap-2 border border-slate-200 bg-slate-50/50 rounded-lg p-1.5 transition-colors ${!activeEl.isLocked ? "focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20" : ""}`}>
                  <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                    <input
                      type="color"
                      value={activeEl.color || "#000000"}
                      onChange={(e) => handleUpdate({ color: e.target.value })}
                      disabled={activeEl.isLocked}
                      className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none disabled:cursor-not-allowed"
                    />
                  </div>
                  <span className="text-xs font-medium uppercase text-slate-600 truncate">
                    {activeEl.color}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Alignment & Format Bar */}
          <div>
            <span className="text-xs font-medium mb-1.5 block text-slate-500">Định dạng & Căn lề</span>
            <div className="flex gap-1 p-0.5 border border-slate-200 bg-slate-50/50 rounded-lg overflow-hidden">
              {/* B / I / U */}
              <button
                onClick={() => handleUpdate({ fontWeight: activeEl.fontWeight === "bold" ? "normal" : "bold" })}
                className={`flex-1 py-1.5 flex justify-center rounded-md transition-all font-bold text-sm ${activeEl.fontWeight === "bold" ? "bg-white shadow-sm text-indigo-600 border border-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"}`}
                title="In đậm (Bold)"
              >B</button>
              <button
                onClick={() => handleUpdate({ fontStyle: activeEl.fontStyle === "italic" ? "normal" : "italic" })}
                className={`flex-1 py-1.5 flex justify-center rounded-md transition-all italic text-sm ${activeEl.fontStyle === "italic" ? "bg-white shadow-sm text-indigo-600 border border-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"}`}
                title="In nghiêng (Italic)"
              >I</button>
              <button
                onClick={() => handleUpdate({ textDecoration: activeEl.textDecoration === "underline" ? "none" : "underline" })}
                className={`flex-1 py-1.5 flex justify-center rounded-md transition-all underline text-sm ${activeEl.textDecoration === "underline" ? "bg-white shadow-sm text-indigo-600 border border-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"}`}
                title="Gạch chân (Underline)"
              >U</button>

              {/* Separator */}
              <div className="w-px bg-slate-200 mx-0.5 self-stretch" />

              {/* Alignments */}
              {[
                { id: "left", icon: <path d="M17 10H3M21 6H3M21 14H3M17 18H3" />, title: "Căn trái" },
                { id: "center", icon: <path d="M18 10H6M21 6H3M21 14H3M18 18H6" />, title: "Căn giữa" },
                { id: "right", icon: <path d="M21 10H7M21 6H3M21 14H3M21 18H7" />, title: "Căn phải" },
                { id: "justify", icon: <path d="M21 10H3M21 6H3M21 14H3M21 18H3" />, title: "Căn đều" },
              ].map((align) => (
                <button
                  key={align.id}
                  onClick={() => handleUpdate({ textAlign: align.id as "left" | "center" | "right" | "justify" })}
                  className={`flex-1 py-1.5 flex justify-center rounded-md transition-all ${activeEl.textAlign === align.id ? "bg-white shadow-sm text-indigo-600 border border-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"}`}
                  title={align.title}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {align.icon}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium mb-1.5 block text-slate-500">Kiểu chữ</span>
            <select
              value={activeEl.fontFamily}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              className="w-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all p-2.5 text-sm rounded-lg outline-none appearance-none cursor-pointer"
            >
              <optgroup label="Cơ bản (Sans-serif)">
                <option value="sans-serif">Sans Serif</option>
                <option value="Arial, Helvetica, sans-serif">Arial</option>
                <option value="Verdana, Geneva, sans-serif">Verdana</option>
                <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
                <option value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</option>
              </optgroup>
              <optgroup label="Cơ bản (Serif)">
                <option value="serif">Serif</option>
                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Garamond, serif">Garamond</option>
              </optgroup>
              <optgroup label="Hiện đại (Modern)">
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="system-ui">Của hệ thống (System UI)</option>
              </optgroup>
              <optgroup label="Đặc biệt (Monospace/Cursive)">
                <option value="monospace">Monospace (Mã code)</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
                <option value="cursive">Cursive (Nét chữ tay)</option>
                <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans</option>
              </optgroup>
            </select>
          </div>
        </div>
      )}

      {/* Image Settings */}
      {activeEl.type === "image" && (
        <div className={`space-y-4 pt-4 border-t border-slate-100 ${activeEl.isLocked ? "opacity-60 pointer-events-none" : ""}`}>
          <SectionLabel>
            Hình Ảnh <span className="text-indigo-500">({device.toUpperCase()})</span>
          </SectionLabel>

          <div className="relative overflow-hidden group w-full">
            <button className="w-full px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-indigo-100 shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              Thay đổi ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              disabled={activeEl.isLocked}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const url = ev.target?.result as string;
                    handleUpdate({
                      imageUrls: {
                        ...(activeEl.imageUrls || {
                          desktop: activeEl.imageUrl || "",
                          ipad: activeEl.imageUrl || "",
                          mobile: activeEl.imageUrl || "",
                        }),
                        [device]: url,
                      } as Record<DeviceType, string>,
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          {resetElementRatio && (
            <button
              onClick={() => resetElementRatio(activeEl.id, device)}
              disabled={activeEl.isLocked}
              className="w-full px-4 py-2.5 bg-white text-slate-700 hover:text-indigo-600 hover:bg-slate-50 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-slate-200 shadow-sm disabled:cursor-not-allowed"
              title="Đặt lại tỉ lệ đúng hình ảnh gốc"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
              Khôi phục tỷ lệ gốc
            </button>
          )}

          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-600">
                Độ trong suốt
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {Math.round((activeEl.imageOpacity ?? 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={activeEl.imageOpacity ?? 1}
              disabled={activeEl.isLocked}
              onChange={(e) =>
                handleUpdate({ imageOpacity: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      )}

      {/* Button Settings (Only for BUTTON type) */}
      {activeEl.type === "button" && (
        <div className={`space-y-4 pt-4 border-t border-slate-100 ${activeEl.isLocked ? "opacity-60 pointer-events-none" : ""}`}>
          <SectionLabel>Thuộc Tính Nút Bấm</SectionLabel>

          <InputField
            label="Liên kết (Link URL)"
            type="url"
            placeholder="https://..."
            value={activeEl.buttonLink || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleUpdate({ buttonLink: e.target.value })
            }
            disabled={activeEl.isLocked}
          />

          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-4">
            <span className="text-xs font-semibold text-slate-600 block mb-2">Màu sắc khi di chuột (Hover)</span>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 transition-colors rounded-xl p-2.5 text-sm cursor-pointer shadow-sm">
                <div className="relative w-5 h-5 rounded-md overflow-hidden border border-slate-200 shrink-0 bg-white">
                  <input
                    type="color"
                    value={activeEl.hoverBgColor || "#4338ca"}
                    onChange={(e) => handleUpdate({ hoverBgColor: e.target.value })}
                    className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <span className="font-medium text-slate-600 text-xs text-center leading-tight">Màu<br />Nền</span>
              </label>

              <label className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 transition-colors rounded-xl p-2.5 text-sm cursor-pointer shadow-sm">
                <div className="relative w-5 h-5 rounded-md overflow-hidden border border-slate-200 shrink-0 bg-white">
                  <input
                    type="color"
                    value={activeEl.hoverTextColor || "#ffffff"}
                    onChange={(e) => handleUpdate({ hoverTextColor: e.target.value })}
                    className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <span className="font-medium text-slate-600 text-xs text-center leading-tight">Màu<br />Chữ</span>
              </label>
            </div>

            {activeEl.hasBorder && (
              <label className="flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 transition-colors rounded-xl p-2.5 text-sm cursor-pointer shadow-sm w-[calc(50%-6px)]">
                <div className="relative w-5 h-5 rounded-md overflow-hidden border border-slate-200 shrink-0 bg-white">
                  <input
                    type="color"
                    value={activeEl.hoverBorderColor || "transparent"}
                    onChange={(e) => handleUpdate({ hoverBorderColor: e.target.value })}
                    className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <span className="font-medium text-slate-600 text-xs text-center leading-tight">Màu<br />Viền</span>
              </label>
            )}

          </div>
        </div>
      )}

      {/* Box Styling */}
      <div className={`space-y-4 pt-4 border-t border-slate-100 ${activeEl.isLocked ? "opacity-60 pointer-events-none" : ""}`}>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Khung & nền hiển thị</h4>

        {/* Background Fill UI */}
        {(() => {
          const bgFill = activeEl.backgroundFillType || "color";
          const bgGStr = activeEl.backgroundGradient || "linear-gradient(to right, #6366f1, #8b5cf6)";
          const bgDirMatch = bgGStr.match(/linear-gradient\(([^,]+),/);
          const bgColorMatches = bgGStr.match(/#[0-9a-fA-F]{6}/g);
          const bgDir = bgDirMatch?.[1]?.trim() ?? "to right";
          const bgC1 = bgColorMatches?.[0] ?? "#6366f1";
          const bgC2 = bgColorMatches?.[1] ?? "#8b5cf6";
          const buildBg = (d: string, a: string, b: string) => `linear-gradient(${d}, ${a}, ${b})`;
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Màu nền</span>
                <select
                  value={bgFill}
                  onChange={(e) => handleUpdate({ backgroundFillType: e.target.value as "color" | "gradient" })}
                  className="text-[10px] bg-transparent text-slate-500 font-medium outline-none cursor-pointer uppercase tracking-wide hover:text-indigo-600"
                  disabled={activeEl.isLocked}
                >
                  <option value="color">Màu Đơn</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>

              {bgFill === "gradient" ? (
                <div className="flex flex-col gap-2 border border-slate-200 bg-slate-50/50 rounded-lg p-2">
                  <select
                    value={bgDir}
                    onChange={(e) => handleUpdate({ backgroundGradient: buildBg(e.target.value, bgC1, bgC2) })}
                    disabled={activeEl.isLocked}
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded outline-none cursor-pointer"
                  >
                    <option value="to right">→ Trái sang Phải</option>
                    <option value="to left">← Phải sang Trái</option>
                    <option value="to bottom">↓ Trên xuống Dưới</option>
                    <option value="to top">↑ Dưới lên Trên</option>
                    <option value="135deg">↘ Chéo (135°)</option>
                    <option value="45deg">↗ Chéo (45°)</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative w-7 h-7 rounded-md overflow-hidden border border-slate-200 shadow-sm shrink-0">
                        <input type="color" value={bgC1} disabled={activeEl.isLocked}
                          onChange={(e) => handleUpdate({ backgroundGradient: buildBg(bgDir, e.target.value, bgC2) })}
                          className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">Màu 1</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <div className="relative w-7 h-7 rounded-md overflow-hidden border border-slate-200 shadow-sm shrink-0">
                        <input type="color" value={bgC2} disabled={activeEl.isLocked}
                          onChange={(e) => handleUpdate({ backgroundGradient: buildBg(bgDir, bgC1, e.target.value) })}
                          className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                      </div>
                      <span className="text-[10px] font-medium text-slate-500">Màu 2</span>
                    </label>
                  </div>
                  <div className="w-full h-5 rounded shadow-inner border border-slate-200/60" style={{ background: buildBg(bgDir, bgC1, bgC2) }} />
                  <button
                    onClick={() => handleUpdate({ backgroundGradient: undefined, backgroundFillType: "color", backgroundColor: "transparent" })}
                    className="text-[10px] text-red-500 hover:text-red-700 font-medium text-center"
                  >Xóa nền</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors rounded-xl p-3 text-sm cursor-pointer shadow-sm">
                    <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200 shrink-0 bg-white">
                      <input
                        type="color"
                        value={activeEl.backgroundColor === "transparent" ? "#ffffff" : activeEl.backgroundColor}
                        onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                        className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                      />
                    </div>
                    <span className="font-medium text-slate-600 text-xs text-center">Màu nền</span>
                  </label>
                  <button
                    onClick={() => handleUpdate({ backgroundColor: "transparent" })}
                    className="border border-slate-200 bg-white hover:bg-slate-50 hover:text-red-600 rounded-xl p-3 text-xs font-medium text-slate-600 transition-colors shadow-sm"
                  >
                    Xóa màu nền
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-5">

          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold text-slate-600">Bo góc (Radius)</span>
              <span className="text-xs font-medium text-slate-500">{activeEl.borderRadius || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="999"
              value={activeEl.borderRadius || 0}
              onChange={(e) =>
                handleUpdate({ borderRadius: Number(e.target.value) || 0 })
              }
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500 relative before:absolute before:inset-0 before:-top-2 before:-bottom-2"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm cursor-pointer bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 transition-colors">
          <input
            type="checkbox"
            checked={activeEl.hasShadow}
            onChange={(e) => handleUpdate({ hasShadow: e.target.checked })}
            className="peer h-4 w-4 shrink-0 rounded border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
          />
          <span className="font-medium text-slate-600">Đổ bóng (Shadow)</span>
        </label>

        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold text-slate-600">Góc xoay (Độ)</span>
              <span className="text-xs font-medium text-slate-500">{activeEl.rotation || 0}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={activeEl.rotation || 0}
              disabled={activeEl.isLocked}
              onChange={(e) => handleUpdate({ rotation: Number(e.target.value) || 0 })}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:cursor-not-allowed relative before:absolute before:inset-0 before:-top-2 before:-bottom-2"
            />
          </div>
          <div className={`flex gap-3 ${activeEl.isLocked ? "opacity-60 pointer-events-none" : ""}`}>
            <button
              onClick={() => handleUpdate({ flipX: !activeEl.flipX })}
              disabled={activeEl.isLocked}
              className={`flex-1 py-2 font-semibold rounded-lg transition-all border shadow-sm text-xs flex items-center justify-center gap-1.5 ${activeEl.flipX ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"}`}
              title="Lật Ngang"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8" /><path d="M12 3v18" /><path d="m3 12 3-3-3-3" /><path d="m21 12-3-3 3-3" /></svg>
              Lật Ngang
            </button>
            <button
              onClick={() => handleUpdate({ flipY: !activeEl.flipY })}
              disabled={activeEl.isLocked}
              className={`flex-1 py-2 font-semibold rounded-lg transition-all border shadow-sm text-xs flex items-center justify-center gap-1.5 ${activeEl.flipY ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"}`}
              title="Lật Dọc"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8v8" /><path d="M21 12H3" /><path d="m12 3-3 3-3-3" /><path d="m12 21-3-3 3-3" /></svg>
              Lật Dọc
            </button>
          </div>
        </div>
      </div>

      {/* Borders */}
      <div className={`space-y-4 pt-4 border-t border-slate-100 ${activeEl.isLocked ? "opacity-60 pointer-events-none" : ""}`}>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Viền element</h4>

        <label className="flex items-center gap-3 text-sm cursor-pointer bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 transition-colors">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={activeEl.hasBorder}
              onChange={(e) => handleUpdate({ hasBorder: e.target.checked })}
              className="peer h-4 w-4 shrink-0 rounded border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
            />
          </div>
          <span className="font-medium text-slate-600">Bật viền xung quanh</span>
        </label>

        {activeEl.hasBorder && (() => {
          const bFill = activeEl.borderFillType || "color";
          const bGStr = activeEl.borderGradient || "linear-gradient(to right, #ff0080, #7928ca)";
          const bDirMatch = bGStr.match(/linear-gradient\(([^,]+),/);
          const bColorMatches = bGStr.match(/#[0-9a-fA-F]{6}/g);
          const bDir = bDirMatch?.[1]?.trim() ?? "to right";
          const bc1 = bColorMatches?.[0] ?? "#ff0080";
          const bc2 = bColorMatches?.[1] ?? "#7928ca";
          const buildBG = (d: string, a: string, b: string) => `linear-gradient(${d}, ${a}, ${b})`;
          return (
            <div className="space-y-3 pl-2">
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label="Độ dày (px)"
                  type="number"
                  min="1"
                  max="20"
                  value={activeEl.borderWidth || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleUpdate({ borderWidth: Number(e.target.value) || 0 })
                  }
                />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-500">Màu viền</span>
                    <select
                      value={bFill}
                      onChange={(e) => handleUpdate({ borderFillType: e.target.value as "color" | "gradient" })}
                      className="text-[10px] bg-transparent text-slate-500 font-medium outline-none cursor-pointer uppercase tracking-wide hover:text-indigo-600"
                    >
                      <option value="color">Đơn</option>
                      <option value="gradient">Gradient</option>
                    </select>
                  </div>
                  {bFill === "gradient" ? (
                    <div className="flex flex-col gap-2 border border-slate-200 bg-slate-50/50 rounded-lg p-1.5">
                      <select
                        value={bDir}
                        onChange={(e) => handleUpdate({ borderGradient: buildBG(e.target.value, bc1, bc2) })}
                        className="w-full text-xs p-1 bg-white border border-slate-200 rounded outline-none cursor-pointer"
                      >
                        <option value="to right">→ T.sang P</option>
                        <option value="to left">← P.sang T</option>
                        <option value="to bottom">↓ Trên xuống</option>
                        <option value="to top">↑ Dưới lên</option>
                        <option value="135deg">↘ Chéo 135°</option>
                        <option value="45deg">↗ Chéo 45°</option>
                      </select>
                      <div className="grid grid-cols-2 gap-1.5">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <div className="relative w-6 h-6 rounded overflow-hidden border border-slate-200 shrink-0">
                            <input type="color" value={bc1}
                              onChange={(e) => handleUpdate({ borderGradient: buildBG(bDir, e.target.value, bc2) })}
                              className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                          </div>
                          <span className="text-[10px] text-slate-500">Màu 1</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <div className="relative w-6 h-6 rounded overflow-hidden border border-slate-200 shrink-0">
                            <input type="color" value={bc2}
                              onChange={(e) => handleUpdate({ borderGradient: buildBG(bDir, bc1, e.target.value) })}
                              className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" />
                          </div>
                          <span className="text-[10px] text-slate-500">Màu 2</span>
                        </label>
                      </div>
                      <div className="w-full h-3 rounded" style={{ background: buildBG(bDir, bc1, bc2) }} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 border border-slate-200 bg-slate-50/50 rounded-lg p-1.5 h-[38px] transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                      <div className="relative w-full h-full rounded border border-slate-200 overflow-hidden shadow-sm">
                        <input
                          type="color"
                          value={activeEl.borderColor || "#ffffff"}
                          onChange={(e) => handleUpdate({ borderColor: e.target.value })}
                          className="w-full h-full cursor-pointer block p-0 border-0 bg-transparent outline-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Layer Actions */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quản lý khối</h4>

        <div className={`grid grid-cols-2 gap-3 ${activeEl.isLocked ? "opacity-60 pointer-events-none" : ""}`}>
          {sendBackward && (
            <button
              onClick={() => sendBackward(activeEl.id)}
              disabled={activeEl.isLocked}
              className="py-3 px-2 bg-white text-slate-600 hover:bg-slate-50 font-semibold rounded-xl transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2 text-xs"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
              Lùi lớp
            </button>
          )}
          {bringForward && (
            <button
              onClick={() => bringForward(activeEl.id)}
              disabled={activeEl.isLocked}
              className="py-3 px-2 bg-white text-slate-600 hover:bg-slate-50 font-semibold rounded-xl transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2 text-xs"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              Tiến lớp
            </button>
          )}
        </div>

        <button
          onClick={() => updateSelected({ isLocked: !activeEl.isLocked })}
          className={`w-full py-2.5 font-semibold rounded-xl transition-all border shadow-sm text-sm flex items-center justify-center gap-2 ${activeEl.isLocked
            ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
            : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
        >
          {activeEl.isLocked ? (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> Mở khóa vị trí</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg> Khóa cố định</>
          )}
        </button>

        <button
          onClick={() => onDelete(activeEl.id)}
          disabled={activeEl.isLocked}
          className={`w-full mt-2 py-2.5 font-semibold rounded-xl transition-all border flex items-center justify-center gap-2 text-sm ${activeEl.isLocked
            ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
            : "bg-red-50/50 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 border-red-100"
            }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
          Xóa khối này
        </button>
      </div>
    </div>
  );
};
