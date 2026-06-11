import { siteConfig } from '@/config/site';
import type { Dictionary } from '@/i18n/dictionaries';

export function Footer({ dict }: { dict: Dictionary }) {
   const year = new Date().getFullYear();
   return (
      <footer className="border-t border-foreground/10">
         <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-foreground/60">
            <span>
               © {year} {siteConfig.name}. {dict.footer.rights}
            </span>
            <div className="flex items-center gap-4">
               {siteConfig.linkedin && (
                  <a
                     href={siteConfig.linkedin}
                     target="_blank"
                     rel="noreferrer"
                     className="transition-colors hover:text-foreground"
                  >
                     LinkedIn
                  </a>
               )}
               {siteConfig.email && (
                  <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-foreground">
                     Email
                  </a>
               )}
            </div>
         </div>
      </footer>
   );
}
