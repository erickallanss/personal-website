import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { ReactNode } from 'react';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import '../globals.css';
import { AppearanceSync } from '@/components/AppearanceSync';
import { CommandMenu, type CommandLabels } from '@/components/CommandMenu';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PersonJsonLd, WebSiteJsonLd } from '@/components/JsonLd';
import { LinuxScreen } from '@/components/LinuxScreen';
import { ThemeProvider } from '@/components/ThemeProvider';
import { siteConfig } from '@/config/site';
import { htmlLang, isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getLinuxFacts } from '@/lib/linuxFacts';
import { alternateOgLocales, canonicalUrl, languageAlternates, ogLocale } from '@/lib/seo';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
   display: 'swap',
   preload: false, // mono is only used for small accent labels, not LCP body text
});

// Applies the persisted Linux skin + random foreground color before paint (no flash).
// Reads 'fg2' (bumped from 'fg') so legacy low-contrast random colors are dropped.
const themeRuntimeScript = `try{if(localStorage.getItem('linux')){document.documentElement.classList.add('linux');}var f=localStorage.getItem('fg2');if(f){document.documentElement.style.setProperty('--foreground',f);}}catch(e){}`;

export function generateStaticParams() {
   return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
   const { locale } = await params;
   if (!isLocale(locale)) return {};
   const dict = await getDictionary(locale);
   const title = dict.meta.title;
   const description = dict.meta.description;

   return {
      metadataBase: new URL(siteConfig.url),
      // `%s` is filled by per-page `title` values; the bare layout title is the default.
      title: { default: title, template: `%s — ${siteConfig.name}` },
      description,
      applicationName: siteConfig.name,
      authors: [{ name: siteConfig.name, url: `${siteConfig.url}/${locale}` }],
      creator: siteConfig.name,
      alternates: {
         canonical: canonicalUrl(locale),
         languages: languageAlternates(),
      },
      openGraph: {
         type: 'website',
         url: canonicalUrl(locale),
         siteName: siteConfig.name,
         title,
         description,
         locale: ogLocale[locale],
         alternateLocale: alternateOgLocales(locale),
         // images intentionally omitted: Next auto-attaches the co-located opengraph-image.tsx.
      },
      twitter: {
         card: 'summary_large_image',
         title,
         description,
         // twitter-image.tsx is auto-attached likewise.
      },
      robots: {
         index: true,
         follow: true,
         googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
      },
   };
}

export default async function LocaleLayout({
   children,
   params,
}: {
   children: ReactNode;
   params: Promise<{ locale: string }>;
}) {
   const { locale } = await params;
   if (!isLocale(locale)) notFound();
   const safeLocale: Locale = locale;
   const dict = await getDictionary(safeLocale);
   const linuxFacts = getLinuxFacts(safeLocale);

   const commandLabels: CommandLabels = {
      placeholder: dict.command.placeholder,
      empty: dict.command.empty,
      hint: dict.command.hint,
      groupNav: dict.command.groupNav,
      groupTheme: dict.command.groupTheme,
      groupLinks: dict.command.groupLinks,
      groupLang: dict.command.groupLang,
      copyEmail: dict.command.copyEmail,
      copiedEmail: dict.command.copiedEmail,
      downloadCv: dict.command.downloadCv,
      nav: {
         home: dict.nav.home,
         portfolio: dict.nav.portfolio,
         about: dict.nav.about,
         blog: dict.nav.blog,
         contact: dict.nav.contact,
      },
      theme: { toggle: dict.theme.toggle, random: dict.theme.random, linux: dict.theme.linux },
   };

   return (
      <html
         lang={htmlLang[safeLocale]}
         suppressHydrationWarning
         className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
         <body className="flex min-h-full flex-col bg-background text-foreground">
            <Script id="theme-runtime" strategy="beforeInteractive">
               {themeRuntimeScript}
            </Script>
            <a
               href="#main-content"
               className="sr-only rounded-md focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground"
            >
               {dict.nav.skipToContent}
            </a>
            <PersonJsonLd locale={safeLocale} role={siteConfig.role[safeLocale]} />
            <WebSiteJsonLd locale={safeLocale} description={dict.meta.description} />
            <AppearanceSync />
            <ThemeProvider>
               <Header locale={safeLocale} dict={dict} />
               <LinuxScreen facts={linuxFacts} />
               <main
                  id="main-content"
                  tabIndex={-1}
                  className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 outline-none sm:py-24"
               >
                  {children}
               </main>
               <Footer dict={dict} />
               <CommandMenu locale={safeLocale} labels={commandLabels} />
            </ThemeProvider>
            <Analytics />
            <SpeedInsights />
         </body>
      </html>
   );
}
