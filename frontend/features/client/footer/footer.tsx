import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-[#7a1e1e] text-gray-300 text-xs font-sans relative overflow-hidden">
      {/* Mobile-only Background Pattern */}
      <div className="absolute inset-0 z-0 md:hidden bg-[url('/bg/footer_pattent.png')] bg-repeat opacity-60 pointer-events-none" />

      {/* Decorative Images - Optimization with Next.js Image */}
      <div className="hidden md:block absolute bottom-12 left-[5%] w-[30%] md:w-[20%] lg:w-[15%] h-auto opacity-50 pointer-events-none">
        <Image
          src="/banner/sutu.png"
          alt="Decorative left"
          width={300}
          height={300}
          sizes="(max-width: 768px) 100vw, 20vw"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="hidden md:block absolute bottom-12 right-[5%] w-[30%] md:w-[20%] lg:w-[15%] h-auto opacity-50 pointer-events-none">
        <Image
          src="/banner/sutu2.png"
          alt="Decorative right"
          width={300}
          height={300}
          sizes="(max-width: 768px) 100vw, 20vw"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Top Section: Links */}
        <div className="flex flex-col md:flex-row gap-8 border-b border-white/10 pb-8">
          {/* Left Column */}
          <div className="flex-1">
            <h3 className="font-bold text-white uppercase mb-3 text-sm sm:text-base tracking-wider border-b border-transparent inline-block">
              {t("about_budha")}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("birth_of_buddha")}
                </span>
              </Link>
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("buddha_renunciation")}
                </span>
              </Link>
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("in_search_of_truth")}
                </span>
              </Link>
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("turning_wheel_dharma")}
                </span>
              </Link>
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("buddha_parinirvana")}
                </span>
              </Link>
            </div>
          </div>

          {/* Divider visible on desktop if needed, or just gap. Image shows a gap/line. */}
          {/* We use flex gap, but if a vertical line is strictly needed: */}
          <div className="hidden md:block w-px bg-white/10 self-stretch"></div>

          {/* Right Column */}
          <div className="flex-1">
            <h3 className="font-bold text-white uppercase mb-3 text-sm sm:text-base tracking-wider border-b border-transparent inline-block">
              {t("about_dharma")}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("buddha_teachings")}
                </span>
              </Link>
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">{t("dharmawheel")}</span>
              </Link>
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("four_noble_truth")}
                </span>
              </Link>
              <Link
                href="#"
                className="hover:text-[#c9a149] transition-colors whitespace-nowrap"
              >
                <span className="text-[10px] mr-1">»</span>{" "}
                <span className="text-xs sm:text-sm">
                  {t("eightfold_path")}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Center Logo Section */}
        <div className="flex flex-col items-center justify-center pt-8 text-center space-y-2">
          {/* Logo Circle */}
          <div className="w-48 h-48 rounded-full bg-white p-1 shadow-lg mb-4 overflow-hidden relative">
            <Image
              src="/logo/z7498390920447_8babf5e4f4b74e899a831d480d66ff10.jpg"
              alt="Drikung Kagyu Logo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          <div>
            <h2 className="text-[#c9a149] text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide">
              DRIKUNG KAGYU
            </h2>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.2em]">
              {t("official_website")}
            </p>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto">
            {t("description")}
          </p>

          <div className="flex gap-4 pt-2 text-white/70">
            <Link href="#" className="hover:text-white transition-colors">
              <Facebook size={14} />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Instagram size={14} />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Linkedin size={14} />
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              <Youtube size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#fdfce8] text-[#7a1e1e] py-3 text-center border-t border-[#c9a149]">
        <div className="container mx-auto px-4 font-semibold text-xs transition-colors">
          © 2025-2026 {t("description")} {t("design_by")}{" "}
          <a
            href="https://wfourtech.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#7a1e1e] transition-colors"
          >
            W Four Tech
          </a>
        </div>
      </div>
    </footer>
  );
}
