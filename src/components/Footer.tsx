import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/i18n/dictionaries';

import { SocialLinks } from './SocialLinks';

export function Footer({ dict }: { dict: Dictionary }) {
   const year = new Date().getFullYear();
   return (
      <footer className="border-t border-foreground/10">
         <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-foreground/60">
            <span>
               © {year} {siteConfig.name}. {dict.footer.rights}
            </span>
            <SocialLinks />
         </div>
      </footer>
   );
}
