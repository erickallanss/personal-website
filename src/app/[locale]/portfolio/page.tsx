import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProjectList } from '@/content/portfolio';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProjectImages } from '@/lib/projectImages';

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);
   const projects = (await getProjectList(locale)).map((project) => ({
      ...project,
      cover: getProjectImages(project.slug)[0] ?? null,
   }));

   return (
      <section>
         <h1 className="text-3xl font-semibold tracking-tight">{dict.portfolio.title}</h1>
         <p className="mt-3 text-foreground/60">{dict.portfolio.subtitle}</p>

         <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {projects.map((project) => {
               const href = `/${locale}/portfolio/${project.slug}`;
               return (
                  <article
                     key={project.slug}
                     className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-all hover:border-foreground/25 hover:shadow-lg"
                  >
                     <Link href={href} aria-label={project.name} className="block overflow-hidden">
                        <div className="aspect-video overflow-hidden bg-foreground/5">
                           {project.cover ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                 src={project.cover}
                                 alt={project.name}
                                 className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                           ) : (
                              <div className="flex h-full items-center justify-center">
                                 <span className="text-4xl font-semibold text-foreground/15">{project.name.charAt(0)}</span>
                              </div>
                           )}
                        </div>
                     </Link>

                     <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                           <h2 className="text-lg font-medium leading-snug">
                              <Link href={href} className="transition-colors hover:text-foreground/70">
                                 {project.name}
                              </Link>
                           </h2>
                           <span aria-hidden className="mt-1 shrink-0 text-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-foreground/60">
                              →
                           </span>
                        </div>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">{project.excerpt}</p>

                        {project.tags && project.tags.length > 0 && (
                           <ul className="mt-4 flex flex-wrap gap-2">
                              {project.tags.map((tag) => (
                                 <li key={tag} className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs text-foreground/60">
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
                           {project.private && <span className="text-foreground/40">{dict.portfolio.private}</span>}
                        </div>
                     </div>
                  </article>
               );
            })}
         </div>
      </section>
   );
}
