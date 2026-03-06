"use client";

import React, { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import { Toolbar } from "./Toolbar";
import { Sidebar } from "./Sidebar";
import { Canvas } from "./Canvas";
import { BannerElement } from "./types";

import { useDeviceState } from "./hooks/useDeviceState";
import { useZoom } from "./hooks/useZoom";
import { useElementsManager } from "./hooks/useElementsManager";
import { useCanvasInteractions } from "./hooks/useCanvasInteractions";
import { useEditorActions } from "./hooks/useEditorActions";
import { useHistory } from "./hooks/useHistory";

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

  // We need to initialize state at the top to break the circular dependency
  const [elements, setElements] = useState<BannerElement[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [gridColor, setGridColor] = useState("#000000");

  const {
    past, future, recordHistory, undo, redo
  } = useHistory(elements, bannerBg, setElements, setBannerBg);

  const {
    selectedId, setSelectedId,
    addTextElement,
    addButtonElement,
    addImageElement,
    addImageAsBackground,
    updateElement, updateSelected, deleteElement,
    bringForward, sendBackward, resetElementRatio
  } = useElementsManager(elements, setElements, bannerHeights, setBannerHeights, bannerBg, setBannerBg);

  const {
    pctToPx, handleDrag, handleResize, handleResizeStop, handleDragStop, activeGuides
  } = useCanvasInteractions(device, bannerHeight, updateBannerHeight, elements, setElements, bannerBg, recordHistory);

  const { handleExport, handleReset } = useEditorActions(
    bannerBg, bannerHeights, elements, setElements, setBannerHeights, setBannerBg, setSelectedId
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or contenteditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo(elements, bannerBg);
        } else {
          e.preventDefault();
          undo(elements, bannerBg);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo(elements, bannerBg);
      }

      // Keyboard Nudging (Arrow keys)
      if (selectedId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();

        const activeEl = elements.find(el => el.id === selectedId);
        if (!activeEl || activeEl.isLocked) return;

        const KEY_NUDGE_SPEED = e.shiftKey ? 10 : 1; // 10px if Shift is held, else 1px
        const currentPx = pctToPx(activeEl);

        let newX = currentPx.x;
        let newY = currentPx.y;

        if (e.key === 'ArrowUp') newY -= KEY_NUDGE_SPEED;
        if (e.key === 'ArrowDown') newY += KEY_NUDGE_SPEED;
        if (e.key === 'ArrowLeft') newX -= KEY_NUDGE_SPEED;
        if (e.key === 'ArrowRight') newX += KEY_NUDGE_SPEED;

        // Immediately update position via drag logic structure
        handleDragStop(selectedId, { x: newX, y: newY });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, bannerBg, undo, redo, selectedId, pctToPx, handleDragStop]);

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
  const hasBackground = elements.some((el) => el.id.startsWith("bg-"));

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
        addButtonElement={addButtonElement}
        addImageElement={addImageElement}
        onAddImageAsBackground={addImageAsBackground}
        onExport={handleExport}
        hasBackground={hasBackground}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onUndo={() => undo(elements, bannerBg)}
        onRedo={() => redo(elements, bannerBg)}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        gridColor={gridColor}
        setGridColor={setGridColor}
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
          activeGuides={activeGuides}
          selectedId={selectedId}
          pctToPx={pctToPx}
          onDragStop={handleDragStop}
          onDrag={handleDrag}
          onResizeStop={handleResizeStop}
          onResize={handleResize}
          onSelect={setSelectedId}
          updateElement={updateElement}
          onDelete={deleteElement}
          showGrid={showGrid}
          gridColor={gridColor}
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
