'use client';

import { useSyncExternalStore } from 'react';

import { getEnabled, getFactSeed, getServerEnabled, getServerSeed, subscribe } from '@/lib/appearance';

// Rendered only in Linux mode: a fake terminal window with a random curiosity from the facts pool.
export function LinuxScreen({ facts }: { facts: string[] }) {
   const enabled = useSyncExternalStore(subscribe, getEnabled, getServerEnabled);
   const seed = useSyncExternalStore(subscribe, getFactSeed, getServerSeed);

   if (!enabled || facts.length === 0) return null;

   const fact = facts[Math.floor(seed * facts.length) % facts.length];

   return (
      <div className="mx-auto w-full max-w-3xl px-6 pt-8">
         <div className="overflow-hidden rounded-lg border border-foreground/30 font-mono text-sm shadow-lg">
            <div className="flex items-center gap-2 border-b border-foreground/20 bg-foreground/5 px-3 py-2">
               <span className="size-3 rounded-full bg-red-500/80" />
               <span className="size-3 rounded-full bg-yellow-500/80" />
               <span className="size-3 rounded-full bg-green-500/80" />
               <span className="ml-2 opacity-60">erick@portfolio: ~</span>
            </div>
            <div className="space-y-1 px-4 py-4 leading-relaxed">
               <p>
                  <span className="opacity-50">$</span> uname -o
               </p>
               <p className="opacity-80">GNU/Linux</p>
               <p>
                  <span className="opacity-50">$</span> fortune linux
               </p>
               <p className="opacity-95">{fact}</p>
               <p className="opacity-60">
                  $ <span className="ml-0.5 inline-block w-2 animate-pulse">▍</span>
               </p>
            </div>
         </div>
      </div>
   );
}
