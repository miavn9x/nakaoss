import React, { useState, useCallback } from "react";
import { DeviceType, BannerElement, ElementBounds, deviceWidths, BannerBg } from "../types";
import { v4 as uuidv4 } from "uuid";

export function useElementsManager(
      elements: BannerElement[],
      setElements: React.Dispatch<React.SetStateAction<BannerElement[]>>,
      bannerHeights: Record<DeviceType, number>,
      setBannerHeights: React.Dispatch<React.SetStateAction<Record<DeviceType, number>>>,
      bannerBg: BannerBg,
      setBannerBg: React.Dispatch<React.SetStateAction<BannerBg>>
) {
      const [selectedId, setSelectedId] = useState<string | null>(null);

      const addTextElement = useCallback(() => {
            const newId = `text-${Date.now()}`;
            setElements((prev) => [
                  ...prev,
                  {
                        id: newId,
                        type: "text",
                        bounds: {
                              desktop: { leftPct: 0, topPct: 0, widthPct: 40, heightPct: 15 },
                              ipad: { leftPct: 0, topPct: 0, widthPct: 40, heightPct: 15 },
                              mobile: { leftPct: 0, topPct: 0, widthPct: 80, heightPct: 15 },
                        },
                        text: "Nhấp đúp để nhập văn bản...",
                        color: "#ffffff",
                        fontSize: 24,
                        textAlign: "center",
                        fontWeight: "normal",
                        fontFamily: "sans-serif",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        padding: 16,
                        borderRadius: 8,
                        hasBorder: false,
                        borderColor: "#ffffff",
                        borderWidth: 2,
                        hasShadow: false,
                        rotation: 0,
                        flipX: false,
                        flipY: false,
                  },
            ]);
            setSelectedId(newId);
      }, [setElements]);

      const addButtonElement = useCallback(() => {
            const newId = `button-${Date.now()}`;
            setElements((prev) => [
                  ...prev,
                  {
                        id: newId,
                        type: "button",
                        bounds: {
                              desktop: { leftPct: 40, topPct: 40, widthPct: 25, heightPct: 10 },
                              ipad: { leftPct: 40, topPct: 40, widthPct: 25, heightPct: 10 },
                              mobile: { leftPct: 25, topPct: 40, widthPct: 50, heightPct: 15 },
                        },
                        text: "NHẤP VÀO ĐÂY",
                        color: "#ffffff",
                        fontSize: 14,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontFamily: "sans-serif",
                        backgroundColor: "#4f46e5", // bg-indigo-600
                        padding: 10,
                        borderRadius: 8,
                        hasBorder: false,
                        borderColor: "#ffffff",
                        borderWidth: 2,
                        hasShadow: true,
                        rotation: 0,
                        flipX: false,
                        flipY: false,
                        buttonLink: "",
                        hoverBgColor: "#4338ca", // hover bg-indigo-700
                        hoverTextColor: "#f8fafc", // hover light text
                        hoverBorderColor: "transparent",
                  },
            ]);
            setSelectedId(newId);
      }, [setElements]);
      const addImageElement = useCallback((url: string, w: number, h: number) => {
            const newId = uuidv4();
            const ratio = w / h;
            const bounds: Partial<Record<DeviceType, ElementBounds>> = {};

            (["desktop", "ipad", "mobile"] as DeviceType[]).forEach((d) => {
                  const bannerW = deviceWidths[d];
                  const bannerH = bannerHeights[d];

                  let initialWidthPct = 30;
                  let initialHeightPct = 30;

                  if (w > bannerW || h > bannerH) {
                        if (ratio > 1) {
                              initialWidthPct = Math.min(80, (w / bannerW) * 100);
                              initialHeightPct = (((initialWidthPct / 100) * bannerW) / ratio / bannerH) * 100;

                              if (initialHeightPct > 80) {
                                    initialHeightPct = 80;
                                    initialWidthPct = (((initialHeightPct / 100) * bannerH * ratio) / bannerW) * 100;
                              }
                        } else {
                              initialHeightPct = Math.min(80, (h / bannerH) * 100);
                              initialWidthPct = (((initialHeightPct / 100) * bannerH * ratio) / bannerW) * 100;
                        }
                  } else {
                        initialWidthPct = (w / bannerW) * 100;
                        initialHeightPct = (h / bannerH) * 100;
                  }

                  bounds[d] = { leftPct: 0, topPct: 0, widthPct: initialWidthPct, heightPct: initialHeightPct };
            });

            setElements((prev) => [
                  ...prev,
                  {
                        id: newId,
                        type: "image",
                        bounds: bounds as Record<DeviceType, ElementBounds>,
                        text: "",
                        color: "#000000",
                        fontSize: 16,
                        textAlign: "center",
                        fontWeight: "normal",
                        fontFamily: "sans-serif",
                        imageUrl: url,
                        imageUrls: { desktop: url, ipad: url, mobile: url },
                        imageOpacity: 1,
                        backgroundColor: "transparent",
                        padding: 0,
                        borderRadius: 0,
                        hasBorder: false,
                        borderColor: "#ffffff",
                        borderWidth: 2,
                        hasShadow: false,
                        rotation: 0,
                  },
            ]);
            setSelectedId(newId);
      }, [bannerHeights, setElements]);

      const addImageAsBackground = useCallback((url: string, w: number, h: number) => {
            const ratio = w / h;
            const newId = `bg-${uuidv4()}`;
            const bounds: Partial<Record<DeviceType, ElementBounds>> = {};
            const newHeights = { ...bannerHeights };

            (["desktop", "ipad", "mobile"] as DeviceType[]).forEach((d) => {
                  const bannerW = deviceWidths[d];
                  const scaledHeight = Math.round(bannerW / ratio);

                  // Không ép tối thiểu 300px để hình nền có thể vừa khít tuyệt đối 100% không bị hở trắng
                  const targetBannerHeight = Math.max(50, scaledHeight);
                  newHeights[d] = targetBannerHeight;

                  bounds[d] = { leftPct: 0, topPct: 0, widthPct: 100, heightPct: 100 };
            });

            setBannerHeights(newHeights);

            const newBgElement: BannerElement = {
                  id: newId,
                  type: "image",
                  bounds: bounds as Record<DeviceType, ElementBounds>,
                  text: "",
                  color: "#000000",
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "normal",
                  fontFamily: "sans-serif",
                  imageUrl: url,
                  imageUrls: { desktop: url, ipad: url, mobile: url },
                  imageOpacity: 1,
                  backgroundColor: "transparent",
                  padding: 0,
                  borderRadius: 0,
                  hasBorder: false,
                  borderColor: "#ffffff",
                  borderWidth: 2,
                  hasShadow: false,
                  isLocked: true,
            };

            setElements((prev) => [newBgElement, ...prev]);
            setSelectedId(newId);
            setBannerBg({ type: "color", value: "transparent" });
      }, [bannerHeights, setBannerHeights, setBannerBg, setElements]);

      const updateElement = useCallback((id: string, newProps: Partial<BannerElement>) => {
            setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...newProps } : el)));
      }, [setElements]);

      const updateSelected = useCallback((newProps: Partial<BannerElement>) => {
            setElements((prevElements) => {
                  let updated = false;
                  const newElements = prevElements.map((el) => {
                        if (el.id === selectedId) {
                              updated = true;
                              return { ...el, ...newProps };
                        }
                        return el;
                  });
                  return updated ? newElements : prevElements;
            });
      }, [selectedId, setElements]);

      const deleteElement = useCallback((id: string) => {
            setElements((prev) => prev.filter((el) => el.id !== id));
            if (selectedId === id) {
                  setSelectedId(null);
            }
      }, [selectedId, setElements]);

      const bringForward = useCallback((id: string) => {
            setElements((prev) => {
                  const idx = prev.findIndex((e) => e.id === id);
                  if (idx === -1 || idx === prev.length - 1) return prev;
                  const newArr = [...prev];
                  const temp = newArr[idx];
                  newArr[idx] = newArr[idx + 1];
                  newArr[idx + 1] = temp;
                  return newArr;
            });
      }, [setElements]);

      const sendBackward = useCallback((id: string) => {
            setElements((prev) => {
                  const idx = prev.findIndex((e) => e.id === id);
                  if (idx <= 0) return prev;
                  const newArr = [...prev];
                  const temp = newArr[idx];
                  newArr[idx] = newArr[idx - 1];
                  newArr[idx - 1] = temp;
                  return newArr;
            });
      }, [setElements]);

      const resetElementRatio = useCallback((id: string, dev: DeviceType) => {
            setElements((prev) => {
                  const idx = prev.findIndex((e) => e.id === id);
                  if (idx === -1) return prev;
                  const el = prev[idx];
                  if (el.type !== "image") return prev;

                  const imgUrl = el.imageUrls?.[dev] || el.imageUrl;
                  if (!imgUrl) return prev;

                  const img = new Image();
                  img.src = imgUrl;

                  if (img.width && img.height) {
                        const ratio = img.width / img.height;
                        const bannerW = deviceWidths[dev];
                        const bannerH = bannerHeights[dev];

                        let wPct = 30;
                        let hPct = 30;

                        if (img.width > bannerW || img.height > bannerH) {
                              if (ratio > 1) {
                                    wPct = Math.min(80, (img.width / bannerW) * 100);
                                    hPct = (((wPct / 100) * bannerW) / ratio / bannerH) * 100;
                                    if (hPct > 80) {
                                          hPct = 80;
                                          wPct = (((hPct / 100) * bannerH * ratio) / bannerW) * 100;
                                    }
                              } else {
                                    hPct = Math.min(80, (img.height / bannerH) * 100);
                                    wPct = (((hPct / 100) * bannerH * ratio) / bannerW) * 100;
                              }
                        } else {
                              wPct = (img.width / bannerW) * 100;
                              hPct = (img.height / bannerH) * 100;
                        }

                        const newArr = [...prev];
                        newArr[idx] = {
                              ...el,
                              bounds: { ...el.bounds, [dev]: { ...el.bounds[dev], widthPct: wPct, heightPct: hPct } },
                        };
                        return newArr;
                  }
                  return prev;
            });
      }, [bannerHeights, setElements]);

      return {
            elements, setElements,
            selectedId, setSelectedId,
            addTextElement, addImageElement, addImageAsBackground, addButtonElement,
            updateElement, updateSelected, deleteElement,
            bringForward, sendBackward, resetElementRatio
      };
}
