import { siteConfig } from '@/config/site';
import { htmlLang, type Locale } from '@/i18n/config';

/**
 * Renders a JSON-LD blob. We escape `<` to avoid any chance of closing the
 * <script> early if data ever contains "</script>".
 */
function LdScript({ data }: { data: Record<string, unknown> }) {
   const json = JSON.stringify(data).replace(/</g, '\\u003c');
   return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** schema.org Person — the site owner. Stable @id so other nodes can reference it. */
export function PersonJsonLd({ locale, role }: { locale: Locale; role: string }) {
   const sameAs = [siteConfig.linkedin, siteConfig.github].filter(Boolean);
   return (
      <LdScript
         data={{
            '@context': 'https://schema.org',
            '@type': 'Person',
            '@id': `${siteConfig.url}/#person`,
            name: siteConfig.name,
            jobTitle: role,
            email: `mailto:${siteConfig.email}`,
            url: `${siteConfig.url}/${locale}`,
            image: `${siteConfig.url}/${locale}/opengraph-image`,
            ...(sameAs.length > 0 ? { sameAs } : {}),
         }}
      />
   );
}

/** schema.org WebSite — enables sitelinks/search semantics. References the Person as author. */
export function WebSiteJsonLd({ locale, description }: { locale: Locale; description: string }) {
   return (
      <LdScript
         data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteConfig.url}/#website`,
            name: siteConfig.name,
            description,
            url: `${siteConfig.url}/${locale}`,
            inLanguage: htmlLang[locale],
            author: { '@id': `${siteConfig.url}/#person` },
            publisher: { '@id': `${siteConfig.url}/#person` },
         }}
      />
   );
}

export interface Breadcrumb {
   name: string;
   /** Absolute URL. */
   item: string;
}

/** schema.org BreadcrumbList for detail pages. */
export function BreadcrumbJsonLd({ items }: { items: Breadcrumb[] }) {
   return (
      <LdScript
         data={{
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((b, i) => ({
               '@type': 'ListItem',
               position: i + 1,
               name: b.name,
               item: b.item,
            })),
         }}
      />
   );
}

/** schema.org Article/CreativeWork for a blog post or project write-up. */
export function ArticleJsonLd({
   type = 'Article',
   locale,
   headline,
   description,
   url,
   datePublished,
   image,
}: {
   type?: 'Article' | 'CreativeWork';
   locale: Locale;
   headline: string;
   description: string;
   url: string;
   datePublished?: string;
   image?: string;
}) {
   return (
      <LdScript
         data={{
            '@context': 'https://schema.org',
            '@type': type,
            headline,
            description,
            url,
            inLanguage: htmlLang[locale],
            ...(datePublished ? { datePublished } : {}),
            ...(image ? { image } : {}),
            author: { '@id': `${siteConfig.url}/#person` },
            publisher: { '@id': `${siteConfig.url}/#person` },
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
         }}
      />
   );
}
