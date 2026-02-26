import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import RecruitmentFeaturePage from "@/features/client/recruitment/page";

export async function generateMetadata({
    params,
}: {
    params: { locale: string };
}) {
    const { locale } = await params;

    return {
        title: "Tuyển Dụng - Nakao Việt Nam",
        description: "Khám phá cơ hội nghề nghiệp tại Nakao Việt Nam. Trở thành một phần của hành trình tiếp nối di sản hơn 100 năm phát triển từ Nhật Bản.",
        keywords: "Tuyển dụng Nakao, Việc làm Nakao, Cơ hội nghề nghiệp Nakao, Kỹ sư tư vấn giải pháp, Nakao Việt Nam",
        openGraph: {
            title: "Tuyển Dụng - Nakao Việt Nam",
            description: "Khám phá cơ hội nghề nghiệp tại Nakao Việt Nam. Trở thành một phần của hành trình tiếp nối di sản Nhật Bản.",
            type: "website",
            url: `https://nakaoss.com/${locale}/recruitment`,
            images: [
                {
                    url: "/logo/Logo-NAKAO.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Tuyển Dụng - Nakao Việt Nam",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Tuyển Dụng - Nakao Việt Nam",
            description: "Khám phá cơ hội nghề nghiệp tại Nakao Việt Nam.",
            images: ["/logo/Logo-NAKAO.jpg"],
        },
        alternates: {
            canonical: `https://nakaoss.com/${locale}/recruitment`,
        },
    };
}

export default async function Page({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <RecruitmentFeaturePage />;
}
