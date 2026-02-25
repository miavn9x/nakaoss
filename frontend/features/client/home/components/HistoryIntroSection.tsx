"use client";

import { useTranslations } from "next-intl";
import {
  Clock,
  MapPin,
  Briefcase,
  Award,
  Settings,
  EyeOff,
  Wind,
  Layers,
  MoveHorizontal,
  AlignVerticalSpaceAround,
  Magnet,
  HeadphonesIcon,
  Download,
  Calculator,
  Users,
} from "lucide-react";
import Link from "next/link";

const HistoryIntroSection = () => {
  const t = useTranslations("Home");

  return (
    <section className="w-full py-16 md:py-24 bg-naka-blue relative border-b border-white/20">
      {/* Background Engineering Grid (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Crosshair accents */}
      <div className="absolute top-8 left-8 w-4 h-4 border-l border-t border-white/40" />
      <div className="absolute top-8 right-8 w-4 h-4 border-r border-t border-white/40" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-l border-b border-white/40" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-r border-b border-white/40" />

      <div className="container mx-auto px-4 relative z-10 space-y-16">
        {/* --- PART 1: CORPORATE PROFILE --- */}
        <div>
          <div className="mb-8 md:mb-12 border-l-2 border-white/60 pl-6">
            <p className="text-white/50 font-mono text-xs tracking-[0.2em] uppercase mb-2">
              01. Corporate Profile
            </p>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-wide">
              {t("history_title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-0 border border-white/20">
            {/* Left Column: Video Container */}
            <div className="relative w-full aspect-video bg-black border-b lg:border-b-0 lg:border-r border-white/20 p-4">
              <div className="absolute top-0 left-0 w-full h-full border border-white/10 pointer-events-none" />
              <iframe
                className="w-full h-full relative z-10"
                src="https://www.youtube.com/embed/N24NjVfReCc?si=e2XLp7qMzBYuvH2a"
                title="Nakao 100 Years Anniversary"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-[10px] text-white/50 font-mono pointer-events-none z-20">
                HD 1080P // 16:9
              </div>
            </div>

            {/* Right Column: Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-white/5">
              <div className="p-6 flex flex-col justify-start border-b sm:border-r border-white/20 relative group hover:bg-white/5 transition-colors">
                <Clock className="w-8 h-8 text-white/40 mb-4" strokeWidth={1} />
                <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2">
                  <span className="text-white/50 font-mono text-xs">[01]</span>
                  {t("history_about_title")}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  {t("history_about_desc")}
                </p>
              </div>
              <div className="p-6 flex flex-col justify-start border-b border-white/20 relative group hover:bg-white/5 transition-colors">
                <MapPin
                  className="w-8 h-8 text-white/40 mb-4"
                  strokeWidth={1}
                />
                <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2">
                  <span className="text-white/50 font-mono text-xs">[02]</span>
                  {t("history_vietnam_title")}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  {t("history_vietnam_desc")}
                </p>
              </div>
              <div className="p-6 flex flex-col justify-start border-b sm:border-b-0 sm:border-r border-white/20 relative group hover:bg-white/5 transition-colors">
                <Briefcase
                  className="w-8 h-8 text-white/40 mb-4"
                  strokeWidth={1}
                />
                <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2">
                  <span className="text-white/50 font-mono text-xs">[03]</span>
                  {t("history_business_title")}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  {t("history_business_desc")}
                </p>
              </div>
              <div className="p-6 flex flex-col justify-start relative group hover:bg-white/5 transition-colors">
                <Award className="w-8 h-8 text-white/40 mb-4" strokeWidth={1} />
                <h3 className="text-base font-medium text-white mb-2 flex items-center gap-2">
                  <span className="text-white/50 font-mono text-xs">[04]</span>
                  {t("history_strength_title")}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  {t("history_strength_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- PART 2: CORE VALUES --- */}
        <div>
          <div className="mb-8 border-l-2 border-white/60 pl-6">
            <p className="text-white/50 font-mono text-xs tracking-[0.2em] uppercase mb-2">
              02. Philosophy
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide uppercase">
              {t("core_values_title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/20">
            <div className="p-8 border-b md:border-b-0 md:border-r border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
              <Settings
                className="w-10 h-10 text-white/80 mb-6"
                strokeWidth={1}
              />
              <h3 className="text-lg font-medium text-white mb-3">
                {t("core_value_1_title")}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                {t("core_value_1_desc")}
              </p>
            </div>
            <div className="p-8 border-b md:border-b-0 md:border-r border-white/20 bg-white/5 hover:bg-white/10 transition-colors">
              <EyeOff
                className="w-10 h-10 text-white/80 mb-6"
                strokeWidth={1}
              />
              <h3 className="text-lg font-medium text-white mb-3">
                {t("core_value_2_title")}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                {t("core_value_2_desc")}
              </p>
            </div>
            <div className="p-8 bg-white/5 hover:bg-white/10 transition-colors">
              <Wind className="w-10 h-10 text-white/80 mb-6" strokeWidth={1} />
              <h3 className="text-lg font-medium text-white mb-3">
                {t("core_value_3_title")}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                {t("core_value_3_desc")}
              </p>
            </div>
          </div>
        </div>

        {/* --- PART 3: PRODUCTS --- */}
        <div>
          <div className="mb-8 border-l-2 border-white/60 pl-6 flex justify-between items-end">
            <div>
              <p className="text-white/50 font-mono text-xs tracking-[0.2em] uppercase mb-2">
                03. Innovation
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide uppercase">
                {t("history_product_category_title")}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/20">
            <div className="p-6 border-b sm:border-b-0 lg:border-b-0 sm:border-r border-white/20 bg-white/5 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10">
                <Layers
                  className="w-8 h-8 text-white/60 mb-4 group-hover:text-white transition-colors"
                  strokeWidth={1.5}
                />
                <h4 className="text-base font-medium text-white mb-2">
                  {t("history_product_hinge_title")}
                </h4>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  {t("history_product_hinge_desc")}
                </p>
              </div>
            </div>
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-white/20 bg-white/5 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10">
                <MoveHorizontal
                  className="w-8 h-8 text-white/60 mb-4 group-hover:text-white transition-colors"
                  strokeWidth={1.5}
                />
                <h4 className="text-base font-medium text-white mb-2">
                  {t("history_product_sliding_title")}
                </h4>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  {t("history_product_sliding_desc")}
                </p>
              </div>
            </div>
            <div className="p-6 border-b lg:border-b-0 sm:border-r border-white/20 bg-white/5 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10">
                <AlignVerticalSpaceAround
                  className="w-8 h-8 text-white/60 mb-4 group-hover:text-white transition-colors"
                  strokeWidth={1.5}
                />
                <h4 className="text-base font-medium text-white mb-2">
                  {t("history_product_bottom_title")}
                </h4>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  {t("history_product_bottom_desc")}
                </p>
              </div>
            </div>
            <div className="p-6 bg-white/5 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10">
                <Magnet
                  className="w-8 h-8 text-white/60 mb-4 group-hover:text-white transition-colors"
                  strokeWidth={1.5}
                />
                <h4 className="text-base font-medium text-white mb-2">
                  {t("history_product_stopper_title")}
                </h4>
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  {t("history_product_stopper_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- PART 4: CTAs --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Link
            href="/contact"
            className="group flex items-center justify-between p-4 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all"
          >
            <span className="text-sm font-medium text-white tracking-wider uppercase">
              {t("history_cta_consulting")}
            </span>
            <HeadphonesIcon
              className="w-5 h-5 text-white/50 group-hover:text-white transition-colors"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/documents"
            className="group flex items-center justify-between p-4 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all"
          >
            <span className="text-sm font-medium text-white tracking-wider uppercase">
              {t("history_cta_catalog")}
            </span>
            <Download
              className="w-5 h-5 text-white/50 group-hover:text-white transition-colors"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/contact"
            className="group flex items-center justify-between p-4 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all"
          >
            <span className="text-sm font-medium text-white tracking-wider uppercase">
              {t("history_cta_quote")}
            </span>
            <Calculator
              className="w-5 h-5 text-white/50 group-hover:text-white transition-colors"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/contact"
            className="group flex items-center justify-between p-4 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all"
          >
            <span className="text-sm font-medium text-white tracking-wider uppercase">
              {t("history_cta_contact")}
            </span>
            <Users
              className="w-5 h-5 text-white/50 group-hover:text-white transition-colors"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HistoryIntroSection;
