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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeEl,
  updateSelected,
  onDelete,
  setBannerHeight,
  setBannerBg,
  device,
  resetElementRatio,
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
      <div className="w-full lg:w-80 editor-toolbar bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0 flex flex-col gap-5 h-max sticky top-4">
        <h3 className="font-bold text-slate-800 text-lg border-b pb-2">
          Cài đặt Banner
        </h3>

        <div className="space-y-4 pt-4 border-t">
          <button
            onClick={() => {
              setBannerBg({ type: "color", value: "#ffffff" });
              setBannerHeight(300);
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-2"
          >
            🔄 Reset Banner
          </button>
          <p className="text-[10px] text-slate-400 mt-1 text-center">
            Xóa ảnh nền và quay về mặc định
          </p>
        </div>

        <div className="text-sm text-slate-400 italic text-center py-6 bg-slate-50 rounded-lg mt-4 border border-dashed border-slate-200">
          Nhấp vào một phần tử trên khung để chỉnh sửa chi tiết
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 editor-toolbar bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0 flex flex-col gap-5 h-max sticky top-4">
      <h3 className="font-bold text-slate-800 text-lg border-b pb-2">
        Thuộc tính phần tử
      </h3>

      {/* Font & Text (Only for TEXT type) */}
      {activeEl.type === "text" && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Font Chữ
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs mb-1 block text-slate-500">
                Kích thước (Base)
              </span>
              <input
                type="number"
                title="Chỉnh sửa kích thước chữ"
                aria-label="Cỡ chữ"
                value={activeEl.fontSize || ""}
                onChange={(e) =>
                  handleUpdate({ fontSize: Number(e.target.value) || 0 })
                }
                className="w-full border p-1.5 text-sm rounded"
              />
            </div>
            <div>
              <span className="text-xs mb-1 block text-slate-500">Màu chữ</span>
              <div className="flex items-center gap-2 border rounded p-1">
                <input
                  type="color"
                  title="Chọn màu chữ"
                  aria-label="Màu chữ"
                  value={activeEl.color || "#000000"}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-xs uppercase text-slate-600 flex-1">
                  {activeEl.color}
                </span>
              </div>
            </div>
          </div>

          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => handleUpdate({ textAlign: "left" })}
              title="Căn trái"
              aria-label="Căn trái"
              className={`flex-1 p-2 flex justify-center ${activeEl.textAlign === "left" ? "bg-slate-200" : "hover:bg-slate-100"}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 10H3M21 6H3M21 14H3M17 18H3" />
              </svg>
            </button>
            <button
              onClick={() => handleUpdate({ textAlign: "center" })}
              title="Căn giữa"
              aria-label="Căn giữa"
              className={`flex-1 p-2 flex justify-center border-x ${activeEl.textAlign === "center" ? "bg-slate-200" : "hover:bg-slate-100"}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 10H6M21 6H3M21 14H3M18 18H6" />
              </svg>
            </button>
            <button
              onClick={() => handleUpdate({ textAlign: "right" })}
              title="Căn phải"
              aria-label="Căn phải"
              className={`flex-1 p-2 flex justify-center ${activeEl.textAlign === "right" ? "bg-slate-200" : "hover:bg-slate-100"}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10H7M21 6H3M21 14H3M21 18H7" />
              </svg>
            </button>
          </div>

          <select
            aria-label="Kiểu Font Chữ"
            title="Chọn kiểu chữ"
            value={activeEl.fontFamily}
            onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
            className="w-full border p-1.5 text-sm rounded bg-white"
          >
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="system-ui">System UI</option>
          </select>

          <label className="flex items-center gap-2 text-sm cursor-pointer mt-2 bg-slate-50 p-2 rounded">
            <input
              type="checkbox"
              checked={activeEl.fontWeight === "bold"}
              onChange={(e) =>
                handleUpdate({
                  fontWeight: e.target.checked ? "bold" : "normal",
                })
              }
              className="rounded"
            />
            <span>In đậm (Bold)</span>
          </label>
        </div>
      )}

      {/* Image Settings (Only for IMAGE type) */}
      {activeEl.type === "image" && (
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Hình Ảnh ({device.toUpperCase()})
          </label>
          <div className="relative overflow-hidden group w-full">
            <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border border-blue-200">
              🖼️ Thay đổi ảnh
            </button>
            <input
              type="file"
              accept="image/*"
              title={`Thay đổi file ảnh hiện tại cho ${device}`}
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
              className="w-full mt-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border border-slate-200"
              title="Đặt lại kích thước và tỉ lệ ảnh theo ảnh chuẩn"
            >
              🔄 Đặt lại kích thước gốc
            </button>
          )}

          <div>
            <span className="text-xs mb-1 block text-slate-500">
              Độ trong suốt (Opacity):{" "}
              {Math.round((activeEl.imageOpacity ?? 1) * 100)}%
            </span>
            <input
              type="range"
              title="Chỉnh độ trong suốt của ảnh"
              min="0"
              max="1"
              step="0.05"
              value={activeEl.imageOpacity ?? 1}
              onChange={(e) =>
                handleUpdate({ imageOpacity: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Box Styling (Shared) */}
      <div className="space-y-3 pt-4 border-t">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Khung & Màu Nền
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 border rounded p-1 text-sm bg-white cursor-pointer hover:bg-slate-50">
            <input
              type="color"
              title="Chọn màu nền thẻ"
              aria-label="Màu nền thẻ"
              value={
                activeEl.backgroundColor === "transparent"
                  ? "#ffffff"
                  : activeEl.backgroundColor
              }
              onChange={(e) =>
                handleUpdate({ backgroundColor: e.target.value })
              }
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
            />
            <span>Nền thẻ</span>
          </label>
          <button
            onClick={() => handleUpdate({ backgroundColor: "transparent" })}
            className="border rounded text-xs text-slate-500 hover:bg-slate-100"
          >
            Xóa nền
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs mb-1 block text-slate-500">
              Đệm viền (Padding)
            </span>
            <input
              type="range"
              title="Chỉnh cỡ đệm (Padding)"
              aria-label="Đệm viền (Padding)"
              min="0"
              max="64"
              value={activeEl.padding || 0}
              onChange={(e) =>
                handleUpdate({ padding: Number(e.target.value) || 0 })
              }
              className="w-full"
            />
          </div>
          <div>
            <span className="text-xs mb-1 block text-slate-500">
              Bo góc (Radius)
            </span>
            <input
              type="range"
              title="Chỉnh bo góc (Border Radius)"
              aria-label="Bo góc (Border Radius)"
              min="0"
              max="100"
              value={activeEl.borderRadius || 0}
              onChange={(e) =>
                handleUpdate({ borderRadius: Number(e.target.value) || 0 })
              }
              className="w-full"
            />
          </div>
        </div>

        <label className="flex items-center justify-between text-sm cursor-pointer bg-slate-50 p-2 rounded hover:bg-slate-100">
          <span className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activeEl.hasShadow}
              onChange={(e) => handleUpdate({ hasShadow: e.target.checked })}
              className="rounded"
            />
            Đổ bóng nền (Shadow)
          </span>
        </label>
      </div>

      {/* Borders */}
      <div className="space-y-3 pt-4 border-t">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Viền (Border)
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={activeEl.hasBorder}
            onChange={(e) => handleUpdate({ hasBorder: e.target.checked })}
            className="rounded"
          />
          <span className="font-medium text-slate-700">
            Bật viền xung quanh
          </span>
        </label>

        {activeEl.hasBorder && (
          <div className="grid grid-cols-2 gap-2 pl-6">
            <div>
              <span className="text-xs mb-1 block text-slate-500">Độ dày</span>
              <input
                type="number"
                title="Độ dày viền"
                aria-label="Chỉnh đồ dày viền"
                min="1"
                max="20"
                value={activeEl.borderWidth || ""}
                onChange={(e) =>
                  handleUpdate({
                    borderWidth: Number(e.target.value) || 0,
                  })
                }
                className="w-full border p-1 rounded text-sm"
              />
            </div>
            <div>
              <span className="text-xs mb-1 block text-slate-500">
                Màu viền
              </span>
              <input
                type="color"
                title="Chọn màu viền"
                aria-label="Màu viền"
                value={activeEl.borderColor || "#ffffff"}
                onChange={(e) => handleUpdate({ borderColor: e.target.value })}
                className="w-full h-7 rounded cursor-pointer border p-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t">
        <button
          onClick={() => onDelete(activeEl.id)}
          className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition-colors border border-red-200"
        >
          Xóa Khối Này
        </button>
      </div>
    </div>
  );
};
