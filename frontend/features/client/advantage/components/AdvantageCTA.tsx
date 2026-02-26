import React from "react";

export default function AdvantageCTA() {
  return (
    <section className="text-center py-12 md:py-20 border-t border-gray-100 reveal-on-scroll">
      <h3 className="text-xl md:text-2xl font-serif font-bold mb-8 md:mb-10 uppercase tracking-tight px-4 text-naka-blue">
        Sẵn sàng trải nghiệm công nghệ Nakao?
      </h3>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center w-full max-w-lg md:max-w-none mx-auto">
        <button className="bg-naka-blue hover:bg-[#152a56] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg text-white w-full md:w-auto px-6 py-4 md:pl-8 md:pr-10 md:py-5 rounded-[4px] font-bold group">
          <div className="relative flex items-center justify-center gap-3 text-base md:text-lg">
            <span className="material-symbols-outlined group-hover:animate-bounce text-xl! md:text-2xl!">
              calendar_today
            </span>
            <span className="tracking-wide">ĐẶT LỊCH THAM QUAN</span>
          </div>
        </button>
        <button className="border-2 border-naka-blue text-naka-blue hover:bg-naka-blue hover:text-white transition-all duration-300 shadow-sm w-full md:w-auto px-6 py-4 md:px-10 md:py-5 rounded-[4px] font-bold group">
          <div className="relative flex items-center justify-center gap-3 text-base md:text-lg">
            <span className="material-symbols-outlined text-xl! md:text-2xl!">
              menu_book
            </span>
            <span className="tracking-wide">TẢI CATALOGUE (.PDF)</span>
          </div>
        </button>
      </div>
    </section>
  );
}
