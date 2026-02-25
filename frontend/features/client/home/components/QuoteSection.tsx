import Image from "next/image";
import { getTranslations } from "next-intl/server";

const QuoteSection = async () => {
  const t = await getTranslations("Quote");

  return (
    <section className="relative py-10 md:py-20 overflow-hidden">
      <div className="max-w-350 mx-auto px-4">
        {/* Mobile / Tablet: Image on top */}
        <div className="block lg:hidden mb-2">
          <div className="max-w-90 mx-auto">
            <Image
              src="/img/Layer_12-1.png"
              alt="Thangka"
              width={360}
              height={460}
              priority
              sizes="(max-width: 768px) 100vw, 360px"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 items-stretch relative">
          {/* Left image - Desktop only */}
          <div className="hidden lg:flex items-start justify-end relative">
            <div className="w-90  drop-shadow-2xl">
              <Image
                src="/img/Layer_12-1.png"
                alt="Thangka"
                width={360}
                height={480}
                sizes="340px"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Right content */}
          <div className="relative">
            {/* Gray background */}
            <div className="bg-[#f5f5f5] py-10 md:py-30 lg:py-22 px-8 md:px-12 lg:px-10 xl:pr-30 relative">
              {/* Extend background to right - Safe large width to prevent scrollbars */}
              <div className="absolute top-0 bottom-0 left-0 right-[-2000px] bg-[#f5f5f5] -z-10" />

              <div className="max-w-190">
                <p className="text-gray-800 text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-relaxed lg:leading-8 text-justify">
                  {t("content")}
                </p>

                <div className="flex items-center justify-center  pt-16">
                  <div className="w-13.75 h-px bg-[#676767]" />
                  <p className="px-7 text-gray-800 text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase text-center whitespace-nowrap">
                    {t("author")}
                  </p>
                  <div className="w-13.75 h-px bg-[#676767]" />
                </div>
              </div>

              {/* Decorative deer */}
              <div className="absolute -bottom-15 right-0 md:right-6 w-27.5 md:w-40 opacity-60 pointer-events-none">
                <Image
                  src="/bg/ico_quote_home.png"
                  alt="Decorative"
                  width={260}
                  height={250}
                  sizes="160px"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
