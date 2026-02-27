import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "cn", "ja", "en"],
  defaultLocale: "vi",

  // Hiển thị locale trên URL cho các ngôn ngữ không phải mặc định (en, cn, ja)
  // vi: /lien-he
  // en: /en/contact
  localePrefix: "never",

  pathnames: {
    "/": "/",
    "/product": {
      vi: "/san-pham-dich-vu",
      cn: "/product",
      ja: "/product",
      en: "/product-service",
    },
    "/advantage": {
      vi: "/loi-the",
      cn: "/advantage",
      ja: "/advantage",
      en: "/advantage",
    },
    "/news": {
      vi: "/tin-tuc-va-chia-se",
      cn: "/xin-wen",
      ja: "/news",
      en: "/news-sharing",
    },
    "/recruitment": {
      vi: "/tuyen-dung",
      cn: "/recruit",
      ja: "/recruitment",
      en: "/recruitment",
    },
    "/document": {
      vi: "/tai-lieu",
      cn: "/document",
      ja: "/document",
      en: "/document",
    },
    "/contact": {
      vi: "/lien-he",
      cn: "/lian-xi",
      ja: "/contact",
      en: "/contact",
    },
    "/profile": {
      vi: "/thong-tin-tai-khoan",
      cn: "/profile",
      ja: "/profile",
      en: "/profile",
    },
    "/tue-quang": {
      vi: "/thu-vien-tue-quang",
      cn: "/tue-quang",
      ja: "/tue-quang",
      en: "/tue-quang-library",
    },
    "/longchen": {
      vi: "/dong-longchen-nyingthig",
      cn: "/longchen",
      ja: "/longchen",
      en: "/longchen-lineage",
    },
    "/jamtul-rinpoche-jamyang-sherab": {
      vi: "/jamtul-rinpoche-jamyang-sherab",
      cn: "/jamtul-rinpoche-jamyang-sherab",
      ja: "/jamtul-rinpoche-jamyang-sherab",
      en: "/jamtul-rinpoche-jamyang-sherab",
    },
    "/featured": "/featured",
  },
});

export function hasLocale(locales: readonly string[], locale: string): boolean {
  return locales.includes(locale);
}
