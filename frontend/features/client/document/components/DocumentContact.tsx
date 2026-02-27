"use client";

import React from "react";

const DocumentContact = () => {
  return (
    <div className="flex justify-center mb-12 w-full">
      <div className="w-full max-w-3xl bg-gray-50 border border-gray-200 rounded p-8 flex flex-col items-center justify-center text-center text-[#141217] relative overflow-hidden group">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
          <span className="material-symbols-outlined text-[150px]">
            support_agent
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-naka-blue z-10">
          Yêu cầu tư vấn kỹ thuật
        </h3>
        <p className="text-[#716783] text-sm mb-6 max-w-md z-10">
          Đội ngũ kỹ thuật Nakao sẵn sàng hỗ trợ giải đáp thắc mắc về lắp đặt và
          thông số sản phẩm.
        </p>
        <button className="bg-naka-blue text-white px-6 py-3 rounded font-bold text-sm shadow-lg hover:bg-naka-blue/90 transition-colors z-10">
          GỌI TƯ VẤN
        </button>
      </div>
    </div>
  );
};

export default DocumentContact;
