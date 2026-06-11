import 'server-only';

import type { Locale } from './config';

// Server-only dictionary loader (Next.js 16 built-in i18n). Translation JSON never ships to the client.
const dictionaries = {
   en: () => import('./en.json').then((module) => module.default),
   'pt-br': () => import('./pt-br.json').then((module) => module.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export const getDictionary = (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
