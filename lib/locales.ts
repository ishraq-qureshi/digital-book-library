import { routing } from "@/i18n/routing";

export type AppLocale = (typeof routing.locales)[number];

// Static UI-locale metadata (name, direction). Distinct from the `Language`
// Prisma model, which is admin-managed data describing what language a
// *book* is written in - this list is fixed at deploy time because it
// drives routing/proxy behavior, not catalog content.
export const localeMeta: Record<AppLocale, { nativeName: string; englishName: string; rtl: boolean }> = {
  en: { nativeName: "English", englishName: "English", rtl: false },
  ur: { nativeName: "اردو", englishName: "Urdu", rtl: true },
  sd: { nativeName: "سنڌي", englishName: "Sindhi", rtl: true },
  fa: { nativeName: "فارسی", englishName: "Farsi", rtl: true },
  ar: { nativeName: "العربية", englishName: "Arabic", rtl: true },
};

export function isRtlLocale(locale: string): boolean {
  return localeMeta[locale as AppLocale]?.rtl ?? false;
}

export function dirForLocale(locale: string): "rtl" | "ltr" {
  return isRtlLocale(locale) ? "rtl" : "ltr";
}
