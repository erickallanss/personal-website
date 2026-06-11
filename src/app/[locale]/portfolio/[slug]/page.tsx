import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BackLink } from '@/components/BackLink';
import { ProjectGallery } from '@/components/ProjectGallery';
import { buttonSecondary } from '@/components/ui/button';
import { getProjectLoader, projectSlugs } from '@/content/portfolio';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProjectImages } from '@/lib/projectImages';

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
   return { title: metadata.name, description: metadata.excerpt };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
   const { locale, slug } = await params;
   if (!isLocale(locale)) notFound();
   const loader = getProjectLoader(slug, locale);
   if (!loader) notFound();
   const dict = await getDictionary(locale);
   const { default: Project, metadata } = await loader();
   const images = getProjectImages(slug);

   return (
      <article>
         <BackLink href={`/${locale}/portfolio`} label={dict.portfolio.backToList} />

         <h1 className="mt-8 text-3xl font-semibold tracking-tight">{metadata.name}</h1>

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
            {metadata.private && <span className="text-sm text-foreground/40">{dict.portfolio.private}</span>}
         </div>

         {images.length > 0 && (
            <div className="mt-8">
               <ProjectGallery images={images} name={metadata.name} labels={dict.portfolio.gallery} />
            </div>
         )}

         <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
            <Project />
         </div>
      </article>
   );
}
