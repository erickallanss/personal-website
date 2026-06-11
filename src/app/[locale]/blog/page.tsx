import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getPostList } from '@/content/blog';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

function formatDate(date: string, locale: Locale): string {
   return new Date(date).toLocaleDateString(locale === 'pt-br' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);
   const posts = await getPostList(locale);

   return (
      <section>
         <h1 className="text-3xl font-semibold tracking-tight">{dict.blog.title}</h1>
         <p className="mt-3 text-foreground/60">{dict.blog.subtitle}</p>

         {posts.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-foreground/15 px-6 py-16 text-center">
               <p className="text-foreground/70">{dict.blog.empty}</p>
               <p className="mt-2 text-sm text-foreground/45">{dict.blog.emptyHint}</p>
            </div>
         ) : (
            <ul className="mt-10 space-y-10">
               {posts.map((post) => (
                  <li key={post.slug}>
                     <p className="text-sm text-foreground/50">{formatDate(post.date, locale)}</p>
                     <h2 className="mt-1 text-xl font-medium">
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
                        className="mt-3 inline-block text-sm underline underline-offset-4 hover:text-foreground/70"
                     >
                        {dict.blog.readMore} →
                     </Link>
                  </li>
               ))}
            </ul>
         )}
      </section>
   );
}
