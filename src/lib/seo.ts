import 'server-only';

import { siteConfig } from '@/config/site';
import { defaultLocale, htmlLang, locales, type Locale } from '@/i18n/config';

/**
 * OpenGraph expects underscore BCP-47 locales (e.g. "en_US", "pt_BR").
 * We map our internal locales to those forms.
 */
export const ogLocale: Record<Locale, string> = {
   en: 'en_US',
   'pt-br': 'pt_BR',
};

/**
 * Builds the `alternates.languages` map for a given site-relative path *without* the
 * leading locale segment. Pass the "bare" path, e.g. "" for the locale root,
 * "/about", "/portfolio/cliniqhub".
 *
 * Returns one entry per supported locale (keyed by the BCP-47 <html lang> tag, so
 * "en" and "pt-BR") plus an "x-default" pointing at the default locale — exactly what
 * Next.js serializes into <link rel="alternate" hreflang="...">.
 */
export function languageAlternates(barePath = ''): Record<string, string> {
   const path = barePath && !barePath.startsWith('/') ? `/${barePath}` : barePath;
   const languages: Record<string, string> = {};
   for (const locale of locales) {
      languages[htmlLang[locale]] = `${siteConfig.url}/${locale}${path}`;
   }
   languages['x-default'] = `${siteConfig.url}/${defaultLocale}${path}`;
   return languages;
}

/** Canonical absolute URL for a locale + bare path (e.g. canonicalUrl('en', '/about')). */
export function canonicalUrl(locale: Locale, barePath = ''): string {
   const path = barePath && !barePath.startsWith('/') ? `/${barePath}` : barePath;
   return `${siteConfig.url}/${locale}${path}`;
}

/** The other locales (for openGraph.alternateLocale). */
export function alternateOgLocales(current: Locale): string[] {
   return locales.filter((l) => l !== current).map((l) => ogLocale[l]);
}

/**
 * Common OpenGraph fields for a page. Next.js does NOT deep-merge `openGraph` across the metadata
 * cascade — a page that sets its own `openGraph` REPLACES the layout's entirely (losing siteName,
 * locale, alternateLocale, and the auto-attached image). So every page that overrides openGraph must
 * re-supply these. Spread this then add the literal `type` (and article extras) at the call site:
 *
 *   openGraph: { ...pageOpenGraph({ locale, title, description, barePath: '/about' }), type: 'profile' }
 *
 * `ogImagePath` is the bare path whose co-located opengraph-image route to use; default '' = the
 * per-locale home card (list pages have no own image), detail pages pass their own path.
 */
export function pageOpenGraph(opts: {
   locale: Locale;
   title: string;
   description: string;
   barePath: string;
   ogImagePath?: string;
}) {
   const { locale, title, description, barePath, ogImagePath = '' } = opts;
   return {
      siteName: siteConfig.name,
      url: canonicalUrl(locale, barePath),
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: alternateOgLocales(locale),
      images: [
         {
            url: `${canonicalUrl(locale, ogImagePath)}/opengraph-image`,
            width: 1200,
            height: 630,
            alt: `${siteConfig.name} — ${title}`,
         },
      ],
   };
}

/** Twitter summary_large_image card with a localized image, so no page downgrades to `summary`. */
export function pageTwitter(opts: { locale: Locale; title: string; description: string; ogImagePath?: string }) {
   const { locale, title, description, ogImagePath = '' } = opts;
   return {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [`${canonicalUrl(locale, ogImagePath)}/opengraph-image`],
   };
}
