import Link from 'next/link';
import { notFound } from 'next/navigation';

import { buttonPrimary, buttonSecondary } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { getPostList } from '@/content/blog';
import { getProjectList } from '@/content/portfolio';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

function formatDate(date: string, locale: Locale): string {
   return new Date(date).toLocaleDateString(locale === 'pt-br' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
   });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);
   const projects = (await getProjectList(locale)).slice(0, 2);
   const latestPost = (await getPostList(locale))[0];

   return (
      <div className="flex flex-col gap-20">
         {/* Hero */}
         <section>
            <p className="text-sm font-medium uppercase tracking-widest text-foreground/50">{dict.home.role}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{dict.home.greeting}</h1>
            <p className="mt-4 text-sm text-foreground/60">{dict.home.skills.join(' · ')}</p>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-foreground/70">{dict.home.intro}</p>

            <div className="mt-10 flex flex-wrap gap-3">
               <Link href={`/${locale}/portfolio`} className={buttonPrimary}>
                  {dict.home.ctaPortfolio}
               </Link>
               <Link href={`/${locale}/blog`} className={buttonSecondary}>
                  {dict.home.ctaBlog}
               </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-foreground/60">
               {siteConfig.linkedin && (
                  <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
                     LinkedIn
                  </a>
               )}
               {siteConfig.github && (
                  <a href={siteConfig.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
                     GitHub
                  </a>
               )}
               {siteConfig.email && (
                  <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-foreground">
                     Email
                  </a>
               )}
            </div>
         </section>

         {/* Recent work */}
         {projects.length > 0 && (
            <section>
               <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-medium">{dict.home.recentWork}</h2>
                  <Link
                     href={`/${locale}/portfolio`}
                     className="text-sm text-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                     {dict.home.viewAll}
                  </Link>
               </div>
               <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {projects.map((project) => (
                     <article
                        key={project.slug}
                        className="rounded-xl border border-foreground/10 p-5 transition-colors hover:border-foreground/30"
                     >
                        <h3 className="font-medium">
                           <Link
                              href={`/${locale}/portfolio/${project.slug}`}
                              className="transition-colors hover:text-foreground/70"
                           >
                              {project.name}
                           </Link>
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/70">{project.excerpt}</p>
                     </article>
                  ))}
               </div>
            </section>
         )}

         {/* From the blog */}
         {latestPost && (
            <section>
               <div className="flex items-baseline justify-between">
                  <h2 className="text-xl font-medium">{dict.home.fromBlog}</h2>
                  <Link
                     href={`/${locale}/blog`}
                     className="text-sm text-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                     {dict.home.viewAll}
                  </Link>
               </div>
               <article className="mt-6">
                  <p className="text-sm text-foreground/50">{formatDate(latestPost.date, locale)}</p>
                  <h3 className="mt-1 text-lg font-medium">
                     <Link
                        href={`/${locale}/blog/${latestPost.slug}`}
                        className="transition-colors hover:text-foreground/70"
                     >
                        {latestPost.title}
                     </Link>
                  </h3>
                  <p className="mt-2 leading-relaxed text-foreground/70">{latestPost.excerpt}</p>
               </article>
            </section>
         )}
      </div>
   );
}
