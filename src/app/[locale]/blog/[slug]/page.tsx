import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BackLink } from '@/components/BackLink';
import { getPostLoader, postSlugs } from '@/content/blog';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

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
   return { title: metadata.title, description: metadata.excerpt };
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

   return (
      <article>
         <BackLink href={`/${locale}/blog`} label={dict.blog.backToList} />

         <p className="mt-8 text-sm text-foreground/50">{formatDate(metadata.date, locale)}</p>
         <h1 className="mt-1 text-3xl font-semibold tracking-tight">{metadata.title}</h1>

         <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
            <Post />
         </div>
      </article>
   );
}
