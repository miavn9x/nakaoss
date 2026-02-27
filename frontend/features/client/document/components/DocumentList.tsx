"use client";

import React from "react";

const documents = [
  {
    category: "BẢN LỀ",
    title: "Bản vẽ CAD Bản lề âm 3D",
    desc: "Bản lề âm điều chỉnh 3 chiều (3D Adjustable Hinge) thế hệ mới, tối ưu hóa khả năng chịu lực và thẩm mỹ.",
    icon: "architecture",
    type: "PDF",
    updated: "10/2024",
  },
  {
    category: "RAY TRƯỢT",
    title: "HD Lắp đặt Ray trượt siêu êm",
    desc: "Hướng dẫn chi tiết quy trình lắp đặt hệ thống ray treo trên (Top hung) giảm chấn hai chiều, vận hành êm ái tuyệt đối.",
    icon: "settings_motion_mode",
    type: "PDF",
    updated: "01/2025",
  },
  {
    category: "HỆ THỐNG KÍN KHÍ",
    title: "Thông số kỹ thuật Air Tight System",
    desc: "Giải pháp cửa lùa đóng kín khí tự động, cách âm, cách nhiệt và ngăn bụi cho không gian y tế và phòng sạch.",
    icon: "wind_power",
    type: "PDF",
    updated: "11/2024",
  },
  {
    category: "CHẶN CỬA",
    title: "Chặn cửa triệt tiêu lực va đập",
    desc: "Tài liệu kỹ thuật cho dòng chặn cửa nam châm âm sàn với công nghệ hấp thụ lực va đập, bảo vệ cánh cửa.",
    icon: "door_back",
    type: "PDF",
    updated: "12/2024",
  },
];

const DocumentList = () => {
  return (
    <>
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-[#141217] text-2xl font-bold leading-tight tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-naka-blue"></span>
            Tài liệu kỹ thuật mới nhất
          </h2>
          <p className="text-[#716783] text-sm mt-2 ml-5">
            Cập nhật các dòng sản phẩm cốt lõi 2025
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="group bg-white rounded p-0 border border-gray-200 hover:border-naka-blue/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
          >
            <div className="p-6 pb-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-naka-blue flex items-center justify-center rounded-sm">
                    <span className="material-symbols-outlined">
                      {doc.icon}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {doc.category}
                    </span>
                    <h3 className="text-[#141217] text-lg font-bold leading-snug group-hover:text-naka-blue transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-naka-blue bg-blue-50 px-2 py-1 rounded">
                  {doc.type}
                </span>
              </div>
              <p className="text-[#716783] text-sm mb-4 line-clamp-2">
                {doc.desc}
              </p>
            </div>
            <div className="mt-auto px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b">
              <span className="text-xs text-[#716783] font-medium">
                Updated: {doc.updated}
              </span>
              <button className="text-naka-blue text-sm font-bold flex items-center gap-2 hover:bg-white hover:shadow-sm px-3 py-1.5 rounded transition-all">
                TẢI XUỐNG
                <span className="material-symbols-outlined text-[18px]">
                  download
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DocumentList;
