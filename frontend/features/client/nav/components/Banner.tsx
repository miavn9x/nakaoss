import Image from "next/image";
import { getTranslations } from "next-intl/server";

const Banner = async () => {
  const t = await getTranslations("Banner");
  return (
    <div className="bg-[#800000] text-white relative">
      {/* Placeholder cho ảnh background thật nếu có */}
      <div className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-between overflow-hidden">
        {/* Left Circular Image Placeholder */}
        <div className="hidden md:block w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-[#ae4d4d] overflow-hidden bg-white/10 shrink-0 shadow-lg relative z-10">
          {/* Nếu có ảnh sư thầy thì thay vào đây */}
          <Image
            src="/logo/z7498390920447_8babf5e4f4b74e899a831d480d66ff10.jpg"
            alt="Logo"
            fill
            priority
            sizes="(max-width: 768px) 128px, 160px"
            className="object-cover"
          />
        </div>

        {/* Center Text */}
        <div className="flex-1 text-center z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-wider text-[#FFD700] drop-shadow-md mb-2">
            {t("title")}
          </h1>
          <p className="text-xl md:text-3xl font-serif italic text-white/90">
            {t("subtitle")}
          </p>
        </div>

        {/* Right Circular Image Placeholder */}
        {/* <div className="hidden md:block w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-[#ae4d4d] overflow-hidden bg-white/10 shrink-0 shadow-lg relative z-10">
          <div className="w-full h-full flex items-center justify-center text-center text-[10px] p-2">
            Ảnh Đại
          </div>
        </div> */}

        {/* Background Pattern Overlay (Optional) */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]"></div>
      </div>
    </div>
  );
};

export default Banner;
