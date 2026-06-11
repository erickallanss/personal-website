import { NextResponse, type NextRequest } from 'next/server';

import { defaultLocale, locales } from '@/i18n/config';

// Next.js 16 renamed middleware -> proxy. This detects the locale and redirects unlocalized
// requests (e.g. "/about") to the locale-prefixed path (e.g. "/en/about").
function getLocale(request: NextRequest): string {
   const header = request.headers.get('accept-language');
   const preferred = header?.split(',')[0]?.trim().toLowerCase();
   if (preferred) {
      const exact = (locales as readonly string[]).find((locale) => locale === preferred);
      if (exact) return exact;
      const base = preferred.split('-')[0];
      const byBase = (locales as readonly string[]).find((locale) => locale.split('-')[0] === base);
      if (byBase) return byBase;
   }
   return defaultLocale;
}

export function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl;
   const hasLocale = (locales as readonly string[]).some(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
   );
   if (hasLocale) return;

   const locale = getLocale(request);
   request.nextUrl.pathname = `/${locale}${pathname}`;
   return NextResponse.redirect(request.nextUrl);
}

export const config = {
   // Run on everything except Next internals and files with an extension (static assets).
   matcher: ['/((?!_next|.*\\..*).*)'],
};
