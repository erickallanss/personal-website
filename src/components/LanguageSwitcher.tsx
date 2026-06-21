'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactElement } from 'react';

import { localeNamesFull, locales, type Locale } from '@/i18n/config';

// Inline SVG flags (reliable cross-platform — emoji flags don't render on Windows).
function FlagEN() {
   return (
      <svg viewBox="0 0 60 30" className="block h-3.5 w-5" aria-hidden="true">
         <rect width="60" height="30" fill="#012169" />
         <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
         <path d="M0 0 60 30M60 0 0 30" stroke="#c8102e" strokeWidth="4" />
         <path d="M30 0V30M0 15H60" stroke="#fff" strokeWidth="10" />
         <path d="M30 0V30M0 15H60" stroke="#c8102e" strokeWidth="6" />
      </svg>
   );
}

function FlagPT() {
   return (
      <svg viewBox="0 0 640 480" className="block h-3.5 w-5" aria-hidden="true">
         <rect width="640" height="480" fill="#009b3a" />
         <path d="M320 48 584 240 320 432 56 240Z" fill="#fedf00" />
         <circle cx="320" cy="240" r="105" fill="#002776" />
      </svg>
   );
}

const FLAGS: Record<Locale, () => ReactElement> = {
   en: FlagEN,
   'pt-br': FlagPT,
};

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
   const router = useRouter();
   const pathname = usePathname();

   const switchTo = (next: Locale) => {
      if (next === locale) return;
      const rest = pathname.replace(new RegExp(`^/${locale}`), '');
      router.push(`/${next}${rest}` || `/${next}`);
   };

   return (
      <div role="group" aria-label={label} className="flex items-center gap-0.5">
         {locales.map((option) => {
            const active = option === locale;
            const Flag = FLAGS[option];
            return (
               <button
                  key={option}
                  type="button"
                  onClick={() => switchTo(option)}
                  aria-current={active ? 'true' : undefined}
                  aria-label={localeNamesFull[option]}
                  className="group grid size-8 place-items-center rounded-md transition-colors hover:bg-foreground/5"
               >
                  <span
                     className={`block overflow-hidden rounded-sm transition ${
                        active
                           ? 'opacity-100 ring-1 ring-foreground/45'
                           : 'opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0'
                     }`}
                  >
                     <Flag />
                  </span>
               </button>
            );
         })}
      </div>
   );
}
