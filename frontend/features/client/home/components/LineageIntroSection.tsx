import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/language/i18n/navigation";

const LineageIntroSection = async () => {
  const t = await getTranslations("LineageIntro");

  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <Image
          src="/bg/ungho.png"
          alt=""
          fill
          className="object-cover opacity-60"
        />
      </div>
      <div className="max-w-350 mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 items-start">
          {/* Left Column: Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="border-l-4 border-naka-blue pl-6">
              <h2 className="text-gray-800 text-2xl sm:text-3xl lg:text-4xl font-bold uppercase leading-tight">
                {t("title")}
              </h2>
            </div>

            {/* Mobile Image: Visible only on mobile, centered */}
            <div className="relative w-full max-w-125 aspect-4/5 block md:hidden mx-auto">
              {/* Background Pattern effect similar to reference */}
              <div className="absolute inset-0 bg-[#f0f0f0] rounded-t-full opacity-50 z-0 scale-90 translate-y-4"></div>

              {/* Placeholder image */}
              <Image
                src="/img/z7499108390156_59f57b101d012082d85a9c6e031cd76d.jpg"
                alt="Drikung Kagyu Lineage - Golden Buddha"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain z-10"
              />
            </div>

            <div className="text-gray-700 text-base lg:text-lg leading-relaxed text-justify space-y-4">
              <p>{t("content")}</p>
              <p>{t("content_2")}</p>
            </div>

            <Link
              href="/jamtul-rinpoche-jamyang-sherab"
              className="inline-block"
            >
              <button className="bg-naka-blue text-white px-8 py-3 text-sm sm:text-base font-bold uppercase hover:bg-naka-blue/90 transition-colors flex items-center gap-2">
                {t("read_more")} <span>→</span>
              </button>
            </Link>
          </div>

          {/* Right Column: Image - Desktop Only */}
          <div className="relative hidden md:flex justify-center md:justify-end">
            {/* Using a placeholder div or existing image until user provides the Golden Buddha reference */}
            <div className="relative w-full max-w-125 aspect-4/5">
              {/* Background Pattern effect similar to reference */}
              <div className="absolute inset-0 bg-[#f0f0f0] rounded-t-full opacity-50 z-0 scale-90 translate-y-4"></div>

              {/* Placeholder image */}
              <Image
                src="/img/z7499108390156_59f57b101d012082d85a9c6e031cd76d.jpg"
                alt="Drikung Kagyu Lineage - Golden Buddha"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LineageIntroSection;
