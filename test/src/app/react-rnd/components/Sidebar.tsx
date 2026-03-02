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
    <div className="editor-sidebar w-full lg:w-[340px] bg-white p-6 border-l border-slate-200/80 shrink-0 flex flex-col gap-6 h-max sticky top-0 overflow-y-auto max-h-[calc(100vh-73px)] custom-scrollbar">
      <div>
        <h3 className="font-semibold text-slate-800 text-base tracking-tight mb-1">
          Thuộc tính phần tử
        </h3>
        <p className="text-xs text-slate-500">Tùy chỉnh chi tiết cho {activeEl.type === 'text' ? 'Văn bản' : 'Hình ảnh'}</p>
      </div>

      {/* Font & Text (Only for TEXT type) */}
      {activeEl.type === "text" && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <SectionLabel>Văn Bản</SectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Kích thước"
              type="number"
              value={activeEl.fontSize || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleUpdate({ fontSize: Number(e.target.value) || 0 })
              }
            />
            <div>
              <span className="text-xs font-medium mb-1.5 block text-slate-500">Màu chữ</span>
              <div className="flex items-center gap-2 border border-slate-200 bg-slate-50/50 rounded-lg p-1.5 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                  <input
                    type="color"
                    value={activeEl.color || "#000000"}
                    onChange={(e) => handleUpdate({ color: e.target.value })}
                    className="absolute -top-4 -left-4 w-[100px] h-[100px] cursor-pointer"
                  />
                </div>
                <span className="text-xs font-medium uppercase text-slate-600 truncate">
                  {activeEl.color}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-medium mb-1.5 block text-slate-500">Căn lề</span>
            <div className="flex p-0.5 border border-slate-200 bg-slate-50/50 rounded-lg overflow-hidden">
              {[
                { id: "left", icon: <path d="M17 10H3M21 6H3M21 14H3M17 18H3" /> },
                { id: "center", icon: <path d="M18 10H6M21 6H3M21 14H3M18 18H6" /> },
                { id: "right", icon: <path d="M21 10H7M21 6H3M21 14H3M21 18H7" /> }
              ].map((align) => (
                <button
                  key={align.id}
                  onClick={() => handleUpdate({ textAlign: align.id as "left" | "center" | "right" })}
                  className={`flex-1 p-2 flex justify-center rounded-md transition-all ${activeEl.textAlign === align.id
                    ? "bg-white shadow-sm text-indigo-600 border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"
                    }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2364748b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="system-ui">System UI</option>
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm cursor-pointer mt-2 bg-slate-50/50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200/60 transition-colors">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={activeEl.fontWeight === "bold"}
                onChange={(e) =>
                  handleUpdate({
                    fontWeight: e.target.checked ? "bold" : "normal",
                  })
                }
                className="peer h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <span className="font-medium text-slate-700">In đậm (Bold)</span>
          </label>
        </div>
      )}

      {/* Image Settings */}
      {activeEl.type === "image" && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
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
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {resetElementRatio && (
            <button
              onClick={() => resetElementRatio(activeEl.id, device)}
              className="w-full px-4 py-2.5 bg-white text-slate-700 hover:text-indigo-600 hover:bg-slate-50 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-slate-200 shadow-sm"
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
              onChange={(e) =>
                handleUpdate({ imageOpacity: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      )}

      {/* Box Styling */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <SectionLabel>Khung & Nền hiển thị</SectionLabel>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors rounded-xl p-2 text-sm cursor-pointer">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm">
              <input
                type="color"
                value={
                  activeEl.backgroundColor === "transparent"
                    ? "#ffffff"
                    : activeEl.backgroundColor
                }
                onChange={(e) =>
                  handleUpdate({ backgroundColor: e.target.value })
                }
                className="absolute -top-4 -left-4 w-[100px] h-[100px] cursor-pointer"
              />
            </div>
            <span className="font-medium text-slate-600 text-xs">Màu nền</span>
          </label>
          <button
            onClick={() => handleUpdate({ backgroundColor: "transparent" })}
            className="border border-slate-200 bg-white hover:bg-slate-50 hover:text-red-600 rounded-xl text-xs font-medium text-slate-600 transition-colors"
          >
            Xóa màu nền
          </button>
        </div>

        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/50 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-600">Đệm viền (Padding)</span>
              <span className="text-xs font-bold text-slate-500">{activeEl.padding || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="64"
              value={activeEl.padding || 0}
              onChange={(e) =>
                handleUpdate({ padding: Number(e.target.value) || 0 })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-600">Bo góc (Radius)</span>
              <span className="text-xs font-bold text-slate-500">{activeEl.borderRadius || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={activeEl.borderRadius || 0}
              onChange={(e) =>
                handleUpdate({ borderRadius: Number(e.target.value) || 0 })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm cursor-pointer bg-slate-50/50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200/60 transition-colors">
          <input
            type="checkbox"
            checked={activeEl.hasShadow}
            onChange={(e) => handleUpdate({ hasShadow: e.target.checked })}
            className="peer h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
          />
          <span className="font-medium text-slate-700">Đổ bóng (Shadow)</span>
        </label>
      </div>

      {/* Borders */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <SectionLabel>Viền Element</SectionLabel>

        <label className="flex items-center gap-3 text-sm cursor-pointer bg-slate-50/50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200/60 transition-colors">
          <input
            type="checkbox"
            checked={activeEl.hasBorder}
            onChange={(e) => handleUpdate({ hasBorder: e.target.checked })}
            className="peer h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
          />
          <span className="font-medium text-slate-700">Bật viền xung quanh</span>
        </label>

        {activeEl.hasBorder && (
          <div className="grid grid-cols-2 gap-3 pl-2">
            <InputField
              label="Độ dày (px)"
              type="number"
              min="1"
              max="20"
              value={activeEl.borderWidth || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleUpdate({
                  borderWidth: Number(e.target.value) || 0,
                })
              }
            />
            <div>
              <span className="text-xs font-medium mb-1.5 block text-slate-500">
                Màu viền
              </span>
              <div className="flex items-center gap-2 border border-slate-200 bg-slate-50/50 rounded-lg p-1.5 h-[38px] transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <div className="relative w-full h-full rounded border border-slate-200 overflow-hidden shadow-sm">
                  <input
                    type="color"
                    value={activeEl.borderColor || "#ffffff"}
                    onChange={(e) => handleUpdate({ borderColor: e.target.value })}
                    className="absolute -top-4 -left-4 w-[200px] h-[200px] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layer Actions */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <SectionLabel>Quản lý Khối</SectionLabel>

        <div className="flex gap-3">
          {sendBackward && (
            <button
              onClick={() => sendBackward(activeEl.id)}
              className="flex-1 py-2 bg-white text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 text-xs font-semibold rounded-xl transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
              Lùi lớp
            </button>
          )}
          {bringForward && (
            <button
              onClick={() => bringForward(activeEl.id)}
              className="flex-1 py-2 bg-white text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 text-xs font-semibold rounded-xl transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
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
          className="w-full mt-2 py-2.5 bg-red-50/50 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 font-semibold rounded-xl transition-all border border-red-100 flex items-center justify-center gap-2 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
          Xóa khối này
        </button>
      </div>
    </div>
  );
};
