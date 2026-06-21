/** Site-wide, language-neutral config. Single source of truth for SEO + shareability. */

import { type Locale } from '@/i18n/config';

/**
 * Canonical base URL. Derived from a single env var so the whole SEO surface
 * (metadataBase, canonicals, hreflang, sitemap, robots, JSON-LD, OG images) works
 * the moment the real domain is set — no code changes needed.
 *
 * Currently the Vercel URL; set NEXT_PUBLIC_SITE_URL in the deployment env to override
 * with a custom domain later. Trailing slash is stripped so `${url}/path` stays clean.
 */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://erickallan.vercel.app';
const PHONE = '+55 84 99650-1098';

export const siteConfig = {
   name: 'Erick Allan',
   email: 'erickallann@gmail.com',
   linkedin: 'https://www.linkedin.com/in/erickallanss/',
   github: 'https://github.com/erickallanss',
   cv: '/erick-allan-cv.pdf', // English CV (lives in /public), shown regardless of locale
   phone: PHONE,
   /** wa.me link (digits only). Surfaces the phone publicly via the WhatsApp social link. */
   whatsapp: `https://wa.me/${PHONE.replace(/\D/g, '')}`,

   /** Canonical origin, no trailing slash. All URLs in the SEO layer derive from this. */
   url: RAW_SITE_URL.replace(/\/+$/, ''),

   /** Professional role per locale — used in OG cards and JSON-LD `jobTitle`. */
   role: {
      en: 'Software Engineer · AI Engineer',
      'pt-br': 'Software Engineer · AI Engineer',
   } satisfies Record<Locale, string>,

   /** Brand colors for the generated OpenGraph/Twitter card (mirrors the .dark theme). */
   og: {
      background: '#0a0a0a',
      foreground: '#ededed',
      muted: '#8f8f8f',
      accent: '#4ade80', // the linux-skin green, used as the brand accent on the card
   },
} as const;

/** Absolute URL helper. Pass a path beginning with "/" (or "") — returns `${siteConfig.url}${path}`. */
export const absoluteUrl = (path = ''): string => `${siteConfig.url}${path}`;
