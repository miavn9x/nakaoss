import Home from "@/features/client/home/page";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Bạn có thể fetch cấu hình SEO từ backend ở đây nếu có module Settings
  const titles: Record<string, string> = {
    vi: "Dòng truyền Drikung Kagyu - Phât giáo Tây Tạng",
    en: "Drikung Kagyu Lineage - Tibetan Buddhism",
    zh: "直贡噶举传承 - 藏传佛教",
    bo: "འབྲི་གུང་བཀའ་བརྒྱུད་བསྟན་པ།",
  };

  return {
    title: titles[locale] || titles.vi,
    description:
      "Trang thông tin chính thức của dòng truyền Drikung Kagyu tại Việt Nam. Chia sẻ kiến thức, lịch trình và giáo lý Phật giáo Tây Tạng.",
    openGraph: {
      images: ["/img/Layer_12-1.png"],
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <Home locale={locale} />
    </>
  );
}
