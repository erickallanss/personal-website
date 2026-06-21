import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CopyButton } from '@/components/CopyButton';
import { MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/icons';
import { PageIntro } from '@/components/PageIntro';
import { siteConfig } from '@/config/site';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { canonicalUrl, languageAlternates, pageOpenGraph, pageTwitter } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
   const { locale } = await params;
   if (!isLocale(locale)) return {};
   const dict = await getDictionary(locale);
   const title = dict.contact.title;
   const description = dict.contact.subtitle;
   return {
      title,
      description,
      alternates: {
         canonical: canonicalUrl(locale, '/contact'),
         languages: languageAlternates('/contact'),
      },
      openGraph: { ...pageOpenGraph({ locale, title, description, barePath: '/contact' }), type: 'website' },
      twitter: pageTwitter({ locale, title, description }),
   };
}

const cardBase = 'flex items-center gap-4 rounded-xl border border-foreground/10 p-4';
const cardLink = `group ${cardBase} transition-colors hover:border-foreground/25`;
const iconClass = 'size-5 shrink-0 text-foreground/70';
const labelClass = 'font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60';
const arrowClass = 'ml-auto shrink-0 text-foreground/30 transition-colors group-hover:text-foreground/60';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const dict = await getDictionary(locale);
   const telHref = `tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`;

   return (
      <div className="flex flex-col gap-12">
         <PageIntro eyebrow={dict.contact.eyebrow} title={dict.contact.title}>
            {dict.contact.subtitle}
         </PageIntro>

         <div className="grid animate-rise gap-3 sm:max-w-lg" style={{ animationDelay: '80ms' }}>
            <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer" className={cardLink}>
               <WhatsAppIcon className={iconClass} />
               <div className="min-w-0">
                  <div className={labelClass}>{dict.contact.whatsappLabel}</div>
                  <div className="mt-0.5 text-foreground/90">{siteConfig.phone}</div>
               </div>
               <span aria-hidden className={arrowClass}>
                  ↗
               </span>
            </a>

            <div className={cardBase}>
               <MailIcon className={iconClass} />
               <div className="min-w-0">
                  <div className={labelClass}>{dict.contact.emailLabel}</div>
                  <div className="mt-0.5 select-all break-all text-foreground/90">{siteConfig.email}</div>
               </div>
               <div className="ml-auto shrink-0">
                  <CopyButton text={siteConfig.email} label={dict.contact.copy} copiedLabel={dict.contact.copied} />
               </div>
            </div>

            <a href={telHref} className={cardLink}>
               <PhoneIcon className={iconClass} />
               <div className="min-w-0">
                  <div className={labelClass}>{dict.contact.phoneLabel}</div>
                  <div className="mt-0.5 text-foreground/90">{siteConfig.phone}</div>
               </div>
               <span aria-hidden className={arrowClass}>
                  ↗
               </span>
            </a>
         </div>
      </div>
   );
}
