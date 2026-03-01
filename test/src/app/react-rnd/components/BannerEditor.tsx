"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import useMeasure from "react-use-measure";
import { DeviceType, BannerElement, BannerBg, deviceWidths } from "./types";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";

export default function BannerEditor() {
  // === 1. Responsive Measurement & Device State ===
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [bannerHeight, setBannerHeight] = useState(300);
  const [bannerRef] = useMeasure();

  // === 2. Banner Global State ===
  const [bannerBg, setBannerBg] = useState<BannerBg>({
    type: "color",
    value: "#ffffff",
  });

  // === 3. Zoom / Scale Status ===
  const [scaleMode, setScaleMode] = useState("fit"); // "fit" (tự ghép vừa màn) hoặc "100" (hiện đủ 100% tỷ lệ gốc)
  const [currentZoom, setCurrentZoom] = useState(1); // Mức zoom tính theo phần trăm (VD: 0.5 = 50%, 1 = 100%)

  // Khối element hiện đang được chọn để chỉnh sửa (Active Element)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // === 3. Elements Data State ===
  const [elements, setElements] = useState<BannerElement[]>([]);
  const othersMaxBottomRef = useRef(0); // Cache for non-moving elements' bounds

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Click ra ngoài canvas để bỏ chọn thẻ
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest(".rnd-element") ||
        (e.target as HTMLElement).closest(".editor-toolbar")
      ) {
        return;
      }
      setSelectedId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTextElement = () => {
    const newId = `text-${Date.now()}`;
    setElements([
      ...elements,
      {
        id: newId,
        type: "text",
        leftPct: 30, // Canh giữa hơn (30% + 40% width = 70% -> tâm 50%)
        topPct: 40,
        widthPct: 40,
        heightPct: 15,
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
      },
    ]);
    setSelectedId(newId);
  };

  const addImageElement = (url: string, w: number, h: number) => {
    const newId = `image-${Date.now()}`;
    const bannerW = deviceWidths[device];
    const bannerH = bannerHeight; // Lấy từ state bannerHeight hiện tại

    // 1. Tính toán chiều rộng khởi tạo (chiếm 30% banner width hoặc nhỏ hơn nếu ảnh bé)
    const initialWidthPct = Math.min(30, (w / bannerW) * 100);

    // 2. Tính toán chiều cao Phần trăm (PCT) cho đúng tỉ lệ thực của ảnh:
    // Vì đơn vị PCT được tính theo tỉ lệ (độ dài thực / độ dài trục tương ứng)
    // PCT_H = (H_ảnh / W_ảnh) * PCT_W * (Banner_W / Banner_H)
    const initialHeightPct = (h / w) * initialWidthPct * (bannerW / bannerH);

    setElements([
      ...elements,
      {
        id: newId,
        type: "image",
        leftPct: (100 - initialWidthPct) / 2, // Canh giữa ngang chính xác
        topPct: (100 - initialHeightPct) / 2, // Canh giữa dọc chính xác
        widthPct: initialWidthPct,
        heightPct: initialHeightPct,
        text: "", // Không dùng cho ảnh
        color: "#000000",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "normal",
        fontFamily: "sans-serif",
        imageUrl: url,
        imageOpacity: 1,
        backgroundColor: "transparent",
        padding: 0,
        borderRadius: 0,
        hasBorder: false,
        borderColor: "#ffffff",
        borderWidth: 2,
        hasShadow: false,
      },
    ]);
    setSelectedId(newId);
  };

  const addImageAsBackground = (url: string, w: number, h: number) => {
    const bannerW = deviceWidths[device];
    const ratio = h / w;
    const scaledHeight = bannerW * ratio;

    // Đặt chiều cao banner theo ảnh nếu ảnh quá cao, hoặc giữ tối thiểu 300px
    const targetBannerHeight = Math.max(300, scaledHeight);
    setBannerHeight(targetBannerHeight);

    const newId = `bg-${Date.now()}`;

    // Tính toán kích thước Phần trăm dựa trên bannerHeight mới
    // Nếu bannerHeight == scaledHeight, thì initialHeightPct sẽ là 100
    // Nếu bannerHeight > scaledHeight (do tối thiểu 300), thì nó sẽ < 100
    const initialWidthPct = 100;
    const initialHeightPct = (scaledHeight / targetBannerHeight) * 100;

    const newBgElement: BannerElement = {
      id: newId,
      type: "image",
      leftPct: 0,
      topPct: (100 - initialHeightPct) / 2, // Canh giữa dọc
      widthPct: initialWidthPct,
      heightPct: initialHeightPct,
      text: "",
      color: "#000000",
      fontSize: 16,
      textAlign: "center",
      fontWeight: "normal",
      fontFamily: "sans-serif",
      imageUrl: url,
      imageOpacity: 1,
      backgroundColor: "transparent",
      padding: 0,
      borderRadius: 0,
      hasBorder: false,
      borderColor: "#ffffff",
      borderWidth: 2,
      hasShadow: false,
    };

    // Thêm vào đầu mảng để nằm dưới cùng
    setElements([newBgElement, ...elements]);
    setSelectedId(newId);

    // Xóa màu nền gradient/image cũ của banner container
    setBannerBg({ type: "color", value: "transparent" });
  };

  const updateElement = useCallback(
    (id: string, newProps: Partial<BannerElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...newProps } : el)),
      );
    },
    [],
  );

  const updateSelected = (newProps: Partial<BannerElement>) => {
    if (!selectedId) return;
    updateElement(selectedId, newProps);
  };

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  // === 4. Conversion Helpers (Percent ↔ Pixel) ===
  const pctToPx = useCallback(
    (el: BannerElement) => {
      const width = deviceWidths[device];
      const height = bannerHeight;

      return {
        x: (el.leftPct / 100) * width,
        y: (el.topPct / 100) * height,
        w: (el.widthPct / 100) * width,
        h: (el.heightPct / 100) * height,
      };
    },
    [device, bannerHeight],
  );

  // --- Real-time height management ---
  const applyDynamicHeight = useCallback(
    (
      movingId: string,
      currentMovingBottomPx: number,
      d: { x: number; y: number },
      newW?: number,
      newH?: number,
      isFinal?: boolean,
    ) => {
      const width = deviceWidths[device];
      const oldHeight = bannerHeight;

      // 2. The target height is the max of (min-height, current-moving-bottom, others-bottoms)
      const newHeight = Math.max(
        300,
        Math.ceil(currentMovingBottomPx),
        othersMaxBottomRef.current,
      );

      // CRITICAL Performance Optimization (v2 & v3):
      // Only allow shrinking on final release (isFinal).
      // During real-time, only allow expansion to avoid percentage jitter.
      const finalNewHeight =
        isFinal || newHeight > oldHeight ? newHeight : oldHeight;

      // Use a loose threshold for real-time updates to prioritize drag 60FPS
      // Increased to 5px to be extremely aggressive against DOM churn
      const threshold = isFinal ? 0.1 : 5;
      const heightActuallyChanged =
        Math.abs(finalNewHeight - oldHeight) >= threshold;

      if (!heightActuallyChanged) {
        // IDENTITY STABILITY: Only update the moving element.
        // Doing this prevents every BannerItem from re-rendering via props change.
        setElements((prev) => {
          const index = prev.findIndex((item) => item.id === movingId);
          if (index === -1) return prev;

          const current = prev[index];
          const nextLeft = (d.x / width) * 100;
          const nextTop = (d.y / oldHeight) * 100;
          const nextW = newW ? (newW / width) * 100 : current.widthPct;
          const nextH = newH ? (newH / oldHeight) * 100 : current.heightPct;

          // Skip update if change is negligible
          if (
            Math.abs(current.leftPct - nextLeft) < 0.01 &&
            Math.abs(current.topPct - nextTop) < 0.01 &&
            Math.abs(current.widthPct - nextW) < 0.01 &&
            Math.abs(current.heightPct - nextH) < 0.01
          ) {
            return prev;
          }

          const newArr = [...prev];
          newArr[index] = {
            ...current,
            leftPct: nextLeft,
            topPct: nextTop,
            widthPct: nextW,
            heightPct: nextH,
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
              topPct: (d.y / finalNewHeight) * 100,
              heightPct: newH
                ? (newH / finalNewHeight) * 100
                : e.heightPct * ratio,
              leftPct: (d.x / width) * 100,
              widthPct: newW ? (newW / width) * 100 : e.widthPct,
            };
          }
          return {
            ...e,
            topPct: e.topPct * ratio,
            heightPct: e.heightPct * ratio,
          };
        }),
      );
      setBannerHeight(finalNewHeight);
    },
    [device, bannerHeight],
  );

  const lastDragTimeRef = useRef(0);

  const handleDrag = useCallback(
    (id: string, d: { x: number; y: number }) => {
      const now = performance.now();
      if (now - lastDragTimeRef.current < 16) return;
      lastDragTimeRef.current = now;
      if (othersMaxBottomRef.current === 0 && elements.length > 1) {
        const oldHeight = bannerHeight;
        const others = elements.filter((e) => e.id !== id);
        othersMaxBottomRef.current =
          others.length > 0
            ? Math.max(
                ...others.map(
                  (e) =>
                    (e.topPct / 100) * oldHeight +
                    (e.heightPct / 100) * oldHeight,
                ),
              )
            : 0;
      }
      applyDynamicHeight(id, d.y + 100, d, undefined, undefined, false);
    },
    [elements, bannerHeight, applyDynamicHeight],
  );

  const handleResizeStop = useCallback(
    (id: string, ref: HTMLElement, position: { x: number; y: number }) => {
      const newW = ref.offsetWidth;
      const newH = ref.offsetHeight;
      const newBottomPx = position.y + newH;

      applyDynamicHeight(id, newBottomPx, position, newW, newH, true);
      othersMaxBottomRef.current = 0; // Reset cache
    },
    [applyDynamicHeight],
  );

  const containerWidth = deviceWidths[device];
  const activeEl = elements.find((e) => e.id === selectedId);

  useEffect(() => {
    const calculateZoom = () => {
      if (scaleMode === "fit") {
        const availableWidth = window.innerWidth - 400;
        if (containerWidth > availableWidth) {
          let newZoom = availableWidth / containerWidth;
          newZoom = Math.max(0.1, Math.min(newZoom, 1));
          setCurrentZoom(newZoom);
        } else {
          setCurrentZoom(1);
        }
      } else if (scaleMode === "100") {
        setCurrentZoom(1);
      }
    };

    calculateZoom();
    window.addEventListener("resize", calculateZoom);
    return () => window.removeEventListener("resize", calculateZoom);
  }, [containerWidth, scaleMode]);

  const handleDragStop = useCallback(
    (id: string, d: { x: number; y: number }) => {
      const el = elements.find((e) => e.id === id);
      if (!el) return;

      const oldHeight = bannerHeight;
      const elementHeightPx = (el.heightPct / 100) * oldHeight;
      const newBottomPx = d.y + elementHeightPx;

      applyDynamicHeight(id, newBottomPx, d, undefined, undefined, true);
    },
    [elements, bannerHeight, applyDynamicHeight],
  );

  const handleExport = () => {
    const data = {
      bannerBg,
      bannerHeight,
      elements,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `banner-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* 1. Header/Toolbar */}
      <Toolbar
        device={device}
        setDevice={setDevice}
        scaleMode={scaleMode}
        setScaleMode={setScaleMode}
        currentZoom={currentZoom}
        setCurrentZoom={setCurrentZoom}
        addTextElement={addTextElement}
        addImageElement={addImageElement}
        onAddImageAsBackground={addImageAsBackground}
        onExport={handleExport}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Workspace Component */}
        <Canvas
          containerWidth={containerWidth}
          currentZoom={currentZoom}
          bannerHeight={bannerHeight}
          bannerRef={bannerRef}
          bannerBg={bannerBg}
          elements={elements}
          selectedId={selectedId}
          pctToPx={pctToPx}
          onDragStop={handleDragStop}
          onDrag={handleDrag}
          onResizeStop={handleResizeStop}
          onResize={handleResizeStop} // We reuse stop logic for live updates too, but throttled by applyDynamicHeight
          onSelect={setSelectedId}
          updateElement={updateElement}
          onDelete={deleteElement}
          setBannerHeight={setBannerHeight}
        />

        {/* Properties Sidebar Component */}
        <Sidebar
          activeEl={activeEl}
          updateSelected={updateSelected}
          onDelete={deleteElement}
          setBannerHeight={setBannerHeight}
          setBannerBg={setBannerBg}
        />
      </div>
    </div>
  );
}
