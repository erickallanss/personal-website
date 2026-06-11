import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { ReactNode } from 'react';

import '../globals.css';
import { AppearanceSync } from '@/components/AppearanceSync';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { LinuxScreen } from '@/components/LinuxScreen';
import { ThemeProvider } from '@/components/ThemeProvider';
import { htmlLang, isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getLinuxFacts } from '@/lib/linuxFacts';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// Applies the persisted Linux skin + random foreground color before paint (no flash).
const themeRuntimeScript = `try{if(localStorage.getItem('linux')){document.documentElement.classList.add('linux');}var f=localStorage.getItem('fg');if(f){document.documentElement.style.setProperty('--foreground',f);}}catch(e){}`;

export function generateStaticParams() {
   return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
   const { locale } = await params;
   if (!isLocale(locale)) return {};
   const dict = await getDictionary(locale);
   return { title: dict.meta.title, description: dict.meta.description };
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
   const dict = await getDictionary(locale);
   const linuxFacts = getLinuxFacts(locale);

   return (
      <html
         lang={htmlLang[locale]}
         suppressHydrationWarning
         className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
         <body className="flex min-h-full flex-col bg-background text-foreground">
            <Script id="theme-runtime" strategy="beforeInteractive">
               {themeRuntimeScript}
            </Script>
            <AppearanceSync />
            <ThemeProvider>
               <Header locale={locale} dict={dict} />
               <LinuxScreen facts={linuxFacts} />
               <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:py-24">{children}</main>
               <Footer dict={dict} />
            </ThemeProvider>
         </body>
      </html>
   );
}
