import Link from "next/link";
import { PenTool, CheckSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans p-6 text-gray-900">
      <main className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-900">
          Hệ Thống Thiết Kế Landing Page
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Mô phỏng hệ thống cho phép sinh viên kéo thả thiết kế và giảng viên
          chấm điểm từ xa sử dụng Puck Editor.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/builder" className="group">
            <div className="bg-white border-2 border-transparent hover:border-blue-500 rounded-2xl p-8 shadow-lg transition-all transform hover:-translate-y-1 h-full flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                <PenTool size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Giao diện Sinh Viên</h2>
              <p className="text-gray-500 text-sm">
                Vào không gian làm việc. Sử dụng công cụ kéo thả để thiết kế
                Landing Page và nộp bài.
              </p>
            </div>
          </Link>

          <Link href="/teacher" className="group">
            <div className="bg-white border-2 border-transparent hover:border-green-500 rounded-2xl p-8 shadow-lg transition-all transform hover:-translate-y-1 h-full flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="bg-green-100 p-4 rounded-full mb-4 text-green-600 group-hover:scale-110 transition-transform">
                <CheckSquare size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Dashboard Giảng Viên</h2>
              <p className="text-gray-500 text-sm">
                Đăng nhập để xem danh sách bài nộp, review giao diện thực tế và
                chấm điểm.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
