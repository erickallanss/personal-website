/** Supported locales. URL segments are lowercase; `htmlLang` maps to the BCP-47 tag for <html lang>. */
export const locales = ['en', 'pt-br'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const htmlLang: Record<Locale, string> = {
   en: 'en',
   'pt-br': 'pt-BR',
};

export const localeNames: Record<Locale, string> = {
   en: 'EN',
   'pt-br': 'PT',
};

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);
