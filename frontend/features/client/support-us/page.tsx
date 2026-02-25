import Image from "next/image";
import { getTranslations } from "next-intl/server";
import PageBanner from "@/shared/components/PageBanner";
import DecorativeLine from "@/shared/components/DecorativeLine";

import CopyButton from "@/shared/components/CopyButton";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Navigation" });

  return {
    title: `${t("support_us")} - PhatGiao.vn`,
  };
}

export default async function SupportUsFeaturePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Support" });

  return (
    <main className="pb-16 text-gray-800 relative">
      <div className="fixed inset-0 z-[-1] w-full h-full pointer-events-none">
        <Image
          src="/bg/ungho.png"
          alt=""
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>
      <PageBanner />

      <div className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-naka-blue uppercase">
          {t("title")}
        </h1>
      </div>

      <DecorativeLine />

      <div className="container mx-auto px-4">
        <div className="container mx-auto space-y-16">
          {/* Section 1: Image Left, Text Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="w-full md:w-4/5 mx-auto aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
              {/* Placeholder for Monks in Hall Image */}
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                [Image: Monks in Hall]
              </div>
            </div>
            <div className="text-lg space-y-6 leading-relaxed text-justify">
              <p>{t("content_1")}</p>
              <p>{t("content_2")}</p>
            </div>
          </div>

          {/* Section 2: Text Left (with Quote), Image Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <p className="font-semibold text-lg">{t("milarepa_intro")}</p>
              <div className="border-l-4 border-naka-blue pl-6 py-2 italic text-lg text-gray-700 bg-gray-50 rounded-r-lg">
                <p className="whitespace-pre-line leading-relaxed">
                  {t("milarepa_quote")}
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2 w-full md:w-4/5 mx-auto aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
              {/* Placeholder for Monks Outside Image */}
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                [Image: Monks Outside]
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-naka-blue uppercase">
          {t("bank_title")}
        </h2>
      </div>

      <DecorativeLine />

      <div className="container mx-auto px-4 mb-20">
        <div className="container mx-auto">
          <p className="text-center text-gray-700 mb-8 font-medium">
            {t("bank_intro")}
          </p>

          <div className="relative border border-gray-300 rounded-none overflow-hidden bg-white">
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/bg/hoa-van-nen.png"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-30"
              />
            </div>
            <table className="relative w-full text-left border-collapse">
              <tbody className="divide-y divide-gray-300">
                {/* Bank Account Holder */}
                <tr className="divide-x divide-gray-300">
                  <td className="p-4 font-medium text-gray-700 w-1/3 align-top">
                    {t("bank_account_holder")}
                  </td>
                  <td className="p-4 text-gray-800 font-medium">
                    {t("bank_account_holder_value")}
                  </td>
                </tr>
                {/* Bank Account No */}
                <tr className="divide-x divide-gray-300">
                  <td className="p-4 font-medium text-gray-700 w-1/3 align-top">
                    {t("bank_account_no")}
                  </td>
                  <td className="p-4 text-gray-800 font-medium">
                    <div className="flex items-center justify-between">
                      <span>{t("bank_account_no_value")}</span>
                      <CopyButton text={t("bank_account_no_value")} />
                    </div>
                  </td>
                </tr>
                {/* DKI Banker Name */}
                <tr className="divide-x divide-gray-300">
                  <td className="p-4 font-medium text-gray-700 w-1/3 align-top">
                    {t("dki_banker_name")}
                  </td>
                  <td className="p-4 text-gray-800">
                    {t("dki_banker_name_value")}
                  </td>
                </tr>
                {/* SWIFT CODE */}
                <tr className="divide-x divide-gray-300">
                  <td className="p-4 font-medium text-gray-700 w-1/3 align-top">
                    {t("swift_code")}
                  </td>
                  <td className="p-4 text-gray-800">{t("swift_code_value")}</td>
                </tr>
                {/* Bank Name */}
                <tr className="divide-x divide-gray-300">
                  <td className="p-4 font-medium text-gray-700 w-1/3 align-top">
                    {t("bank_name")}
                  </td>
                  <td className="p-4 text-gray-800 whitespace-pre-line">
                    {t("bank_name_value")}
                  </td>
                </tr>
                {/* IFSC Code */}
                <tr className="divide-x divide-gray-300">
                  <td className="p-4 font-medium text-gray-700 w-1/3 align-top">
                    {t("ifsc_code")}
                  </td>
                  <td className="p-4 text-gray-800">{t("ifsc_code_value")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-sm text-gray-700 space-y-2 text-justify md:text-center leading-relaxed ">
            <p>
              {t("bank_footer")}{" "}
              <span className="whitespace-nowrap">
                (Email{" "}
                <a
                  href="mailto:secretarydki@gmail.com"
                  className="text-naka-blue font-semibold hover:underline"
                >
                  secretarydki@gmail.com
                </a>
                , phone No.{" "}
                <a
                  href="tel:+911352607863"
                  className="text-naka-blue font-semibold hover:underline"
                >
                  +91 135 2607863
                </a>
                )
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* SENDING CHEQUE/DRAFT */}
      <div className="container mx-auto px-4 mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-naka-blue uppercase">
          {t("cheque_title")}
        </h2>
      </div>

      <DecorativeLine />

      <div className="container mx-auto px-4 mb-20">
        <div className=" mx-auto space-y-6 text-gray-700">
          <p className="font-medium">{t("cheque_instruction_1")}</p>
          <p className="whitespace-pre-line font-semibold text-gray-800">
            {t("cheque_address_1")}
          </p>
          <p className="leading-relaxed">{t("cheque_instruction_2")}</p>
        </div>
      </div>

      {/* SENDING CHEQUE/DRAFT TO HIS HOLINESS */}
      <div className="container mx-auto px-4 mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-naka-blue uppercase">
          {t("hh_cheque_title")}
        </h2>
      </div>

      <DecorativeLine />

      <div className="container mx-auto px-4 mb-20">
        <div className=" mx-auto space-y-6 text-gray-700">
          <p className="font-medium">{t("hh_cheque_instruction")}</p>
          <p className="whitespace-pre-line font-semibold text-gray-800">
            {t("hh_cheque_address")}
          </p>
          <div className="grid gap-2 font-medium">
            <p>{t("hh_contact_phone")}</p>
            <p className="text-naka-blue">{t("hh_contact_email")}</p>
          </div>
          <p className="pt-8 italic text-gray-700">{t("thank_you")}</p>
        </div>
      </div>
    </main>
  );
}
