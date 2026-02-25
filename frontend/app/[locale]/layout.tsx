import type { Metadata, Viewport } from "next";
import "../../shared/styles/globals.css";

import { AuthProvider } from "@/features/auth/shared/contexts/AuthContext";
import { AuthModalProvider } from "@/features/auth/shared/contexts/AuthModalContext";
import { AuthModalWrapper } from "@/features/auth/components/AuthModalWrapper";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/language/i18n/routing";
import QueryProvider from "@/shared/components/QueryProvider";
import Script from "next/script";
import DOMPurify from "isomorphic-dompurify";

/** ✅ Viewport – themeColor theo chuẩn Next 15 */
export const viewport: Viewport = {
  themeColor: "#1d3b78",
};

/** ✅ Metadata gốc – Nakao Vietnam */
export const metadata: Metadata = {
  metadataBase: new URL("https://nakaoss.com"),
  applicationName: "Nakao Vietnam",
  title: {
    default: "Nakao Vietnam – Phụ Kiện Cửa Chuẩn Nhật Bản",
    template: "%s | Nakao Vietnam",
  },
  description:
    "Nakao Vietnam – Nhà phân phối chính thức phụ kiện cửa thương hiệu Nhật Bản: bản lề, ray trượt, chặn cửa, xiết đáy. Chuẩn kỹ thuật Nhật, phục vụ nhà thầu, xưởng mộc, kiến trúc sư và đại lý tại Việt Nam.",
  keywords: [
    "phụ kiện cửa Nhật Bản",
    "bản lề Nakao",
    "ray trượt cửa",
    "chặn cửa",
    "xiết đáy cửa",
    "Nakao Vietnam",
    "NAKAO Seisakusho",
    "phụ kiện nội thất Nhật",
    "door hardware Japan",
    "hinges sliding systems",
  ],
  authors: [{ name: "Nakao Vietnam", url: "https://nakaoss.com" }],
  creator: "W Four Tech",
  publisher: "Công ty TNHH Nakao Việt Nam",
  icons: {
    icon: "/logo/Logo-NAKAO.jpg",
    apple: "/logo/Logo-NAKAO.jpg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Nakao Vietnam",
    title: "Nakao Vietnam – Phụ Kiện Cửa Chuẩn Nhật Bản",
    description:
      "Phụ kiện cửa thương hiệu Nhật: bản lề, ray trượt, chặn cửa, xiết đáy. Chất lượng Nhật Bản, phục vụ B2B tại Việt Nam.",
    url: "https://nakaoss.com",
    locale: "vi_VN",
    images: [
      {
        url: "/logo/Logo-NAKAO.jpg",
        width: 1200,
        height: 630,
        alt: "Nakao Vietnam – Phụ Kiện Cửa Chuẩn Nhật Bản",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nakao Vietnam – Phụ Kiện Cửa Chuẩn Nhật Bản",
    description:
      "Nhà phân phối chính thức phụ kiện cửa thương hiệu Nhật tại Việt Nam.",
    images: ["/logo/Logo-NAKAO.jpg"],
  },
  alternates: {
    canonical: "https://nakaoss.com",
    languages: {
      "vi-VN": "https://nakaoss.com/vi",
      "en-US": "https://nakaoss.com/en",
      "zh-CN": "https://nakaoss.com/cn",
      "ja-JP": "https://nakaoss.com/ja",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "business",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Công ty TNHH Nakao Việt Nam",
    alternateName: "Nakao Vietnam",
    url: "https://nakaoss.com",
    logo: "https://nakaoss.com/logo/Logo-NAKAO.jpg",
    image: "https://nakaoss.com/logo/Logo-NAKAO.jpg",
    description:
      "Nhà phân phối chính thức phụ kiện cửa thương hiệu Nhật Bản tại Việt Nam: bản lề, ray trượt, chặn cửa, xiết đáy cửa.",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Phòng 10, Tầng 9, Tòa nhà VIT, 519 Kim Mã, Phường Giảng Võ",
      addressLocality: "Hà Nội",
      addressCountry: "VN",
    },
    telephone: "+84984872828",
    email: "inquiry_vn@nakaoss.com",
    foundingDate: "2025-06",
    parentOrganization: {
      "@type": "Organization",
      name: "株式会社中尾製作所 – NAKAO Seisakusho Co., Ltd.",
      url: "https://www.nakao-ss.co.jp",
    },
    sameAs: [
      "https://www.facebook.com/nakaovietnam",
      "https://zalo.me/nakaovietnam",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Phụ Kiện Cửa Nakao",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "Bản lề (Hinges)" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Ray trượt (Sliding Systems)",
          },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "Chặn cửa (Door Stoppers)" },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Xiết đáy cửa (Door Bottom Seals)",
          },
        },
      ],
    },
  };

  const searchBoxJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://nakaoss.com",
    name: "Nakao Vietnam",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://nakaoss.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(organizationJsonLd)),
          }}
        />
        <Script
          id="searchbox-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(JSON.stringify(searchBoxJsonLd)),
          }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <QueryProvider>
            <AuthProvider>
              <AuthModalProvider>
                <Suspense fallback={null}>
                  <AuthModalWrapper />
                </Suspense>
                {children}
                <ToastContainer
                  position="top-right"
                  theme="light"
                  autoClose={2000}
                  limit={3}
                />
              </AuthModalProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
