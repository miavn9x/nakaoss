import { getTranslations } from "next-intl/server";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

import PageBanner from "@/shared/components/PageBanner";
import DecorativeLine from "@/shared/components/DecorativeLine";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return {
    title: t("seo_title"),
    description: t("seo_description"),
    keywords: t("seo_keywords"),
    openGraph: {
      title: t("seo_title"),
      description: t("seo_description"),
      type: "website",
      url: `https://phatgiao.vn/${locale}/contact`,
      images: [
        {
          url: "/banner/melatoslide.jpg",
          width: 1200,
          height: 630,
          alt: t("seo_title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo_title"),
      description: t("seo_description"),
      images: ["/banner/melatoslide.jpg"],
    },
    alternates: {
      canonical: `https://phatgiao.vn/${locale}/contact`,
    },
  };
}

export default async function ContactFeaturePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  const tSupport = await getTranslations({ locale, namespace: "Support" });

  return (
    <main className="pb-8 relative">
      <div className="fixed inset-0 z-[-1] w-full h-full bg-[url('/bg/patten-1.png')] opacity-40 bg-repeat" />
      {/* Banner Section */}
      <PageBanner />

      <div className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#9b1422] uppercase">
          {t("title")}
        </h1>
      </div>

      {/* Decorative Line */}
      <DecorativeLine />

      <div className="container mx-auto px-4 mt-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12 p-4">
          {/* Left Column: Main Office (4/10 = 2/5) */}
          <section className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-0.75 h-10 bg-[#9b1422] rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                {t("main_office")}
              </h2>
            </div>

            <address className="space-y-6 not-italic text-lg">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#9b1422] mt-1 shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-700 text-xl">
                    {t("institute")}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t("address_line_1")}
                    <br />
                    {t("address_line_2")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-[#9b1422] shrink-0" />
                <a
                  href="tel:+911352607310"
                  className="text-gray-700 hover:text-[#9b1422] transition-colors font-medium"
                >
                  +91 135 2607310
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-[#9b1422] shrink-0" />
                <a
                  href="mailto:bbdki@hotmail.com"
                  className="text-gray-700 hover:text-[#9b1422] transition-colors font-medium"
                >
                  bbdki@hotmail.com
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Globe className="w-6 h-6 text-[#9b1422] shrink-0" />
                <a
                  href="https://www.drikung.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#9b1422] transition-colors font-medium"
                >
                  www.drikung.org
                </a>
              </div>
            </address>
          </section>

          {/* Right Column: Other Contacts (6/10 = 3/5) */}
          <section className="md:col-span-3">
            <div className="space-y-8 text-lg">
              {/* Private Office */}
              <div className="border-l-2 border-[#9b1422] pl-4 py-1">
                <h3 className="font-bold text-gray-800 leading-tight mb-2 text-xl">
                  {t("private_office")}:
                </h3>
                <a
                  href="mailto:pohhdkc@gmail.com"
                  className="flex items-center gap-2 text-[#9b1422] hover:text-red-700 transition-colors"
                >
                  <Mail size={18} />
                  pohhdkc@gmail.com
                </a>
              </div>

              {/* Institute */}
              <div className="border-l-2 border-[#9b1422] pl-4 py-1">
                <h3 className="font-bold text-gray-800 leading-tight mb-2 text-xl">
                  {t("institute")}:
                </h3>
                <a
                  href="mailto:bbdki@hotmail.com"
                  className="flex items-center gap-2 text-[#9b1422] hover:text-red-700 transition-colors"
                >
                  <Mail size={18} />
                  bbdki@hotmail.com
                </a>
              </div>

              {/* Library */}
              <div className="border-l-2 border-[#9b1422] pl-4 py-1">
                <h3 className="font-bold text-gray-800 leading-tight mb-2 text-xl">
                  {t("library")}:
                </h3>
                <a
                  href="mailto:songtsenlibrary@gmail.com"
                  className="flex items-center gap-2 text-[#9b1422] hover:text-red-700 transition-colors"
                >
                  <Mail size={18} />
                  songtsenlibrary@gmail.com
                </a>
              </div>

              {/* College */}
              <div className="border-l-2 border-[#9b1422] pl-4 py-1">
                <h3 className="font-bold text-gray-800 leading-tight mb-2 text-xl">
                  {t("college")}:
                </h3>
                <a
                  href="mailto:kagyucollege@yahoo.com"
                  className="flex items-center gap-2 text-[#9b1422] hover:text-red-700 transition-colors"
                >
                  <Mail size={18} />
                  kagyucollege@yahoo.com
                </a>
              </div>

              {/* Nunnery */}
              <div className="border-l-2 border-[#9b1422] pl-4 py-1">
                <h3 className="font-bold text-gray-800 leading-tight mb-2 text-xl">
                  {t("nunnery")}:
                </h3>
                <a
                  href="mailto:drikungn@hotmail.com"
                  className="flex items-center gap-2 text-[#9b1422] hover:text-red-700 transition-colors"
                >
                  <Mail size={18} />
                  drikungn@hotmail.com
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Map Section */}
        <section className="p-4" aria-label={t("map_title")}>
          <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.077209988267!2d78.07729221535736!3d30.405786381752327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3908d13b7b7b7b7b%3A0x7b7b7b7b7b7b7b7b!2sDrikung%20Kagyu%20Institute!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              title={t("map_title")}
              width="100%"
              height="100%"
              className="border-0 w-full h-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </main>
  );
}
