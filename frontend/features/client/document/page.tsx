import React from "react";
import { Metadata } from "next";

import DocumentContact from "./components/DocumentContact";
import DocumentList from "./components/DocumentList";
import DocumentHero from "./components/DocumentHero";

export const generateMetadata = (): Metadata => {
  return {
    title: "Thư viện Tài liệu | Nakao Vietnam",
    description:
      "Tuyển tập các bản vẽ kỹ thuật, hướng dẫn lắp đặt và catalogue chi tiết về các giải pháp phụ kiện cửa chuẩn Nhật Bản.",
  };
};

export default function DocumentPage() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
        }

        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }

        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `,
        }}
      />
      <div className="bg-white text-[#141217] font-display min-h-screen flex flex-col items-center">
        <div className="relative flex h-full w-full flex-col overflow-x-hidden">
          <main className="layout-container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grow">
            <DocumentHero />
            <DocumentList />
            <DocumentContact />
          </main>
        </div>
      </div>
    </>
  );
}
