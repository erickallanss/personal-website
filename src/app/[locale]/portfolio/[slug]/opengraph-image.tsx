import { siteConfig } from '@/config/site';
import { getProjectLoader, projectSlugs } from '@/content/portfolio';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

// Metadata image routes do NOT cross-product with the parent [locale] layout's params, so we must
// emit the full locale × slug matrix here or the images fall back to on-demand (not prerendered).
export function generateStaticParams() {
   return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${siteConfig.name} — Project`;

export default async function ProjectOpengraphImage({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}) {
   const { locale, slug } = await params;
   const safeLocale: Locale = isLocale(locale) ? locale : 'en';
   const dict = await getDictionary(safeLocale);
   const loader = getProjectLoader(slug, safeLocale);
   const meta = loader ? (await loader()).metadata : undefined;

   return buildOgImage({
      eyebrow: `// ${dict.portfolio.title.toUpperCase()}`,
      title: meta?.name ?? siteConfig.name,
      subtitle: meta?.excerpt,
   });
}
