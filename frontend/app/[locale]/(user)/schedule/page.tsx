import ScheduleFeaturePage from "@/features/client/schedule/page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Schedule" });

  return {
    title: `${t("title")} - PhatGiao.vn`,
  };
}

export default ScheduleFeaturePage;
