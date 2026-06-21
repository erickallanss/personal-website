'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { buttonSecondary } from '@/components/ui/button';
import { defaultLocale, isLocale } from '@/i18n/config';

// 404 boundary, rendered inside the [locale] layout. A not-found boundary can't read route params or
// the server dictionary, so we derive the locale from the pathname and localize copy inline. The CTA
// routes to the active locale's home (there is no redirect-less root `/` route to fall back on).
const COPY = {
   en: {
      title: 'Page not found',
      body: 'The page you’re looking for doesn’t exist or may have moved.',
      cta: 'Go home',
   },
   'pt-br': {
      title: 'Página não encontrada',
      body: 'A página que você procura não existe ou pode ter sido movida.',
      cta: 'Voltar ao início',
   },
} as const;

export default function NotFound() {
   const pathname = usePathname();
   const seg = pathname.split('/')[1];
   const locale = isLocale(seg) ? seg : defaultLocale;
   const copy = COPY[locale];

   return (
      <section className="animate-rise">
         <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{'// 404'}</p>
         <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
         <p className="mt-4 max-w-prose text-lg leading-relaxed text-foreground/70">{copy.body}</p>
         <Link href={`/${locale}`} className={`${buttonSecondary} mt-8`}>
            {copy.cta}
         </Link>
      </section>
   );
}
