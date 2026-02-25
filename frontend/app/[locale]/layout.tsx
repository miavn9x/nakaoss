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

/** ✅ Chuyển themeColor sang viewport (chuẩn Next 15) */
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/** ✅ Metadata gốc site */
export const metadata: Metadata = {
  metadataBase: new URL("https://phatgiao.vn"),
  applicationName: "Phat Giao",
  icons: {
    icon: "/img/VvAzinO9.ico",
    apple: "/img/VvAzinO9.ico",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    languages: {
      "vi-VN": "/",
      "en-US": "/en",
      "ja-JP": "/ja",
      "bo-CN": "/bo",
      "zh-CN": "/cn",
    },
  },
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
    "@type": "NewsMediaOrganization",
    name: "Phật Giáo Việt Nam",
    url: "https://phatgiao.vn",
    logo: "https://phatgiao.vn/img/VvAzinO9.ico",
    sameAs: [
      "https://www.facebook.com/phatgiao.vn",
      "https://www.youtube.com/c/phatgiaovn",
    ],
  };

  const searchBoxJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://phatgiao.vn",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://phatgiao.vn/search?q={search_term_string}",
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
