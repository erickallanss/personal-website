import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BackLink } from '@/components/BackLink';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { ProjectGallery } from '@/components/ProjectGallery';
import { buttonSecondary } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { getProjectLoader, projectSlugs } from '@/content/portfolio';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProjectImages } from '@/lib/projectImages';
import { canonicalUrl, languageAlternates, pageOpenGraph, pageTwitter } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
   return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
   const { locale, slug } = await params;
   if (!isLocale(locale)) return {};
   const loader = getProjectLoader(slug, locale);
   if (!loader) return {};
   const { metadata } = await loader();
   const path = `/portfolio/${slug}`;
   const title = metadata.name;
   const description = metadata.excerpt;
   return {
      title,
      description,
      alternates: {
         canonical: canonicalUrl(locale, path),
         languages: languageAlternates(path),
      },
      openGraph: { ...pageOpenGraph({ locale, title, description, barePath: path, ogImagePath: path }), type: 'article' },
      twitter: pageTwitter({ locale, title, description, ogImagePath: path }),
   };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
   const { locale, slug } = await params;
   if (!isLocale(locale)) notFound();
   const loader = getProjectLoader(slug, locale);
   if (!loader) notFound();
   const dict = await getDictionary(locale);
   const { default: Project, metadata } = await loader();
   const images = getProjectImages(slug);
   const path = `/portfolio/${slug}`;
   const url = canonicalUrl(locale, path);

   return (
      <article>
         <BreadcrumbJsonLd
            items={[
               { name: siteConfig.name, item: canonicalUrl(locale) },
               { name: dict.portfolio.title, item: canonicalUrl(locale, '/portfolio') },
               { name: metadata.name, item: url },
            ]}
         />
         <ArticleJsonLd
            type="CreativeWork"
            locale={locale}
            headline={metadata.name}
            description={metadata.excerpt}
            url={url}
            image={`${url}/opengraph-image`}
         />
         <BackLink href={`/${locale}/portfolio`} label={dict.portfolio.backToList} />

         <header className="mt-8 animate-rise">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{`// ${dict.portfolio.eyebrow}`}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl">{metadata.name}</h1>

            {metadata.tags && metadata.tags.length > 0 && (
               <ul className="mt-4 flex flex-wrap gap-2">
                  {metadata.tags.map((tag) => (
                     <li key={tag} className="rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs text-foreground/60">
                        {tag}
                     </li>
                  ))}
               </ul>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
               {metadata.repoUrl && (
                  <a href={metadata.repoUrl} target="_blank" rel="noreferrer" className={buttonSecondary}>
                     {dict.portfolio.viewRepo}
                  </a>
               )}
               {metadata.liveUrl && (
                  <a href={metadata.liveUrl} target="_blank" rel="noreferrer" className={buttonSecondary}>
                     {dict.portfolio.viewLive} ↗
                  </a>
               )}
               {metadata.private && <span className="text-sm text-foreground/60">{dict.portfolio.private}</span>}
            </div>

            {(metadata.role || metadata.projectType || metadata.status || metadata.timeline) && (
               <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:max-w-lg">
                  {metadata.role && (
                     <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                           {dict.portfolio.facts.role}
                        </dt>
                        <dd className="mt-1 text-sm text-foreground/80">{metadata.role}</dd>
                     </div>
                  )}
                  {metadata.projectType && (
                     <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                           {dict.portfolio.facts.type}
                        </dt>
                        <dd className="mt-1 text-sm text-foreground/80">{metadata.projectType}</dd>
                     </div>
                  )}
                  {metadata.status && (
                     <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                           {dict.portfolio.facts.status}
                        </dt>
                        <dd className="mt-1 text-sm text-foreground/80">{metadata.status}</dd>
                     </div>
                  )}
                  {metadata.timeline && (
                     <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">
                           {dict.portfolio.facts.timeline}
                        </dt>
                        <dd className="mt-1 text-sm text-foreground/80">{metadata.timeline}</dd>
                     </div>
                  )}
               </dl>
            )}
         </header>

         {images.length > 0 && (
            <div className="mt-12 animate-rise" style={{ animationDelay: '80ms' }}>
               <ProjectGallery images={images} name={metadata.name} labels={dict.portfolio.gallery} />
            </div>
         )}

         <div className="prose mt-12 animate-rise" style={{ animationDelay: '140ms' }}>
            <Project />
         </div>
      </article>
   );
}
