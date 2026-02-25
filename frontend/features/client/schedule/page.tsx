import { getTranslations } from "next-intl/server";
import PageBanner from "@/shared/components/PageBanner";
import DecorativeLine from "@/shared/components/DecorativeLine";
import ScheduleList from "./components/ScheduleList";

export default async function ScheduleFeaturePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Schedule" });

  return (
    <main className="pb-16">
      <div className="fixed inset-0 z-[-1] w-full h-full bg-cover bg-center bg-no-repeat bg-[url('/bg/2-layers-2.png')] opacity-60" />
      <PageBanner />
      <ScheduleList />
    </main>
  );
}
