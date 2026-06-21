'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { exitToTheme, getMode, getServerMode, subscribe } from '@/lib/appearance';

function SunIcon({ className }: { className?: string }) {
   return (
      <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
         <circle cx="12" cy="12" r="4" />
         <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
   );
}

function MoonIcon({ className }: { className?: string }) {
   return (
      <svg className={className} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
         <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
   );
}

export function ThemeToggle({ label }: { label: string }) {
   const { resolvedTheme, setTheme } = useTheme();
   const active = useSyncExternalStore(subscribe, getMode, getServerMode) === 'theme';

   // If a random color or Linux skin is on, clicking returns to the plain theme; otherwise flips light/dark.
   const onClick = () => {
      if (!active) exitToTheme();
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
   };

   return (
      <button
         type="button"
         aria-label={label}
         title={label}
         aria-pressed={resolvedTheme === 'dark'}
         onClick={onClick}
         className={`grid size-8 place-items-center rounded-md text-foreground transition-opacity ${
            active ? 'opacity-100' : 'opacity-60 hover:opacity-100'
         }`}
      >
         <SunIcon className="hidden dark:block" />
         <MoonIcon className="block dark:hidden" />
      </button>
   );
}
