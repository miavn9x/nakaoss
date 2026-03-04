import React, { useLayoutEffect, useRef, memo, useMemo, useState } from "react";
import { Rnd } from "react-rnd";
import Image from "next/image";
import { BannerElement, DeviceType } from "./types";

interface BannerItemProps {
  device: DeviceType;
  el: BannerElement;
  isSelected: boolean;
  currentZoom: number;
  containerWidth: number;
  index: number;
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
}

export const BannerItem = memo(
  ({
    device,
    el,
    isSelected,
    currentZoom,
    containerWidth,
    index,
    pctToPx,
    onDragStop,
    onResizeStop,
    onSelect,
    updateElement,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDelete: _onDelete,
    onDrag,
    onResize,
  }: BannerItemProps) => {
    const px = pctToPx(el);
    const [isEditing, setIsEditing] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const borderOverlayRef = useRef<HTMLDivElement>(null);
    const imageInnerRef = useRef<HTMLImageElement>(null);
    const [isCornerDrag, setIsCornerDrag] = useState(true);

    // Apply dynamic styles via JS to bypass 'no-inline-styles' linting
    useLayoutEffect(() => {
      if (elementRef.current) {
        const s = elementRef.current.style;
        // Note: color, fontFamily, fontWeight, textAlign, fontSize are applied
        // directly on the inner text div to avoid conflicting with gradient mode.
        s.padding = `${el.padding}px`;

        // ─── Background (independent from border) ──────────────────────────
        if (el.backgroundFillType === "gradient" && el.backgroundGradient) {
          s.backgroundColor = "";
          s.backgroundImage = el.backgroundGradient;
        } else {
          s.backgroundColor = el.backgroundColor;
          s.backgroundImage = "";
        }
        s.backgroundClip = "";
        s.backgroundOrigin = "";

        // ─── Solid border on elementRef (gradient border is on overlay div) ─────
        s.borderRadius = `${el.borderRadius}px`;
        s.borderImage = "";
        if (el.hasBorder && el.borderFillType !== "gradient") {
          s.border = `${el.borderWidth}px solid ${el.borderColor}`;
        } else {
          s.border = "none";
        }

        s.boxShadow = el.hasShadow
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)"
          : "none";
      }

      // ─── Gradient border via CSS Mask (overlay div) ─────────────────────────
      // Technique: fill overlay div with gradient, then mask out the center
      // leaving only the border-width ring visible. Supports border-radius
      // and is fully independent from the element's background.
      if (borderOverlayRef.current) {
        const bo = borderOverlayRef.current.style;
        if (el.hasBorder && el.borderFillType === "gradient" && el.borderGradient) {
          const bw = el.borderWidth;
          const br = el.borderRadius;
          bo.display = "block";
          bo.background = el.borderGradient;
          bo.borderRadius = `${br}px`;
          // CSS mask ring technique:
          // 1. Fill overlay with gradient
          // 2. padding = borderWidth defines the ring thickness
          // 3. mask subtracts the content-box (inner area) from the full area
          //    leaving only the padding ring visible
          bo.padding = `${bw}px`;
          bo.boxSizing = "border-box";
          const maskValue = "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)";
          bo.webkitMask = maskValue;
          bo.webkitMaskComposite = "destination-out";
          (bo as unknown as Record<string, string>).mask = maskValue;
          (bo as unknown as Record<string, string>).maskComposite = "exclude";
        } else {
          bo.display = "none";
        }
      }
      if (imageInnerRef.current) {
        imageInnerRef.current.style.opacity = (el.imageOpacity ?? 1).toString();
      }
    }, [el, containerWidth]);

    const handleClasses = useMemo(
      () =>
        isSelected
          ? {
            top: "rnd-handle handle-side-v handle-n",
            right: "rnd-handle handle-side-h handle-e",
            bottom: "rnd-handle handle-side-v handle-s",
            left: "rnd-handle handle-side-h handle-w",
            topRight: "rnd-handle handle-corner handle-ne",
            bottomRight: "rnd-handle handle-corner handle-se",
            bottomLeft: "rnd-handle handle-corner handle-sw",
            topLeft: "rnd-handle handle-corner handle-nw",
          }
          : {},
      [isSelected],
    );

    const handleStyles = useMemo(
      () => {
        const cornerSize = 10 / currentZoom;
        const cornerOffset = -cornerSize / 2;
        const edgeThickness = 3 / currentZoom;
        const edgeOffset = -edgeThickness / 2;

        return isSelected
          ? {
            top: {
              width: "100%",
              height: `${edgeThickness}px`,
              left: 0,
              top: `${edgeOffset}px`,
              cursor: "n-resize",
            },
            bottom: {
              width: "100%",
              height: `${edgeThickness}px`,
              left: 0,
              bottom: `${edgeOffset}px`,
              cursor: "s-resize",
            },
            left: {
              width: `${edgeThickness}px`,
              height: "100%",
              top: 0,
              left: `${edgeOffset}px`,
              cursor: "w-resize",
            },
            right: {
              width: `${edgeThickness}px`,
              height: "100%",
              top: 0,
              right: `${edgeOffset}px`,
              cursor: "e-resize",
            },
            topLeft: {
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              left: `${cornerOffset}px`,
              top: `${cornerOffset}px`,
              cursor: "nw-resize",
              zIndex: 1000,
            },
            topRight: {
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              right: `${cornerOffset}px`,
              top: `${cornerOffset}px`,
              cursor: "ne-resize",
              zIndex: 1000,
            },
            bottomLeft: {
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              left: `${cornerOffset}px`,
              bottom: `${cornerOffset}px`,
              cursor: "sw-resize",
              zIndex: 1000,
            },
            bottomRight: {
              width: `${cornerSize}px`,
              height: `${cornerSize}px`,
              right: `${cornerOffset}px`,
              bottom: `${cornerOffset}px`,
              cursor: "se-resize",
              zIndex: 1000,
            },
          }
          : {};
      },
      [isSelected, currentZoom],
    );

    return (
      <Rnd
        key={el.id}
        size={{ width: px.w || "auto", height: px.h || "auto" }}
        position={{ x: px.x, y: px.y }}
        scale={currentZoom}
        lockAspectRatio={el.type === "image" && isCornerDrag}
        resizeHandleClasses={handleClasses}
        resizeHandleStyles={handleStyles}
        onDragStop={(e, d) => onDragStop(el.id, d)}
        onDrag={(e, d) => onDrag(el.id, d)}
        onResizeStop={(e, dir, ref, delta, position) =>
          onResizeStop(el.id, ref, position)
        }
        onResize={(e, dir, ref, delta, position) =>
          onResize(el.id, ref, position)
        }
        onResizeStart={(e, dir) => {
          onSelect(el.id);
          if (el.type === "image") {
            const corners = [
              "topLeft",
              "topRight",
              "bottomLeft",
              "bottomRight",
            ];
            setIsCornerDrag(corners.includes(dir));
          }
        }}
        onDragStart={() => onSelect(el.id)}
        disableDragging={el.isLocked}
        enableResizing={
          el.isLocked
            ? false
            : {
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              topLeft: true,
              bottomLeft: true,
            }
        }
        className={`rnd-element group transition-none! ${isSelected ? "ring-2 ring-blue-500" : "ring-2 ring-transparent hover:ring-white/50"}`}
        style={{
          zIndex: index,
          borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined
        }}
        dragHandleClassName={el.isLocked ? "" : "draggable-area"}
      >
        <div
          ref={elementRef}
          className={`w-full h-full relative overflow-hidden flex items-center justify-center ${el.isLocked || isEditing ? "" : "draggable-area"}`}
          onMouseDown={(e) => {
            if (isEditing) e.stopPropagation();
            onSelect(el.id);
          }}
          onDoubleClick={() => {
            if (el.type === "text") setIsEditing(true);
          }}
        >
          {/* Gradient border overlay using CSS mask technique — independent from background */}
          <div ref={borderOverlayRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />
          {el.type === "text" ? (
            <div
              ref={(node) => {
                if (node && isEditing && document.activeElement !== node) {
                  // Wait for next tick to ensure contentEditable is applied before focusing
                  setTimeout(() => {
                    node.focus();
                  }, 0);
                }
              }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onFocus={(e) => {
                // Auto-clear the default placeholder to let the user type immediately
                if (el.text === "Nhấp đúp để nhập văn bản...") {
                  e.currentTarget.textContent = "";
                }
              }}
              onBlur={(e) => {
                setIsEditing(false);
                const val = e.currentTarget.textContent || "";
                if (!val.trim()) {
                  // Khôi phục chữ mặc định nếu lỡ xóa hết thay vì tự động xóa element
                  updateElement(el.id, { text: "Nhập văn bản..." });
                } else if (val !== el.text) {
                  updateElement(el.id, { text: val });
                }
              }}
              className={`outline-none min-h-[1em] wrap-break-word whitespace-pre-wrap w-full h-full flex flex-col justify-center ${isEditing ? "cursor-text select-text" : "cursor-pointer select-none"}`}
              style={{
                fontFamily: el.fontFamily,
                fontWeight: el.fontWeight,
                fontStyle: el.fontStyle ?? "normal",
                textDecoration: el.textDecoration ?? "none",
                textAlign: el.textAlign as React.CSSProperties["textAlign"],
                fontSize: `clamp(12px, ${(el.fontSize / 1000) * containerWidth}px, 120px)`,
                ...(el.textFillType === "gradient" ? {
                  backgroundImage: el.textGradient || "linear-gradient(to right, #ff7eb3, #ff758c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  backgroundClip: "text"
                } : {
                  color: el.color
                })
              }}
            >
              {el.text}
            </div>
          ) : (
            <>
              {el.imageUrl || el.imageUrls ? (
                <Image
                  ref={imageInnerRef}
                  src={el.imageUrls?.[device] || el.imageUrl || ""}
                  alt="banner element"
                  fill
                  unoptimized
                  className="pointer-events-none object-fill"
                />
              ) : (
                <div className="text-slate-400 text-xs">No Image</div>
              )}
            </>
          )}
        </div>
      </Rnd>
    );
  },
);

BannerItem.displayName = "BannerItem";
