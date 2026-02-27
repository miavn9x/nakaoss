"use client";

import React from "react";

const DocumentHero = () => {
  return (
    <div className="@container mb-16">
      <div className="flex flex-col lg:flex-row items-stretch overflow-hidden rounded bg-naka-blue text-white shadow-xl">
        <div className="w-full lg:w-5/12 bg-white flex items-center justify-center p-8 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9dNlY7STGAO0E_T-lw-obRr4rqnz3tRzJHW1_EbflgbLUn6xZ9Et8_G1zQe_nkbZZsIuhb89YWCvmj1L3xnCd0tSAQCsiEKK8y3r1nBpO9bJW-qooCNlNtLiFlb9c5t3IhvntpoYXmkUhfQYr2Q23yBU4hXxqBDQTgjsBlXUqoyuhpR4NTe8MwmfpkGb91NZz9EwjrZr-60ac9iADViJacx-rzy7VG940Y5Ykcn0_A4-BPQpBxI4FSV2C54k0GAtOSK_AIlhxGnNo')] bg-cover bg-center grayscale opacity-90 hover:grayscale-0 transition-all duration-700"></div>
        <div className="flex flex-col justify-center w-full lg:w-7/12 p-8 lg:p-12">
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
            THƯ VIỆN TÀI LIỆU NAKAO
          </h1>
          <div className="text-blue-100 text-base mb-8 leading-relaxed max-w-2xl">
            <p className="text-justify mb-4">
              Tuyển tập các bản vẽ kỹ thuật, hướng dẫn lắp đặt và catalogue chi
              tiết về các giải pháp phụ kiện cửa chuẩn Nhật Bản. Hỗ trợ tối đa
              cho nhà thầu, khối kiến trúc và xưởng mộc với tinh thần{" "}
              <strong>Monozukuri</strong> - sự tận tâm chế tác hoàn hảo trong
              từng chi tiết cơ khí.
            </p>
            <p className="text-center">
              <span className="italic font-semibold text-white">
                "Nakao Vietnam - CHI TIẾT ẨN GIẤU LÀM NÊN KIỆT TÁC"
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHero;
