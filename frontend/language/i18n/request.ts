//frontend/language/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing, hasLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure locale is valid
  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../messages/${locale}.json`)).default;
  let adminMessages = {};
  try {
    adminMessages = (await import(`../admin/${locale}.json`)).default;
  } catch (err) {
    console.error(`Failed to load admin messages for ${locale}`, err);
  }

  return {
    locale,
    messages: { ...messages, ...adminMessages },
  };
});
