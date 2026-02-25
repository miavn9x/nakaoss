"use client";

import { useTranslations } from "next-intl";
import { Settings, EyeOff, Wind } from "lucide-react";

const CoreValuesSection = () => {
  const t = useTranslations("Home");

  const values = [
    {
      icon: <Settings className="w-10 h-10 text-white" strokeWidth={1.5} />,
      title: t("core_value_1_title"),
      desc: t("core_value_1_desc"),
    },
    {
      icon: <EyeOff className="w-10 h-10 text-white" strokeWidth={1.5} />,
      title: t("core_value_2_title"),
      desc: t("core_value_2_desc"),
    },
    {
      icon: <Wind className="w-10 h-10 text-white" strokeWidth={1.5} />,
      title: t("core_value_3_title"),
      desc: t("core_value_3_desc"),
    },
  ];

  return (
    <section className="w-full py-20 bg-naka-blue relative overflow-hidden border-t border-b border-white/10">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L100,0 L50,100 Z" fill="white" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase mb-4">
            NAKAO Standard
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            {t("core_values_title")}
          </h2>
          <div className="w-20 h-1 bg-white/30 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((val, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {val.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                {val.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
