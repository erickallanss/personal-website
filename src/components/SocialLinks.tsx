import type { ReactElement } from 'react';

import { siteConfig } from '@/config/site';

import { GitHubIcon, LinkedInIcon, MailIcon, WhatsAppIcon } from './icons';

interface SocialItem {
   label: string;
   href: string;
   external: boolean;
   Icon: (props: { className?: string }) => ReactElement;
}

/**
 * Row of icon + label contact links, built from siteConfig. A link only renders if its config
 * value is set (so GitHub appears once siteConfig.github is filled in). The visible label is the
 * accessible name; the glyph is aria-hidden. Used in the home hero and the footer.
 */
export function SocialLinks({ className = '' }: { className?: string }) {
   const items = [
      siteConfig.linkedin && { label: 'LinkedIn', href: siteConfig.linkedin, external: true, Icon: LinkedInIcon },
      siteConfig.github && { label: 'GitHub', href: siteConfig.github, external: true, Icon: GitHubIcon },
      siteConfig.whatsapp && { label: 'WhatsApp', href: siteConfig.whatsapp, external: true, Icon: WhatsAppIcon },
      siteConfig.email && { label: 'Email', href: `mailto:${siteConfig.email}`, external: false, Icon: MailIcon },
   ].filter(Boolean) as SocialItem[];

   return (
      <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
         {items.map(({ label, href, external, Icon }) => (
            <li key={label}>
               <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
               >
                  <Icon />
                  {label}
               </a>
            </li>
         ))}
      </ul>
   );
}
