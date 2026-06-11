'use client';

import { useSyncExternalStore } from 'react';

import { enterLinux, exitToTheme, getMode, getServerMode, subscribe } from '@/lib/appearance';

// Toggles the fixed Linux/terminal skin (and its random curiosity).
export function LinuxModeButton({ label }: { label: string }) {
   const active = useSyncExternalStore(subscribe, getMode, getServerMode) === 'linux';

   return (
      <button
         type="button"
         aria-label={label}
         title={label}
         onClick={() => (active ? exitToTheme() : enterLinux())}
         className={`grid size-8 place-items-center rounded-md text-[16px] leading-none transition-opacity ${
            active ? 'opacity-100' : 'opacity-30 hover:opacity-70'
         }`}
      >
         🐧
      </button>
   );
}
