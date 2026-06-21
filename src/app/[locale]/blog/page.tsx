import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageIntro } from '@/components/PageIntro';
import { getPostList } from '@/content/blog';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { canonicalUrl, languageAlternates, pageOpenGraph, pageTwitter } from '@/lib/seo';

function formatDate(date: string, locale: Locale): string {
   return new Date(date).toLocaleDateString(locale === 'pt-br' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
   const { locale } = await params;
   if (!isLocale(locale)) return {};
   const dict = await getDictionary(locale);
   const title = dict.blog.title;
   const description = dict.blog.subtitle;
   return {
      title,
      description,
      alternates: {
         canonical: canonicalUrl(locale, '/blog'),
         languages: languageAlternates('/blog'),
      },
      openGraph: { ...pageOpenGraph({ locale, title, description, barePath: '/blog' }), type: 'website' },
      twitter: pageTwitter({ locale, title, description }),
   };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);
   const posts = await getPostList(locale);

   return (
      <div className="flex flex-col gap-12">
         <PageIntro eyebrow={dict.blog.eyebrow} title={dict.blog.title}>
            {dict.blog.subtitle}
         </PageIntro>

         {posts.length === 0 ? (
            <div
               className="animate-rise rounded-2xl border border-dashed border-foreground/15 px-6 py-16 text-center"
               style={{ animationDelay: '80ms' }}
            >
               <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">{`// ${dict.blog.eyebrow}`}</p>
               <p className="mt-4 text-foreground/70">{dict.blog.empty}</p>
               <p className="mt-2 text-sm text-foreground/60">{dict.blog.emptyHint}</p>
            </div>
         ) : (
            <ul className="animate-rise space-y-10" style={{ animationDelay: '80ms' }}>
               {posts.map((post, postIndex) => (
                  <li key={post.slug} className="flex gap-4">
                     <span aria-hidden className="mt-1 font-mono text-xs text-accent">
                        {String(postIndex + 1).padStart(2, '0')}
                     </span>
                     <div>
                        <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/60">
                           {formatDate(post.date, locale)}
                        </p>
                        <h2 className="mt-1.5 text-xl font-medium">
                           <Link
                              href={`/${locale}/blog/${post.slug}`}
                              className="transition-colors hover:text-foreground/70"
                           >
                              {post.title}
                           </Link>
                        </h2>
                        <p className="mt-2 leading-relaxed text-foreground/70">{post.excerpt}</p>
                        <Link
                           href={`/${locale}/blog/${post.slug}`}
                           className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                           {dict.blog.readMore} →
                        </Link>
                     </div>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
