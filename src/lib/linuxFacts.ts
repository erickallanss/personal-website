import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Locale } from '@/i18n/config';

const cache: Partial<Record<Locale, string[]>> = {};

/** Reads the per-locale curiosities markdown (build time); each `- ` bullet becomes a fact. */
export function getLinuxFacts(locale: Locale): string[] {
   const cached = cache[locale];
   if (cached) return cached;
   const raw = readFileSync(join(process.cwd(), `src/content/linux-facts/${locale}.md`), 'utf8');
   const facts = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim());
   cache[locale] = facts;
   return facts;
}
