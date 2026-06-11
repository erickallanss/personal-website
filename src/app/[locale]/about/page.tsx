import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);

   return (
      <article>
         <h1 className="text-3xl font-semibold tracking-tight">{dict.about.title}</h1>

         <div className="mt-8 space-y-4 leading-relaxed text-foreground/80">
            {dict.about.paragraphs.map((paragraph, index) => (
               <p key={index}>{paragraph}</p>
            ))}
         </div>

         <h2 className="mt-14 text-xl font-medium">{dict.about.experienceTitle}</h2>
         <ul className="mt-6 space-y-8">
            {dict.about.experience.map((job, index) => (
               <li key={index}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                     <p className="font-medium">
                        {job.role} <span className="text-foreground/50">· {job.org}</span>
                     </p>
                     <p className="shrink-0 text-sm text-foreground/50">{job.period}</p>
                  </div>
                  <p className="text-sm text-foreground/50">{job.location}</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-foreground/70 marker:text-foreground/30">
                     {job.points.map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                     ))}
                  </ul>
               </li>
            ))}
         </ul>

         <h2 className="mt-14 text-xl font-medium">{dict.about.educationTitle}</h2>
         <ul className="mt-6 space-y-4">
            {dict.about.education.map((item, index) => (
               <li key={index} className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-medium">
                     {item.title} <span className="text-foreground/50">· {item.org}</span>
                  </p>
                  <p className="shrink-0 text-sm text-foreground/50">{item.period}</p>
               </li>
            ))}
         </ul>

         <h2 className="mt-14 text-xl font-medium">{dict.about.interestsTitle}</h2>
         <ul className="mt-4 flex flex-wrap gap-2">
            {dict.about.interests.map((interest, index) => (
               <li key={index} className="rounded-full bg-foreground/5 px-3 py-1 text-sm text-foreground/70">
                  {interest}
               </li>
            ))}
         </ul>
      </article>
   );
}
