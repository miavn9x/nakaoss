import React, { useLayoutEffect, useRef } from "react";
import { BannerItem } from "./BannerItem";
import { BannerBg, BannerElement, DeviceType } from "./types";

interface CanvasProps {
  device: DeviceType;
  containerWidth: number;
  currentZoom: number;
  bannerHeight: number;
  bannerRef: (node: HTMLElement | null) => void;
  bannerBg: BannerBg;
  elements: BannerElement[];
  selectedId: string | null;
  pctToPx: (el: BannerElement) => {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  onDragStop: (id: string, d: { x: number; y: number }) => void;
  onResizeStop: (
    id: string,
    ref: HTMLElement,
    position: { x: number; y: number },
  ) => void;
  onSelect: (id: string) => void;
  updateElement: (id: string, newProps: Partial<BannerElement>) => void;
  onDelete: (id: string) => void;
  onDrag: (id: string, d: { x: number; y: number }) => void;
  onResize: (
    id: string,
    ref: HTMLElement,
    position: { x: number; y: number },
  ) => void;
  setBannerHeight: (h: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  device,
  containerWidth,
  currentZoom,
  bannerHeight,
  bannerRef,
  bannerBg,
  elements,
  selectedId,
  pctToPx,
  onDragStop,
  onResizeStop,
  onSelect,
  updateElement,
  onDelete,
  onDrag,
  onResize,
  setBannerHeight,
}) => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const scalableRef = useRef<HTMLDivElement>(null);
  const bannerInnerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Direct height resize logic
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = bannerHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;
      const deltaY = (moveEvent.clientY - startYRef.current) / currentZoom;
      const newHeight = Math.max(
        100,
        Math.round(startHeightRef.current + deltaY),
      );
      setBannerHeight(newHeight);
    };

    const onMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Apply dynamic styles via JS to bypass 'no-inline-styles' linting in JSX
  useLayoutEffect(() => {
    if (spacerRef.current) {
      spacerRef.current.style.width = `${containerWidth * currentZoom}px`;
      spacerRef.current.style.height = `${bannerHeight * currentZoom}px`;
    }
    if (scalableRef.current) {
      scalableRef.current.style.width = `${containerWidth}px`;
      scalableRef.current.style.transform = `scale(${currentZoom})`;
    }
    if (bannerInnerRef.current) {
      const s = bannerInnerRef.current.style;
      s.height = `${bannerHeight}px`;
      s.backgroundColor =
        bannerBg.type === "color" ? bannerBg.value : "transparent";
      s.backgroundImage =
        bannerBg.type === "gradient"
          ? bannerBg.value
          : bannerBg.type === "image"
            ? bannerBg.value
            : "none";
      s.backgroundSize = bannerBg.type === "image" ? "contain" : "cover";
    }
  }, [containerWidth, currentZoom, bannerHeight, bannerBg]);

  // Combine multiple refs for the banner container
  const setRefs = (node: HTMLDivElement | null) => {
    bannerInnerRef.current = node;
    bannerRef(node);
  };

  return (
    <div className="flex-1 w-full bg-slate-100 rounded-xl border border-dashed border-slate-300 overflow-auto min-h-[80vh] flex justify-center items-start relative focus:outline-hidden">
      <div ref={spacerRef} className="relative">
        <div
          ref={scalableRef}
          className="border shadow-lg bg-white relative origin-top-left"
        >
          <div
            ref={setRefs}
            className="w-full relative overflow-visible bg-cover bg-no-repeat bg-center"
          >
            {elements.map((el) => (
              <BannerItem
                key={el.id}
                device={device}
                el={el}
                isSelected={selectedId === el.id}
                currentZoom={currentZoom}
                containerWidth={containerWidth}
                pctToPx={pctToPx}
                onDragStop={onDragStop}
                onResizeStop={onResizeStop}
                onSelect={onSelect}
                updateElement={updateElement}
                onDelete={onDelete}
                onDrag={onDrag}
                onResize={onResize}
              />
            ))}

            {/* Canvas Rezise Handle at Bottom */}
            <div
              onMouseDown={handleResizeStart}
              className="absolute bottom-0 left-0 w-full h-1 bg-blue-400/0 hover:bg-blue-400 group cursor-s-resize z-30 transition-colors"
              title="Kéo để chỉnh chiều cao Banner"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-blue-500 text-white rounded-full p-0.5 shadow-md flex items-center justify-center pointer-events-none transition-opacity">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
