import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "cn", "bo", "en"],
  defaultLocale: "vi",

  // Hiển thị locale trên URL cho các ngôn ngữ không phải mặc định (en, cn, bo)
  // vi: /lien-he
  // en: /en/contact
  localePrefix: "never",

  pathnames: {
    "/": "/",
    "/tue-quang": {
      vi: "/thu-vien-tue-quang",
      cn: "/tue-quang",
      bo: "/tue-quang",
      en: "/tue-quang-library",
    },
    "/longchen": {
      vi: "/dong-longchen-nyingthig",
      cn: "/longchen",
      bo: "/longchen",
      en: "/longchen-lineage",
    },
    "/about": {
      vi: "/gioi-thieu",
      cn: "/guan-yu",
      bo: "/about",
      en: "/about-us",
    },
    "/schedule": {
      vi: "/lich-phung-vu",
      cn: "/ri-cheng",
      bo: "/schedule",
      en: "/schedule",
    },
    "/contact": {
      vi: "/lien-he",
      cn: "/lian-xi",
      bo: "/contact",
      en: "/contact",
    },
    "/profile": {
      vi: "/thong-tin-tai-khoan",
      cn: "/profile",
      bo: "/profile",
      en: "/profile",
    },
    "/support-us": {
      vi: "/ung-ho",
      cn: "/zhi-chi",
      bo: "/support-us",
      en: "/support-us",
    },
    "/jamtul-rinpoche-jamyang-sherab": {
      vi: "/jamtul-rinpoche-jamyang-sherab",
      cn: "/jamtul-rinpoche-jamyang-sherab",
      bo: "/jamtul-rinpoche-jamyang-sherab",
      en: "/jamtul-rinpoche-jamyang-sherab",
    },
    "/featured": "/featured",
    "/news": "/news",
  },
});

export function hasLocale(locales: readonly string[], locale: string): boolean {
  return locales.includes(locale);
}
