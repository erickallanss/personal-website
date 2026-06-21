import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BackLink } from '@/components/BackLink';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { siteConfig } from '@/config/site';
import { getPostLoader, postSlugs } from '@/content/blog';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { canonicalUrl, languageAlternates, pageOpenGraph, pageTwitter } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
   return postSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
   const { locale, slug } = await params;
   if (!isLocale(locale)) return {};
   const loader = getPostLoader(slug, locale);
   if (!loader) return {};
   const { metadata } = await loader();
   const path = `/blog/${slug}`;
   const title = metadata.title;
   const description = metadata.excerpt;
   return {
      title,
      description,
      alternates: {
         canonical: canonicalUrl(locale, path),
         languages: languageAlternates(path),
      },
      openGraph: {
         ...pageOpenGraph({ locale, title, description, barePath: path, ogImagePath: path }),
         type: 'article',
         publishedTime: metadata.date,
         authors: [siteConfig.name],
      },
      twitter: pageTwitter({ locale, title, description, ogImagePath: path }),
   };
}

function formatDate(date: string, locale: Locale): string {
   return new Date(date).toLocaleDateString(locale === 'pt-br' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
   const { locale, slug } = await params;
   if (!isLocale(locale)) notFound();
   const loader = getPostLoader(slug, locale);
   if (!loader) notFound();
   const dict = await getDictionary(locale);
   const { default: Post, metadata } = await loader();
   const path = `/blog/${slug}`;
   const url = canonicalUrl(locale, path);

   return (
      <article>
         <BreadcrumbJsonLd
            items={[
               { name: siteConfig.name, item: canonicalUrl(locale) },
               { name: dict.blog.title, item: canonicalUrl(locale, '/blog') },
               { name: metadata.title, item: url },
            ]}
         />
         <ArticleJsonLd
            type="Article"
            locale={locale}
            headline={metadata.title}
            description={metadata.excerpt}
            url={url}
            datePublished={metadata.date}
            image={`${url}/opengraph-image`}
         />
         <BackLink href={`/${locale}/blog`} label={dict.blog.backToList} />

         <header className="mt-8 animate-rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
               {formatDate(metadata.date, locale)}
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl">{metadata.title}</h1>
         </header>

         <div className="prose mt-10 animate-rise" style={{ animationDelay: '80ms' }}>
            <Post />
         </div>
      </article>
   );
}
