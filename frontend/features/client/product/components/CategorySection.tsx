import React from "react";

export default function CategorySection() {
  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold text--naka-blue mb-10 tracking-wide uppercase">
          Danh Mục Linh Kiện Kỹ Thuật
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 border-b border-gray-200 pb-1 max-w-4xl mx-auto">
          <button className="px-4 py-4 text--naka-blue font-bold border-b-2 border--naka-blue transition-all duration-300 text-lg tracking-wide uppercase">
            Linh kiện Cửa trượt
          </button>
          <button className="px-4 py-4 text-gray-500 hover:text--naka-blue font-medium border-b-2 border-transparent hover:border-gray-300 transition-all duration-300 text-lg tracking-wide uppercase">
            Hệ Orido
          </button>
          <button className="px-4 py-4 text-gray-500 hover:text--naka-blue font-medium border-b-2 border-transparent hover:border-gray-300 transition-all duration-300 text-lg tracking-wide uppercase">
            Phụ kiện Cửa mở
          </button>
          <button className="px-4 py-4 text-gray-500 hover:text--naka-blue font-medium border-b-2 border-transparent hover:border-gray-300 transition-all duration-300 text-lg tracking-wide uppercase">
            Vách ngăn Di động
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div className="group bg-white rounded-[8px] p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] border border-gray-100 hover:border--naka-blue/30 cursor-pointer transition-all duration-300 flex flex-col items-center">
          <span className="text-sm font-semibold text--naka-blue mb-4 text-center group-hover:text-[#152c5b] transition-colors uppercase tracking-wide">
            Bản lề thủy lực
          </span>
          <div className="w-full aspect-square bg-white rounded-lg mb-2 flex items-center justify-center p-2 overflow-hidden">
            <img
              alt="Bản lề sàn inox mờ kỹ thuật Nakao"
              className="w-full h-full object-contain rounded-lg opacity-90 group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhoDRhnXmQeju3Y5ool_4ZKvoB-5noBUFL58Ct38xltzTS6IW1Rt_xID0zRgg9T3B5jYXbtp7tMgE12a_Z-nAbBHOaqan16pg430NoVk7GHf2YYQ0byAsWunoG9EUCRKjQO2_6SyfHWp4RtHttJxCjvTSGEZ4E7DWMol_O_TfaA5_L-c_vbPbV-vStfOkDIdv4Tv0tvVTdn4-YWNePq_0l7FnWHBAhtw6uSYlyeyozOSVhfjKLPFKToeso0vhkJVntY7DA3k5pwYAh"
            />
          </div>
        </div>
        <div className="group bg-white rounded-[8px] p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] border border-gray-100 hover:border--naka-blue/30 cursor-pointer transition-all duration-300 flex flex-col items-center">
          <span className="text-sm font-semibold text-gray-600 mb-4 text-center group-hover:text--naka-blue transition-colors uppercase tracking-wide">
            Con lăn treo
          </span>
          <div className="w-full aspect-square bg-white rounded-lg mb-2 flex items-center justify-center p-2 overflow-hidden">
            <img
              alt="Cụm bánh xe treo trục bi kim loại sắc nét Nakao"
              className="w-full h-full object-contain rounded-lg opacity-90 group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1oSMTRpJVFNVJilPZIzgvjf9eLcSmaz9Xst5hiUufbV30D8MpmKyD_rVcK9sH7lodtkWQY-AB5ixKvZka0nuQ2naurW1yrvDR0NtNDJS7B5DdZEDPqPULpLQ2UIqTt4qCzsP5rJZqF_g_YzFYrB2hj6bdvwSHJIwX8YcePQgCfqJKy88ogGciwFC6Ks3zEh50gIXARCnnvyfwmBRvfi9gTf9_AMeYOgwh6UcuLF2v6fIdXGAGzxKLd-YF1jnFd62704mi0BwF12KQ"
            />
          </div>
        </div>
        <div className="group bg--naka-blue text-white rounded-[8px] p-5 shadow-xl border border--naka-blue cursor-pointer transition-all duration-300 flex flex-col items-center transform scale-105 ring-2 ring--naka-blue ring-offset-2">
          <span className="text-sm font-bold mb-4 text-center tracking-widest uppercase">
            Series K-150
          </span>
          <div className="w-full aspect-square bg-white rounded-lg mb-2 flex items-center justify-center p-2 overflow-hidden">
            <img
              alt="Phối cảnh thực tế bộ ray nhôm anodized và con lăn Nakao K-150"
              className="w-full h-full object-contain rounded-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3QUHuWQ_4Qo57FPDQaOQAWmYfnwSQCKpZ7RmZZEOHuPKAo1JXckImmtURTCgDqxrHlDoObMeZfflnBgEhCpohcshJWpFXAxh5vxRdLY2X8CAQCeYGkvwGOWnMyPGbrHA-92swNfjCTwupW80bXCF2UnJZE23uF2s6qMuUwXTGV7Zd1hEariazOQ3CNly4-K0CMZea9sOfpyf-hEgZ5Jgnv3oNgKz5obSdtfQOhHjPOrGCB06kafYVF1VFPHVcXTerasmxNnPWP7q1"
            />
          </div>
          <span className="text-xs font-medium opacity-90 mt-1 uppercase">
            Hệ Ray Anodized
          </span>
        </div>
        <div className="group bg-white rounded-[8px] p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] border border-gray-100 hover:border--naka-blue/30 cursor-pointer transition-all duration-300 flex flex-col items-center">
          <span className="text-sm font-semibold text-gray-600 mb-4 text-center group-hover:text--naka-blue transition-colors uppercase tracking-wide">
            Chặn cửa nam châm
          </span>
          <div className="w-full aspect-square bg-white rounded-lg mb-2 flex items-center justify-center p-2 overflow-hidden">
            <img
              alt="Chặn cửa nam châm inox 304 chuyên dụng Nakao"
              className="w-full h-full object-contain rounded-lg opacity-90 group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpi02ILALZ_F9moZUaopQKZajwzJtUULSzkVi8SZjqFV-XZ730rL7VVUiD4SgATU12EkU7L1o0p61QLVHjl05NBi6j7zYcEkiCzRBDS2vJHbLaf4PZWaDmGhSZDx33KdQV6qI-3N2pUvtijfYYIPfus9_i4Vks4eijug9nMcuiLLDwchOPVkcUclfcbKrMHSjAdGO1omK-mE8QoDVIQrxh1fgBxYHcN6OoIA0-LkponnD2t0lfAjf3HYs2G26ceGhMOqWU1XXYb6j_"
            />
          </div>
        </div>
        <div className="group bg-white rounded-[8px] p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(29,59,120,0.1)] border border-gray-100 hover:border--naka-blue/30 cursor-pointer transition-all duration-300 flex flex-col items-center">
          <span className="text-sm font-semibold text-gray-600 mb-4 text-center group-hover:text--naka-blue transition-colors uppercase tracking-wide">
            Tay nắm âm
          </span>
          <div className="w-full aspect-square bg-white rounded-lg mb-2 flex items-center justify-center p-2 overflow-hidden">
            <img
              alt="Tay nắm âm inox 304 kỹ thuật tối giản Nakao"
              className="w-full h-full object-contain rounded-lg opacity-90 group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMvzqoasAZq1D3wzTBKPq-Ai0JW1oMJiHkeUOj1II99HIJ88BZOAeCM3SSxTStMIRkv8RENSB2tjzDlPyYKQvmAyOE0Yv5vAY6L5-HQ3WE7Sy7dOjQGctF0heH9ArVcmr3wx2ARh3LuKIqp13-18MshpjEu-uHYN3eCndT2SFrXYYoYfmVn3DdPCE5F8s_cng_6Tcn3KpNZy-ZpvtnNlHBaimJmRm9CsRV8a7vST7B2wCB5-d_MX0Hr7BFWvG6Ec3d-AcwR_n5lVG2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
