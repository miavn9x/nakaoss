import React, { useRef, useCallback } from "react";
import { DeviceType, BannerElement, deviceWidths } from "../types";

export function useCanvasInteractions(
      device: DeviceType,
      bannerHeight: number,
      updateBannerHeight: (h: number) => void,
      elements: BannerElement[],
      setElements: React.Dispatch<React.SetStateAction<BannerElement[]>>
) {
      const othersMaxBottomRef = useRef(0);
      const lastDragTimeRef = useRef(0);

      const pctToPx = useCallback((el: BannerElement) => {
            const width = deviceWidths[device];
            const height = bannerHeight;
            return {
                  x: (el.bounds[device].leftPct / 100) * width,
                  y: (el.bounds[device].topPct / 100) * height,
                  w: (el.bounds[device].widthPct / 100) * width,
                  h: (el.bounds[device].heightPct / 100) * height,
            };
      }, [device, bannerHeight]);

      const applyDynamicHeight = useCallback((
            movingId: string,
            currentMovingBottomPx: number,
            d: { x: number; y: number },
            newW?: number,
            newH?: number,
            isFinal?: boolean,
      ) => {
            const width = deviceWidths[device];
            const oldHeight = bannerHeight;

            const newHeight = Math.max(
                  300,
                  Math.ceil(currentMovingBottomPx),
                  othersMaxBottomRef.current,
            );

            const finalNewHeight = isFinal || newHeight > oldHeight ? newHeight : oldHeight;
            const threshold = isFinal ? 0.1 : 5;
            const heightActuallyChanged = Math.abs(finalNewHeight - oldHeight) >= threshold;

            if (!heightActuallyChanged) {
                  setElements((prev) => {
                        const index = prev.findIndex((item) => item.id === movingId);
                        if (index === -1) return prev;

                        const current = prev[index];
                        const nextLeft = (d.x / width) * 100;
                        const nextTop = (d.y / oldHeight) * 100;
                        const nextW = newW ? (newW / width) * 100 : current.bounds[device].widthPct;
                        const nextH = newH ? (newH / oldHeight) * 100 : current.bounds[device].heightPct;

                        if (
                              Math.abs(current.bounds[device].leftPct - nextLeft) < 0.01 &&
                              Math.abs(current.bounds[device].topPct - nextTop) < 0.01 &&
                              Math.abs(current.bounds[device].widthPct - nextW) < 0.01 &&
                              Math.abs(current.bounds[device].heightPct - nextH) < 0.01
                        ) {
                              return prev;
                        }

                        const newArr = [...prev];
                        newArr[index] = {
                              ...current,
                              bounds: {
                                    ...current.bounds,
                                    [device]: { leftPct: nextLeft, topPct: nextTop, widthPct: nextW, heightPct: nextH },
                              },
                        };
                        return newArr;
                  });
                  return;
            }

            const ratio = oldHeight / finalNewHeight;

            setElements((prev) =>
                  prev.map((e) => {
                        if (e.id === movingId) {
                              return {
                                    ...e,
                                    bounds: {
                                          ...e.bounds,
                                          [device]: {
                                                ...e.bounds[device],
                                                topPct: (d.y / finalNewHeight) * 100,
                                                heightPct: newH ? (newH / finalNewHeight) * 100 : e.bounds[device].heightPct * ratio,
                                                leftPct: (d.x / width) * 100,
                                                widthPct: newW ? (newW / width) * 100 : e.bounds[device].widthPct,
                                          },
                                    },
                              };
                        }
                        return {
                              ...e,
                              bounds: {
                                    ...e.bounds,
                                    [device]: {
                                          ...e.bounds[device],
                                          topPct: e.bounds[device].topPct * ratio,
                                          heightPct: e.bounds[device].heightPct * ratio,
                                    },
                              },
                        };
                  })
            );
            updateBannerHeight(finalNewHeight);
      }, [device, bannerHeight, updateBannerHeight, setElements]);

      const handleDrag = useCallback((id: string, d: { x: number; y: number }) => {
            const now = performance.now();
            if (now - lastDragTimeRef.current < 16) return;
            lastDragTimeRef.current = now;
            if (othersMaxBottomRef.current === 0 && elements.length > 1) {
                  const oldHeight = bannerHeight;
                  const others = elements.filter((e) => e.id !== id);
                  othersMaxBottomRef.current = others.length > 0
                        ? Math.max(...others.map((e) => (e.bounds[device].topPct / 100) * oldHeight + (e.bounds[device].heightPct / 100) * oldHeight))
                        : 0;
            }
            applyDynamicHeight(id, d.y + 100, d, undefined, undefined, false);
      }, [device, elements, bannerHeight, applyDynamicHeight]);

      const handleResize = useCallback((id: string, ref: HTMLElement, position: { x: number; y: number }) => {
            const now = performance.now();
            if (now - lastDragTimeRef.current < 16) return;
            lastDragTimeRef.current = now;

            if (othersMaxBottomRef.current === 0 && elements.length > 1) {
                  const oldHeight = bannerHeight;
                  const others = elements.filter((e) => e.id !== id);
                  othersMaxBottomRef.current = others.length > 0
                        ? Math.max(...others.map((e) => (e.bounds[device].topPct / 100) * oldHeight + (e.bounds[device].heightPct / 100) * oldHeight))
                        : 0;
            }

            const wMatch = ref.style.width.match(/([\d.]+)px/);
            const hMatch = ref.style.height.match(/([\d.]+)px/);
            const newW = wMatch ? parseFloat(wMatch[1]) : ref.offsetWidth;
            const newH = hMatch ? parseFloat(hMatch[1]) : ref.offsetHeight;
            const newBottomPx = position.y + newH;

            applyDynamicHeight(id, newBottomPx, position, newW, newH, false);
      }, [device, elements, bannerHeight, applyDynamicHeight]);

      const handleResizeStop = useCallback((id: string, ref: HTMLElement, position: { x: number; y: number }) => {
            const wMatch = ref.style.width.match(/([\d.]+)px/);
            const hMatch = ref.style.height.match(/([\d.]+)px/);
            const newW = wMatch ? parseFloat(wMatch[1]) : ref.offsetWidth;
            const newH = hMatch ? parseFloat(hMatch[1]) : ref.offsetHeight;
            const newBottomPx = position.y + newH;

            applyDynamicHeight(id, newBottomPx, position, newW, newH, true);
            othersMaxBottomRef.current = 0;
      }, [applyDynamicHeight]);

      const handleDragStop = useCallback((id: string, d: { x: number; y: number }) => {
            const el = elements.find((e) => e.id === id);
            if (!el) return;

            const oldHeight = bannerHeight;
            const elementHeightPx = (el.bounds[device].heightPct / 100) * oldHeight;
            const newBottomPx = d.y + elementHeightPx;

            applyDynamicHeight(id, newBottomPx, d, undefined, undefined, true);
      }, [device, elements, bannerHeight, applyDynamicHeight]);

      return { pctToPx, handleDrag, handleResize, handleResizeStop, handleDragStop };
}
