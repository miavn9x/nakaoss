"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function TeacherReviewPage() {
  const [htmlData, setHtmlData] = useState("");
  const [cssData, setCssData] = useState("");
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState<number | "">("");

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
      const savedHtml = localStorage.getItem("student_html") || "";
      const savedCss = localStorage.getItem("student_css") || "";
      setHtmlData(savedHtml);
      setCssData(savedCss);
    });
  }, []);

  const handleScore = () => {
    alert(
      `Đã chấm ${score} điểm cho sinh viên SV_001! (Dữ liệu này sẽ lưu vào DB)`,
    );
  };

  if (!mounted) return <div className="p-10">Đang tải...</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="hover:text-blue-200 flex items-center gap-2 font-medium"
          >
            <ArrowLeft size={18} /> Quay lại
          </Link>
          <span className="font-bold px-4 border-l border-blue-500 text-lg">
            Dashboard Giảng Viên Chấm Điểm
          </span>
        </div>
        <div className="bg-blue-800 px-3 py-1 rounded-md text-sm">
          Đang chấm: <span className="font-bold">Sinh viên SV_001</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Cột trái: Hiển thị giao diện sinh viên đã thiết kế */}
        <div className="flex-1 overflow-y-auto bg-gray-200 p-8 shadow-inner relative">
          <div className="max-w-5xl mx-auto bg-white min-h-full shadow-2xl rounded-sm border border-gray-300">
            {htmlData ? (
              <>
                <style dangerouslySetInnerHTML={{ __html: cssData }} />
                <div dangerouslySetInnerHTML={{ __html: htmlData }} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
                <span className="text-4xl mb-4">🤷‍♂️</span>
                <p>Sinh viên này chưa nộp bài.</p>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Panel chấm điểm */}
        <div className="w-80 bg-white border-l border-gray-300 shadow-xl flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              Chấm điểm
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Đánh giá kết quả Landing Page của sinh viên bằng GrapesJS.
            </p>
          </div>

          <div className="p-6 flex-1">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm số (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Nhập điểm..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét (Tùy chọn)
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Bố cục chuẩn, dùng nhiều plugin tốt..."
              ></textarea>
            </div>

            <button
              onClick={handleScore}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
            >
              Lưu kết quả & Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
