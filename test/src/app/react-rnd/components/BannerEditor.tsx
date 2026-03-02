"use client";

import React, { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";

import { useDeviceState } from "./hooks/useDeviceState";
import { useZoom } from "./hooks/useZoom";
import { useElementsManager } from "./hooks/useElementsManager";
import { useCanvasInteractions } from "./hooks/useCanvasInteractions";
import { useEditorActions } from "./hooks/useEditorActions";

export default function BannerEditor() {
  const [isClient, setIsClient] = useState(false);
  const [bannerRef] = useMeasure();

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const {
    device, setDevice,
    bannerHeights, setBannerHeights,
    bannerHeight, updateBannerHeight,
    bannerBg, setBannerBg,
  } = useDeviceState();

  const {
    scaleMode, setScaleMode,
    currentZoom, setCurrentZoom,
    containerWidth
  } = useZoom(device, bannerHeight);

  const {
    elements, setElements,
    selectedId, setSelectedId,
    addTextElement, addImageElement, addImageAsBackground,
    updateElement, updateSelected, deleteElement,
    bringForward, sendBackward, resetElementRatio
  } = useElementsManager(bannerHeights, setBannerHeights, setBannerBg);

  const {
    pctToPx, handleDrag, handleResize, handleResizeStop, handleDragStop
  } = useCanvasInteractions(device, bannerHeight, updateBannerHeight, elements, setElements);

  const { handleExport, handleReset } = useEditorActions(
    bannerBg, bannerHeight, elements, setElements, setBannerHeights, setBannerBg, setSelectedId
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest(".rnd-element") ||
        (e.target as HTMLElement).closest(".editor-toolbar") ||
        (e.target as HTMLElement).closest(".editor-sidebar")
      ) {
        return;
      }
      setSelectedId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSelectedId]);

  if (!isClient) return null;

  const activeEl = elements.find((e) => e.id === selectedId);

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
          device={device}
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
          onResize={handleResize}
          onSelect={setSelectedId}
          updateElement={updateElement}
          onDelete={deleteElement}
          setBannerHeight={updateBannerHeight}
        />

        {/* Properties Sidebar Component */}
        <Sidebar
          activeEl={activeEl}
          updateSelected={updateSelected}
          onDelete={deleteElement}
          setBannerHeight={updateBannerHeight}
          setBannerBg={setBannerBg}
          device={device}
          resetElementRatio={resetElementRatio}
          onReset={handleReset}
          bringForward={bringForward}
          sendBackward={sendBackward}
        />
      </div>
    </div>
  );
}
