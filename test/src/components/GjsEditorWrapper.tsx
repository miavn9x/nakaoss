"use client";

import { useEffect, useRef } from "react";
import grapesjs, { type Editor } from "grapesjs";
import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";
import gjsPluginForms from "grapesjs-plugin-forms";
import gjsComponentCountdown from "grapesjs-component-countdown";
import gjsPluginExport from "grapesjs-plugin-export";
import gjsTabs from "grapesjs-tabs";
import "grapesjs/dist/css/grapes.min.css";

interface GjsEditorWrapperProps {
  onEditor: (editor: Editor) => void;
}

export default function GjsEditorWrapper({ onEditor }: GjsEditorWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load plugins dynamically mapped
    const pluginList = [
      gjsPresetWebpage,
      gjsBlocksBasic,
      gjsPluginForms,
      gjsComponentCountdown,
      gjsPluginExport,
      gjsTabs,
    ].map(
      (plugin: unknown) => (plugin as { default?: unknown })?.default || plugin,
    );

    // Bypassing @grapesjs/react to render the full classic UI
    const editor = grapesjs.init({
      container: containerRef.current,
      height: "100%",
      width: "100%",
      storageManager: false,
      // @ts-expect-error plugin type definitions in GrapesJS are incomplete for arrays of plugins
      plugins: pluginList,
    });

    onEditor(editor);

    return () => {
      editor.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
