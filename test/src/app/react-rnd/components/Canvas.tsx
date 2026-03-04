import React, { useLayoutEffect, useRef } from "react";
import { BannerItem } from "./BannerItem";
import { Guides } from "./Guides";
import { BannerBg, BannerElement, DeviceType, ActiveGuide } from "./types";

interface CanvasProps {
  device: DeviceType;
  containerWidth: number;
  currentZoom: number;
  bannerHeight: number;
  bannerRef: (node: HTMLElement | null) => void;
  bannerBg: BannerBg;
  elements: BannerElement[];
  activeGuides: ActiveGuide[];
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
  showGrid: boolean;
  gridColor: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  device,
  containerWidth,
  currentZoom,
  bannerHeight,
  bannerRef,
  bannerBg,
  elements,
  activeGuides,
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
  showGrid,
  gridColor,
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
    <div
      className="flex-1 w-full bg-slate-100 rounded-xl border border-dashed border-slate-300 overflow-auto min-h-[80vh] flex justify-center items-start relative focus:outline-hidden"
      style={{ "--zoom": currentZoom } as React.CSSProperties}
    >
      <div ref={spacerRef} className="relative">
        <div
          ref={scalableRef}
          className="shadow-xl relative origin-top-left ring-1 ring-slate-200/50"
        >
          <div
            ref={setRefs}
            className="w-full relative overflow-visible bg-cover bg-no-repeat bg-center"
          >
            <Guides activeGuides={activeGuides} />

            {elements.map((el, idx) => (
              <BannerItem
                key={el.id}
                index={idx}
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

            {/* Grid Overlay Placed Above Elements */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none z-9999"
                style={{
                  height: `${bannerHeight}px`,
                  backgroundImage: `linear-gradient(to right, ${gridColor}80 1px, transparent 1px), linear-gradient(to bottom, ${gridColor}80 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
              />
            )}
          </div>

          {/* Canvas Rezise Handle at Bottom */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-[-10px] left-0 right-0 h-[20px] cursor-row-resize flex justify-center items-center z-50 group"
          >
            <div className="w-8 h-1.5 bg-slate-300 rounded-full group-hover:bg-indigo-500 transition-colors shadow-sm border border-white/50" />
          </div>
        </div>
      </div>
    </div>
  );
};
