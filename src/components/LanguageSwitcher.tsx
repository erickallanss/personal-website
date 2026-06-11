'use client';

import { usePathname, useRouter } from 'next/navigation';

import { localeNames, locales, type Locale } from '@/i18n/config';

export function LanguageSwitcher({ locale }: { locale: Locale }) {
   const router = useRouter();
   const pathname = usePathname();

   const switchTo = (next: Locale) => {
      if (next === locale) return;
      const rest = pathname.replace(new RegExp(`^/${locale}`), '');
      router.push(`/${next}${rest}` || `/${next}`);
   };

   return (
      <div className="flex items-center gap-1 text-sm">
         {locales.map((option) => {
            const active = option === locale;
            return (
               <button
                  key={option}
                  type="button"
                  onClick={() => switchTo(option)}
                  aria-current={active ? 'true' : undefined}
                  className={`rounded px-1.5 py-0.5 transition-colors ${
                     active ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'
                  }`}
               >
                  {localeNames[option]}
               </button>
            );
         })}
      </div>
   );
}
