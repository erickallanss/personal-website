import { siteConfig } from '@/config/site';
import { getPostLoader, postSlugs } from '@/content/blog';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildOgImage, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

// Full locale × slug matrix so images prerender (metadata routes don't inherit the layout's params).
export function generateStaticParams() {
   return locales.flatMap((locale) => postSlugs.map((slug) => ({ locale, slug })));
}

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${siteConfig.name} — Blog`;

export default async function PostOpengraphImage({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}) {
   const { locale, slug } = await params;
   const safeLocale: Locale = isLocale(locale) ? locale : 'en';
   const dict = await getDictionary(safeLocale);
   const loader = getPostLoader(slug, safeLocale);
   const meta = loader ? (await loader()).metadata : undefined;

   return buildOgImage({
      eyebrow: `// ${dict.blog.title.toUpperCase()}`,
      title: meta?.title ?? dict.blog.title,
      subtitle: meta?.excerpt,
   });
}
