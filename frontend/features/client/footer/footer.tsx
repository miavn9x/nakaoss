import Link from "next/link";
import Image from "next/image";
import { Facebook, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";

function ZaloIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Zalo"
      role="img"
    >
      <path d="M24 4C12.954 4 4 12.954 4 24c0 4.41 1.395 8.494 3.766 11.828L4.5 44l8.5-2.766A19.92 19.92 0 0 0 24 44c11.046 0 20-8.954 20-20S35.046 4 24 4zm-6.5 12h13a1 1 0 0 1 .78 1.625L23.5 27H31a1 1 0 1 1 0 2H18a1 1 0 0 1-.78-1.625L25 18h-7.5a1 1 0 1 1 0-2zm-2.5 6c0-.828.448-1.5 1-1.5s1 .672 1 1.5-.448 1.5-1 1.5-1-.672-1-1.5zm18 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5z" />
    </svg>
  );
}

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer
      className="bg-naka-blue text-white font-sans relative overflow-hidden"
      aria-label="Site footer"
    >
      {/* ── Top Transition Wave ── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 z-20">
        <svg
          className="relative block w-[calc(110%+1.3px)] h-[40px] md:h-[80px]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,101.3C960,117,1056,139,1152,138.7C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* ── Wave background decoration ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-5 z-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 400"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#93c5fd" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M-100,200 C100,80 300,320 500,200 C700,80 900,300 1100,180 C1300,60 1400,220 1540,160"
            fill="none"
            stroke="url(#wg1)"
            strokeWidth="70"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M-100,260 C150,140 350,360 580,240 C810,120 980,340 1200,220 C1350,140 1450,260 1540,200"
            fill="none"
            stroke="url(#wg2)"
            strokeWidth="40"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M-100,150 C200,50 420,270 670,150 C920,30 1060,240 1310,130 C1410,80 1490,170 1540,130"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* ── TOP: Centered Logo & Brand ── */}
      <div className="relative z-10 border-b border-white/15 py-10 px-6">
        <div className="container mx-auto flex flex-col items-center text-center gap-3">
          {/* Logo */}
          <div className="w-32 h-32 rounded-full bg-white overflow-hidden relative shadow-md">
            <Image
              src="/logo/Logo-NAKAO.jpg"
              alt="Nakao Vietnam – Logo thương hiệu"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>

          {/* Brand name – dùng <p> thay <h2> để không phá heading hierarchy trang */}
          <div>
            <p className="text-white text-2xl font-bold tracking-widest uppercase">
              NAKAO VIETNAM
            </p>
            <p className="text-white/60 text-sm mt-1">{t("col3_company")}</p>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: 3 Columns ── */}
      <div className="relative z-10 container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Column 1 – Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-white/20">
              {t("col1_title")}
            </h3>

            {/* <address> cho đúng semantic HTML liên hệ */}
            <address className="not-italic">
              <ul className="space-y-3.5 text-white text-base">
                <li className="flex items-start gap-2.5">
                  <MapPin
                    size={14}
                    className="text-white/50 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="leading-snug">
                    <span className="block text-white/65 text-xs mb-0.5 font-semibold uppercase tracking-wide">
                      {t("col1_address_label")}
                    </span>
                    {t("col1_address_value")}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone
                    size={14}
                    className="text-white/50 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="text-white/65 text-xs mr-1">
                      {t("col1_hotline_label")}:
                    </span>
                    <a
                      href={`tel:${t("col1_hotline_value").replace(/\./g, "")}`}
                      className="hover:text-white transition-colors"
                    >
                      {t("col1_hotline_value")}
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail
                    size={14}
                    className="text-white/50 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="text-white/50 text-xs mr-1">
                      {t("col1_email_label")}:
                    </span>
                    <a
                      href={`mailto:${t("col1_email_value")}`}
                      className="hover:text-white transition-colors break-all"
                    >
                      {t("col1_email_value")}
                    </a>
                  </span>
                </li>
              </ul>
            </address>

            {/* Social */}
            <div className="mt-5">
              <p className="text-white/70 text-xs uppercase tracking-widest mb-2.5 font-semibold">
                {t("col1_connect")}
              </p>
              <div className="flex gap-2.5">
                <a
                  href="https://www.facebook.com/nakaovietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nakao Vietnam trên Facebook"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <Facebook size={15} aria-hidden="true" />
                </a>
                <a
                  href="https://zalo.me/nakaovietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nakao Vietnam trên Zalo"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <ZaloIcon size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 – Products */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-white/20">
              {t("col2_title")}
            </h3>
            <ul className="space-y-2.5 text-white text-base">
              <li className="flex items-center gap-2">
                <span
                  className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                  aria-hidden="true"
                />
                <Link href="#" className="hover:text-white transition-colors">
                  {t("col2_product1")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                  aria-hidden="true"
                />
                <Link href="#" className="hover:text-white transition-colors">
                  {t("col2_product2")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                  aria-hidden="true"
                />
                <Link href="#" className="hover:text-white transition-colors">
                  {t("col2_product3")}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                  aria-hidden="true"
                />
                <Link href="#" className="hover:text-white transition-colors">
                  {t("col2_product4")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 – Company */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-white/20">
              {t("col3_title")}
            </h3>

            {/* Company name */}
            <p className="text-white/90 text-base font-semibold mb-5">
              {t("col3_company")}
            </p>

            {/* Japan factories */}
            <div className="mb-5">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
                {t("col3_factories_jp")}
              </p>
              {/* HQ */}
              <p className="text-white/80 text-sm mb-2 leading-snug">
                {t("col3_hq_label")}:{" "}
                <span className="text-white font-medium">
                  {t("col3_hq_name")}
                </span>
              </p>
              {/* Factories */}
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://www.unzu.co.jp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-base text-white/80 hover:text-white transition-colors group"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                      aria-hidden="true"
                    />
                    {t("col3_factory_unzu")}
                    <ExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-60 transition-opacity"
                      aria-hidden="true"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.akogi.co.jp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-base text-white/80 hover:text-white transition-colors group"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                      aria-hidden="true"
                    />
                    {t("col3_factory_akogi")}
                    <ExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-60 transition-opacity"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              </ul>
            </div>

            {/* China factories */}
            <div>
              <p className="text-white/70 text-xs uppercase tracking-widest mb-2 font-semibold">
                {t("col3_factories_cn")}
              </p>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="http://www.cn-nakao.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-base text-white/80 hover:text-white transition-colors group"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                      aria-hidden="true"
                    />
                    {t("col3_factory_shanghai")}
                    <ExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-60 transition-opacity"
                      aria-hidden="true"
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="http://www.nakao.net.cn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-base text-white/80 hover:text-white transition-colors group"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-white/40 shrink-0"
                      aria-hidden="true"
                    />
                    {t("col3_factory_haiyang")}
                    <ExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-60 transition-opacity"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-10 border-t border-white/15 py-4 text-center">
        <p className="text-white/40 text-xs px-4">{t("copyright")}</p>
      </div>
    </footer>
  );
}
