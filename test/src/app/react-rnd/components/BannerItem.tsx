import React, { useLayoutEffect, useRef, memo, useMemo } from "react";
import { Rnd } from "react-rnd";
import Image from "next/image";
import { BannerElement } from "./types";

interface BannerItemProps {
  el: BannerElement;
  isSelected: boolean;
  currentZoom: number;
  containerWidth: number;
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
    el,
    isSelected,
    currentZoom,
    containerWidth,
    pctToPx,
    onDragStop,
    onResizeStop,
    onSelect,
    updateElement,
    onDelete,
    onDrag,
    onResize,
  }: BannerItemProps) => {
    const px = pctToPx(el);
    const elementRef = useRef<HTMLDivElement>(null);
    const imageInnerRef = useRef<HTMLImageElement>(null);

    // Apply dynamic styles via JS to bypass 'no-inline-styles' linting
    useLayoutEffect(() => {
      if (elementRef.current) {
        const s = elementRef.current.style;
        s.color = el.color;
        s.textAlign = el.textAlign;
        s.fontWeight = el.fontWeight;
        s.fontFamily = el.fontFamily;
        s.backgroundColor = el.backgroundColor;
        s.padding = `${el.padding}px`;
        s.borderRadius = `${el.borderRadius}px`;
        s.border = el.hasBorder
          ? `${el.borderWidth}px solid ${el.borderColor}`
          : "none";
        s.boxShadow = el.hasShadow
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)"
          : "none";
        s.fontSize = `clamp(12px, ${(el.fontSize / 1000) * containerWidth}px, 120px)`;
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
      () =>
        isSelected
          ? {
              top: {
                width: "100%",
                height: "4px",
                left: 0,
                top: "-2px",
                cursor: "n-resize",
              },
              bottom: {
                width: "100%",
                height: "4px",
                left: 0,
                bottom: "-2px",
                cursor: "s-resize",
              },
              left: {
                width: "4px",
                height: "100%",
                top: 0,
                left: "-2px",
                cursor: "w-resize",
              },
              right: {
                width: "4px",
                height: "100%",
                top: 0,
                right: "-2px",
                cursor: "e-resize",
              },
              topLeft: {
                width: "14px",
                height: "14px",
                left: "-7px",
                top: "-7px",
                cursor: "nw-resize",
                zIndex: 1000,
              },
              topRight: {
                width: "14px",
                height: "14px",
                right: "-7px",
                top: "-7px",
                cursor: "ne-resize",
                zIndex: 1000,
              },
              bottomLeft: {
                width: "14px",
                height: "14px",
                left: "-7px",
                bottom: "-7px",
                cursor: "sw-resize",
                zIndex: 1000,
              },
              bottomRight: {
                width: "14px",
                height: "14px",
                right: "-7px",
                bottom: "-7px",
                cursor: "se-resize",
                zIndex: 1000,
              },
            }
          : {},
      [isSelected],
    );

    return (
      <Rnd
        key={el.id}
        size={{ width: px.w || "auto", height: px.h || "auto" }}
        position={{ x: px.x, y: px.y }}
        scale={currentZoom}
        lockAspectRatio={false}
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
        onDragStart={() => onSelect(el.id)}
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          topLeft: true,
          bottomLeft: true,
        }}
        className={`rnd-element group transition-none! ${isSelected ? "z-30 border-2 border-blue-400" : "z-10 border-2 border-transparent hover:border-white/50"}`}
        dragHandleClassName="draggable-area"
      >
        <div
          ref={elementRef}
          className="w-full h-full relative overflow-hidden flex items-center justify-center font-sans! draggable-area select-none"
          onMouseDown={() => {
            onSelect(el.id);
            // Do NOT stop propagation, otherwise Rnd won't start its own drag
          }}
          onClick={() => {
            // Fallback for selection if mousedown already passed
            onSelect(el.id);
          }}
        >
          {el.type === "text" ? (
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(e) =>
                updateElement(el.id, {
                  text: e.currentTarget.textContent || "",
                })
              }
              onBlur={() => {
                if (!el.text.trim()) {
                  onDelete(el.id);
                }
              }}
              className="outline-none min-h-[1em] wrap-break-word whitespace-pre-wrap cursor-text w-full h-full flex-1 flex flex-col justify-center"
            >
              {el.text}
            </div>
          ) : (
            <>
              {el.imageUrl ? (
                <Image
                  ref={imageInnerRef}
                  src={el.imageUrl}
                  alt="banner element"
                  fill
                  unoptimized
                  className="pointer-events-none object-cover"
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
