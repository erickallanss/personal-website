import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { getPostList, postSlugs } from '@/content/blog';
import { projectSlugs } from '@/content/portfolio';
import { defaultLocale, htmlLang, locales } from '@/i18n/config';

// Static (non-dynamic) routes, expressed as bare paths under each locale.
const STATIC_PATHS = ['', '/about', '/portfolio', '/blog', '/contact'] as const;

/** Builds the alternates.languages map (en + pt-BR + x-default) for a bare path. */
function alternates(barePath: string): { languages: Record<string, string> } {
   const languages: Record<string, string> = {};
   for (const locale of locales) {
      languages[htmlLang[locale]] = `${siteConfig.url}/${locale}${barePath}`;
   }
   languages['x-default'] = `${siteConfig.url}/${defaultLocale}${barePath}`;
   return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const now = new Date();
   const entries: MetadataRoute.Sitemap = [];

   // Static routes × locales.
   for (const barePath of STATIC_PATHS) {
      for (const locale of locales) {
         entries.push({
            url: `${siteConfig.url}/${locale}${barePath}`,
            lastModified: now,
            changeFrequency: barePath === '/blog' ? 'weekly' : 'monthly',
            priority: barePath === '' ? 1 : 0.7,
            alternates: alternates(barePath),
         });
      }
   }

   // Project detail pages × locales.
   for (const slug of projectSlugs) {
      const barePath = `/portfolio/${slug}`;
      for (const locale of locales) {
         entries.push({
            url: `${siteConfig.url}/${locale}${barePath}`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
            alternates: alternates(barePath),
         });
      }
   }

   // Blog detail pages × locales (use the post's own date as lastModified).
   if (postSlugs.length > 0) {
      const posts = await getPostList(defaultLocale);
      const dateBySlug = new Map(posts.map((p) => [p.slug, p.date]));
      for (const slug of postSlugs) {
         const barePath = `/blog/${slug}`;
         const date = dateBySlug.get(slug);
         for (const locale of locales) {
            entries.push({
               url: `${siteConfig.url}/${locale}${barePath}`,
               lastModified: date ? new Date(date) : now,
               changeFrequency: 'monthly',
               priority: 0.5,
               alternates: alternates(barePath),
            });
         }
      }
   }

   return entries;
}
