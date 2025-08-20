export const locales = ["en", "es"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export function isSupportedLocale(locale: string | undefined): locale is AppLocale {
  return !!locale && (locales as readonly string[]).includes(locale);
}
