'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Switching locale re-renders the [locale] root layout, which resets <html> and drops the
// imperatively-applied Linux class / random color. Re-apply them after every navigation so the
// chosen appearance survives (the beforeInteractive script only runs on the initial load).
export function AppearanceSync() {
   const pathname = usePathname();

   useEffect(() => {
      const root = document.documentElement;
      try {
         if (localStorage.getItem('linux') === '1') root.classList.add('linux');
         const fg = localStorage.getItem('fg2');
         if (fg) root.style.setProperty('--foreground', fg);
      } catch {
         // ignore storage failures
      }
   }, [pathname]);

   return null;
}
