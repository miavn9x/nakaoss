"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import type { Editor } from "grapesjs";

const GjsEditorWrapper = dynamic(
  () => import("../../components/GjsEditorWrapper"),
  { ssr: false },
);

export default function StudentBuilderPage() {
  const [mounted, setMounted] = useState(false);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const onEditor = (editor: Editor) => {
    setEditorInstance(editor);

    // Lấy bài cũ từ LocalStorage
    const savedHtml = localStorage.getItem("student_html");
    const savedCss = localStorage.getItem("student_css");
    const savedComponents = localStorage.getItem("student_gjs_components");
    const savedStyle = localStorage.getItem("student_gjs_styles");

    if (savedComponents && savedStyle) {
      editor.setComponents(JSON.parse(savedComponents));
      editor.setStyle(JSON.parse(savedStyle));
    } else if (savedHtml) {
      editor.setComponents(savedHtml);
      if (savedCss) editor.setStyle(savedCss);
    }
  };

  const handlePublish = () => {
    if (!editorInstance) return;
    const html = editorInstance.getHtml();
    const css = editorInstance.getCss();
    const components = JSON.stringify(editorInstance.getComponents());
    const styles = JSON.stringify(editorInstance.getStyle());

    localStorage.setItem("student_html", html);
    localStorage.setItem("student_css", css || "");
    localStorage.setItem("student_gjs_components", components);
    localStorage.setItem("student_gjs_styles", styles);

    alert("Lưu bài thành công! Giảng viên đã có thể xem.");
  };

  if (!mounted) {
    return <div className="p-10 text-center">Đang tải Workspace...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between z-50 relative shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hover:text-blue-400 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Quay lại
          </Link>
          <span className="font-semibold px-4 border-l border-gray-700">
            Workspace Sinh Viên: Bộ Kéo Thả GrapesJS
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-sm text-gray-400">Mô phỏng: SV_001</div>
          <button
            onClick={handlePublish}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm font-semibold"
          >
            Lưu bài nộp
          </button>
        </div>
      </div>
      <GjsEditorWrapper onEditor={onEditor} />
    </div>
  );
}
