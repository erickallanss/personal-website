// The Twitter card is identical to the OpenGraph card. Next requires route-segment config
// (e.g. `dynamicParams`) to be statically declared per file, so this can't re-export the
// opengraph-image module — but both share the single buildOgImage() generator in @/lib/og.
import { siteConfig } from '@/config/site';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export function generateStaticParams() {
   return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;
export const alt = `${siteConfig.name} — ${siteConfig.role.en}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function TwitterImage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   const safeLocale: Locale = isLocale(locale) ? locale : 'en';
   const dict = await getDictionary(safeLocale);

   return buildOgImage({
      eyebrow: `// ${siteConfig.role[safeLocale].toUpperCase()}`,
      title: siteConfig.name,
      subtitle: dict.meta.description,
   });
}
