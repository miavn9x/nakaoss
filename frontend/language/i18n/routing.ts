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
    "/recruitment": {
      vi: "/tuyen-dung",
      cn: "/recruit",
      ja: "/recruitment",
      en: "/recruitment",
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
