import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageIntro } from '@/components/PageIntro';
import { SectionHeading } from '@/components/SectionHeading';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { canonicalUrl, languageAlternates, pageOpenGraph, pageTwitter } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
   const { locale } = await params;
   if (!isLocale(locale)) return {};
   const dict = await getDictionary(locale);
   const title = dict.about.title;
   const description = dict.about.paragraphs[0];
   return {
      title,
      description,
      alternates: {
         canonical: canonicalUrl(locale, '/about'),
         languages: languageAlternates('/about'),
      },
      openGraph: { ...pageOpenGraph({ locale, title, description, barePath: '/about' }), type: 'profile' },
      twitter: pageTwitter({ locale, title, description }),
   };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);

   return (
      <article className="flex flex-col gap-14">
         <div>
            <PageIntro eyebrow={dict.about.eyebrow} title={dict.about.title} />
            <div
               className="mt-8 max-w-prose animate-rise space-y-4 leading-relaxed text-foreground/80"
               style={{ animationDelay: '60ms' }}
            >
               {dict.about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
               ))}
            </div>
         </div>

         <section className="animate-rise" style={{ animationDelay: '120ms' }}>
            <SectionHeading index={1} title={dict.about.experienceTitle} />
            <ul className="mt-8 space-y-8">
               {dict.about.experience.map((job, index) => (
                  <li key={index}>
                     <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="font-medium">
                           {job.role} <span className="font-normal text-foreground/60">· {job.org}</span>
                        </h3>
                        <p className="shrink-0 text-sm text-foreground/60">{job.period}</p>
                     </div>
                     <p className="text-sm text-foreground/60">{job.location}</p>
                     <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-foreground/70 marker:text-foreground/30">
                        {job.points.map((point, pointIndex) => (
                           <li key={pointIndex}>{point}</li>
                        ))}
                     </ul>
                  </li>
               ))}
            </ul>
         </section>

         <section className="animate-rise" style={{ animationDelay: '180ms' }}>
            <SectionHeading index={2} title={dict.about.educationTitle} />
            <ul className="mt-8 space-y-4">
               {dict.about.education.map((item, index) => (
                  <li key={index} className="flex flex-wrap items-baseline justify-between gap-x-4">
                     <h3 className="font-medium">
                        {item.title} <span className="font-normal text-foreground/60">· {item.org}</span>
                     </h3>
                     <p className="shrink-0 text-sm text-foreground/60">{item.period}</p>
                  </li>
               ))}
            </ul>
         </section>

         <section className="animate-rise" style={{ animationDelay: '240ms' }}>
            <SectionHeading index={3} title={dict.about.interestsTitle} />
            <ul className="mt-6 flex flex-wrap gap-2">
               {dict.about.interests.map((interest, index) => (
                  <li key={index} className="rounded-full bg-foreground/5 px-3 py-1 text-sm text-foreground/70">
                     {interest}
                  </li>
               ))}
            </ul>
         </section>
      </article>
   );
}
