'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { enterRandom, getMode, getServerMode, subscribe } from '@/lib/appearance';

// Replaces the main color with a random one (keeps the current light/dark background); leaves Linux mode.
export function RandomThemeButton({ label }: { label: string }) {
   const { resolvedTheme } = useTheme();
   const active = useSyncExternalStore(subscribe, getMode, getServerMode) === 'random';

   return (
      <button
         type="button"
         aria-label={label}
         title={label}
         onClick={() => enterRandom(resolvedTheme === 'dark')}
         className={`grid size-8 place-items-center rounded-md text-[16px] leading-none transition-opacity ${
            active ? 'opacity-100' : 'opacity-30 hover:opacity-70'
         }`}
      >
         🎲
      </button>
   );
}
