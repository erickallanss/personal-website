import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { SocialLinks } from '@/components/SocialLinks';
import { buttonPrimary, buttonSecondary } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { getPostList } from '@/content/blog';
import { getProjectList } from '@/content/portfolio';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProjectImages } from '@/lib/projectImages';

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
   const projects = (await getProjectList(locale)).slice(0, 2).map((project) => ({
      ...project,
      cover: getProjectImages(project.slug)[0] ?? null,
   }));
   const latestPost = (await getPostList(locale))[0];

   return (
      <div className="flex flex-col gap-24">
         {/* Hero — accent left-rule + value prop + mono meta panel */}
         <section className="animate-rise">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{`// ${dict.home.role}`}</p>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
               {dict.home.greeting}
            </h1>
            <p className="mt-6 max-w-prose text-xl font-medium leading-snug text-foreground">{dict.home.tagline}</p>
            <p className="mt-4 max-w-prose leading-relaxed text-foreground/65">{dict.home.intro}</p>

            <dl className="mt-9 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
               <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                     {dict.home.focusLabel}
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                     {dict.home.skills.map((skill) => (
                        <span
                           key={skill}
                           className="rounded-md border border-foreground/15 px-2 py-0.5 text-xs text-foreground/75"
                        >
                           {skill}
                        </span>
                     ))}
                  </dd>
               </div>
               <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                     {dict.home.elsewhereLabel}
                  </dt>
                  <dd className="mt-2.5">
                     <SocialLinks />
                  </dd>
               </div>
            </dl>

            <div className="mt-9 flex flex-wrap gap-3">
               <Link href={`/${locale}/portfolio`} className={buttonPrimary}>
                  {dict.home.ctaPortfolio}
               </Link>
               <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className={buttonSecondary}>
                  {dict.home.ctaContact}
               </a>
            </div>
         </section>

         {/* Recent work — numbered editorial cards */}
         {projects.length > 0 && (
            <section className="animate-rise" style={{ animationDelay: '0.08s' }}>
               <div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
                  <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-foreground/75">
                     <span className="text-accent">01</span> — {dict.home.recentWork}
                  </h2>
                  <Link
                     href={`/${locale}/portfolio`}
                     className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                     {dict.home.viewAll}
                  </Link>
               </div>
               <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  {projects.map((project, i) => (
                     <article key={project.slug} className="group flex flex-col">
                        <Link
                           href={`/${locale}/portfolio/${project.slug}`}
                           aria-label={project.name}
                           className="block overflow-hidden rounded-xl border border-foreground/10"
                        >
                           <div className="aspect-video overflow-hidden bg-foreground/5">
                              {project.cover ? (
                                 <Image
                                    src={project.cover.src}
                                    alt=""
                                    width={project.cover.width}
                                    height={project.cover.height}
                                    sizes="(min-width: 640px) 50vw, 100vw"
                                    priority={i === 0}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                 />
                              ) : (
                                 <div className="flex h-full items-center justify-center">
                                    <span className="text-4xl font-semibold text-foreground/15">
                                       {project.name.charAt(0)}
                                    </span>
                                 </div>
                              )}
                           </div>
                        </Link>
                        <div className="mt-4 flex items-start gap-3">
                           <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                           <div>
                              <h3 className="font-medium leading-snug">
                                 <Link
                                    href={`/${locale}/portfolio/${project.slug}`}
                                    className="transition-colors hover:text-foreground/70"
                                 >
                                    {project.name}
                                 </Link>
                              </h3>
                              <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">{project.excerpt}</p>
                           </div>
                        </div>
                     </article>
                  ))}
               </div>
            </section>
         )}

         {/* From the blog — appears once posts exist */}
         {latestPost && (
            <section className="animate-rise" style={{ animationDelay: '0.16s' }}>
               <div className="flex items-baseline justify-between border-b border-foreground/10 pb-3">
                  <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-foreground/75">
                     <span className="text-accent">02</span> — {dict.home.fromBlog}
                  </h2>
                  <Link
                     href={`/${locale}/blog`}
                     className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                     {dict.home.viewAll}
                  </Link>
               </div>
               <article className="mt-6 flex items-start gap-3">
                  <span className="font-mono text-xs text-accent">01</span>
                  <div>
                     <p className="font-mono text-xs text-foreground/60">{formatDate(latestPost.date, locale)}</p>
                     <h3 className="mt-1 text-lg font-medium">
                        <Link
                           href={`/${locale}/blog/${latestPost.slug}`}
                           className="transition-colors hover:text-foreground/70"
                        >
                           {latestPost.title}
                        </Link>
                     </h3>
                     <p className="mt-2 leading-relaxed text-foreground/70">{latestPost.excerpt}</p>
                  </div>
               </article>
            </section>
         )}
      </div>
   );
}
