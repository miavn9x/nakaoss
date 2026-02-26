import { setRequestLocale } from "next-intl/server";
import RecruitmentDetailFeaturePage from "@/features/client/recruitment/detail-page";

export async function generateMetadata({
    params,
}: {
    params: { locale: string; slug: string };
}) {
    const { locale } = await params;

    return {
        title: "Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa - Nakao Việt Nam",
        description: "Cơ hội nghề nghiệp: Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa tại Nakao Việt Nam.",
        keywords: "Tuyển dụng kỹ sư, Việc làm Nakao, Tuyển kỹ sư tư vấn, Kỹ sư phụ kiện cửa, Việc làm Hà Nội",
        openGraph: {
            title: "Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa - Nakao Việt Nam",
            description: "Cơ hội nghề nghiệp: Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa tại Nakao Việt Nam.",
            type: "article",
            url: `https://nakaoss.com/${locale}/recruitment/ky-su-tu-van-giai-phap-phu-kien-cua`,
            images: [
                {
                    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4TUKSlvi_tUVoGLAGwizQ699LmPCes519VNO6HKwNVt7PNsAw9X67nCr3WzBZ63xYdN8oQGoxmbWanG-WXaEn61b_bgk6_uaeCF6rxCd_DTve0u7RGgoR-P7lNyCYjsHPNntPnGNe-wwSoG5KxIqtnimLhz0-D7c6_Jr5Wa-TMEqKA53ITGD2pLZH3iCS1GRYbVcKMaKaeLfO-NVUFAY6Tjf3xhUk4Jc1DdPP37ewkEUfZwTOKUWPUKCduXcJBJjBxfOH7suN6jwj",
                    width: 1200,
                    height: 630,
                    alt: "Tuyển dụng Kỹ sư Tư vấn - Nakao Việt Nam",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa - Nakao Việt Nam",
            description: "Cơ hội nghề nghiệp: Kỹ sư Tư vấn Giải pháp Phụ kiện Cửa tại Nakao Việt Nam.",
            images: [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuB4TUKSlvi_tUVoGLAGwizQ699LmPCes519VNO6HKwNVt7PNsAw9X67nCr3WzBZ63xYdN8oQGoxmbWanG-WXaEn61b_bgk6_uaeCF6rxCd_DTve0u7RGgoR-P7lNyCYjsHPNntPnGNe-wwSoG5KxIqtnimLhz0-D7c6_Jr5Wa-TMEqKA53ITGD2pLZH3iCS1GRYbVcKMaKaeLfO-NVUFAY6Tjf3xhUk4Jc1DdPP37ewkEUfZwTOKUWPUKCduXcJBJjBxfOH7suN6jwj",
            ],
        },
        alternates: {
            canonical: `https://nakaoss.com/${locale}/recruitment/ky-su-tu-van-giai-phap-phu-kien-cua`,
        },
    };
}

export default async function Page({
    params,
}: {
    params: { locale: string; slug: string };
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Note: in a real application the slug would dictate the fetched data, 
    // but for this UI demo we are loading the static details directly.
    return <RecruitmentDetailFeaturePage />;
}
