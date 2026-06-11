'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

// Default to dark; users can switch and the choice persists. Class-based so Tailwind's `dark:` works.
export function ThemeProvider({ children }: { children: ReactNode }) {
   return (
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
         {children}
      </NextThemesProvider>
   );
}
