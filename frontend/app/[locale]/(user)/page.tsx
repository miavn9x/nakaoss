import Home from "@/features/client/home/page";
import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    vi: "Nakao Vietnam – Phụ Kiện Cửa Chuẩn Nhật Bản",
    en: "Nakao Vietnam – Japanese Standard Door Hardware",
    cn: "Nakao Vietnam – 日本标准门配件",
    ja: "Nakao Vietnam – 日本基準のドア金物",
  };

  const descriptions: Record<string, string> = {
    vi: "Nhà phân phối chính thức phụ kiện cửa thương hiệu Nhật Bản tại Việt Nam: bản lề, ray trượt, chặn cửa, xiết đáy. Chất lượng Nhật, phục vụ nhà thầu, xưởng mộc, kiến trúc sư và đại lý.",
    en: "Official distributor of Japanese-brand door hardware in Vietnam: hinges, sliding systems, door stoppers, door bottom seals. Serving contractors, furniture workshops, architects and dealers.",
    cn: "Nakao Vietnam是日本品牌门配件在越南的官方经销商：合页、滑动系统、门挡、门底密封条。服务承包商、木工坊、建筑师和经销商。",
    ja: "Nakao VietnamはベトナムにおけるNAKAO日本ブランドのドア金物の正規代理店です。蝶番・引き戸システム・ドアストッパー・ドアボトムシールを取り扱い、施工業者・家具工場・建築家・販売店にサービスを提供しています。",
  };

  return {
    title: titles[locale] ?? titles.vi,
    description: descriptions[locale] ?? descriptions.vi,
    openGraph: {
      title: titles[locale] ?? titles.vi,
      description: descriptions[locale] ?? descriptions.vi,
      images: [
        {
          url: "/logo/Logo-NAKAO.jpg",
          width: 1200,
          height: 630,
          alt: "Nakao Vietnam – Phụ Kiện Cửa Chuẩn Nhật Bản",
        },
      ],
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
