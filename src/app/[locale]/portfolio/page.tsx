import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageIntro } from '@/components/PageIntro';
import { getProjectList } from '@/content/portfolio';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProjectImages } from '@/lib/projectImages';
import { canonicalUrl, languageAlternates, pageOpenGraph, pageTwitter } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
   const { locale } = await params;
   if (!isLocale(locale)) return {};
   const dict = await getDictionary(locale);
   const title = dict.portfolio.title;
   const description = dict.portfolio.subtitle;
   return {
      title,
      description,
      alternates: {
         canonical: canonicalUrl(locale, '/portfolio'),
         languages: languageAlternates('/portfolio'),
      },
      openGraph: { ...pageOpenGraph({ locale, title, description, barePath: '/portfolio' }), type: 'website' },
      twitter: pageTwitter({ locale, title, description }),
   };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);
   const projects = (await getProjectList(locale)).map((project) => ({
      ...project,
      cover: getProjectImages(project.slug)[0] ?? null,
   }));

   return (
      <div className="flex flex-col gap-12">
         <PageIntro eyebrow={dict.portfolio.eyebrow} title={dict.portfolio.title}>
            {dict.portfolio.subtitle}
         </PageIntro>

         <div className="grid animate-rise gap-6 sm:grid-cols-2" style={{ animationDelay: '80ms' }}>
            {projects.map((project, projectIndex) => {
               const href = `/${locale}/portfolio/${project.slug}`;
               return (
                  <article
                     key={project.slug}
                     className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-all hover:border-foreground/25 hover:shadow-lg"
                  >
                     <Link href={href} tabIndex={-1} aria-hidden className="block overflow-hidden">
                        <div className="aspect-video overflow-hidden bg-foreground/5">
                           {project.cover ? (
                              <Image
                                 src={project.cover.src}
                                 alt=""
                                 width={project.cover.width}
                                 height={project.cover.height}
                                 sizes="(min-width: 640px) 50vw, 100vw"
                                 priority={projectIndex === 0}
                                 className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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

                     <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                           <h2 className="flex items-baseline gap-2.5 text-lg font-medium leading-snug">
                              <span aria-hidden className="font-mono text-xs text-accent">
                                 {String(projectIndex + 1).padStart(2, '0')}
                              </span>
                              <Link href={href} className="transition-colors hover:text-foreground/70">
                                 {project.name}
                              </Link>
                           </h2>
                           <span
                              aria-hidden
                              className="mt-1 shrink-0 text-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-foreground/60"
                           >
                              →
                           </span>
                        </div>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">{project.excerpt}</p>

                        {project.tags && project.tags.length > 0 && (
                           <ul className="mt-4 flex flex-wrap gap-2">
                              {project.tags.map((tag) => (
                                 <li
                                    key={tag}
                                    className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs text-foreground/60"
                                 >
                                    {tag}
                                 </li>
                              ))}
                           </ul>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                           {project.liveUrl && (
                              <a
                                 href={project.liveUrl}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="underline underline-offset-4 hover:text-foreground/70"
                              >
                                 {dict.portfolio.viewLive} ↗
                              </a>
                           )}
                           {project.repoUrl && (
                              <a
                                 href={project.repoUrl}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="underline underline-offset-4 hover:text-foreground/70"
                              >
                                 {dict.portfolio.viewRepo}
                              </a>
                           )}
                           {project.private && <span className="text-foreground/60">{dict.portfolio.private}</span>}
                        </div>
                     </div>
                  </article>
               );
            })}
         </div>
      </div>
   );
}
