'use client';

import { Command } from 'cmdk';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

import { siteConfig } from '@/config/site';
import { localeNamesFull, locales, type Locale } from '@/i18n/config';
import { enterLinux, enterRandom, exitToTheme } from '@/lib/appearance';

export interface CommandLabels {
   placeholder: string;
   empty: string;
   hint: string;
   groupNav: string;
   groupTheme: string;
   groupLinks: string;
   groupLang: string;
   copyEmail: string;
   copiedEmail: string;
   downloadCv: string;
   nav: { home: string; portfolio: string; about: string; blog: string; contact: string };
   theme: { toggle: string; random: string; linux: string };
}

const itemClass =
   'flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-foreground/80 data-[selected=true]:bg-foreground/10 data-[selected=true]:text-foreground';

// ⌘K / Ctrl+K command palette. Opens on the shortcut or an 'open-command-menu' window event
// (dispatched by the header trigger). Built on cmdk (Radix Dialog under the hood — focus trap,
// Escape, scroll-lock, and focus restoration are handled for us). Reuses the appearance store,
// next-themes, the router, and siteConfig so it mirrors the header controls exactly.
export function CommandMenu({ locale, labels }: { locale: Locale; labels: CommandLabels }) {
   const [open, setOpen] = useState(false);
   const [copied, setCopied] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const { resolvedTheme, setTheme } = useTheme();

   useEffect(() => {
      const onKey = (event: KeyboardEvent) => {
         if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            setOpen((value) => !value);
         }
      };
      const onOpenEvent = () => setOpen(true);
      document.addEventListener('keydown', onKey);
      window.addEventListener('open-command-menu', onOpenEvent);
      return () => {
         document.removeEventListener('keydown', onKey);
         window.removeEventListener('open-command-menu', onOpenEvent);
      };
   }, []);

   const run = useCallback((fn: () => void) => {
      setOpen(false);
      fn();
   }, []);

   const go = (path: string) => run(() => router.push(`/${locale}${path}`));

   const toggleTheme = () =>
      run(() => {
         exitToTheme();
         setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
      });

   const switchLocale = (next: Locale) =>
      run(() => {
         const rest = pathname.replace(new RegExp(`^/${locale}`), '');
         router.push(`/${next}${rest}` || `/${next}`);
      });

   const copyEmail = () => {
      void navigator.clipboard?.writeText(siteConfig.email).then(() => {
         setCopied(true);
         setTimeout(() => setCopied(false), 1500);
      });
   };

   return (
      <Command.Dialog
         open={open}
         onOpenChange={setOpen}
         label={labels.hint}
         className="overflow-hidden rounded-xl border border-foreground/15 bg-background shadow-2xl"
      >
         <Command.Input
            placeholder={labels.placeholder}
            className="w-full border-b border-foreground/10 bg-transparent px-4 py-3.5 text-sm text-foreground outline-none placeholder:text-foreground/50"
         />
         <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-foreground/50">{labels.empty}</Command.Empty>

            <Command.Group heading={labels.groupNav}>
               <Command.Item className={itemClass} onSelect={() => go('')}>
                  {labels.nav.home}
               </Command.Item>
               <Command.Item className={itemClass} onSelect={() => go('/portfolio')}>
                  {labels.nav.portfolio}
               </Command.Item>
               <Command.Item className={itemClass} onSelect={() => go('/about')}>
                  {labels.nav.about}
               </Command.Item>
               <Command.Item className={itemClass} onSelect={() => go('/blog')}>
                  {labels.nav.blog}
               </Command.Item>
               <Command.Item className={itemClass} onSelect={() => go('/contact')}>
                  {labels.nav.contact}
               </Command.Item>
            </Command.Group>

            <Command.Group heading={labels.groupTheme}>
               <Command.Item className={itemClass} value="theme light dark toggle" onSelect={toggleTheme}>
                  {labels.theme.toggle}
               </Command.Item>
               <Command.Item
                  className={itemClass}
                  value="random accent color surprise"
                  onSelect={() => run(() => enterRandom(resolvedTheme === 'dark'))}
               >
                  {labels.theme.random}
               </Command.Item>
               <Command.Item className={itemClass} value="linux terminal mode fun" onSelect={() => run(() => enterLinux())}>
                  {labels.theme.linux}
               </Command.Item>
            </Command.Group>

            <Command.Group heading={labels.groupLinks}>
               <Command.Item className={itemClass} value="copy email contact" onSelect={copyEmail}>
                  <span>{copied ? labels.copiedEmail : labels.copyEmail}</span>
                  {copied && (
                     <span aria-hidden className="text-accent">
                        ✓
                     </span>
                  )}
               </Command.Item>
               <Command.Item
                  className={itemClass}
                  value="cv curriculum resume download"
                  onSelect={() => run(() => window.open(siteConfig.cv, '_blank', 'noopener'))}
               >
                  {labels.downloadCv}
               </Command.Item>
               {siteConfig.linkedin && (
                  <Command.Item
                     className={itemClass}
                     value="linkedin"
                     onSelect={() => run(() => window.open(siteConfig.linkedin, '_blank', 'noopener'))}
                  >
                     LinkedIn
                  </Command.Item>
               )}
               {siteConfig.github && (
                  <Command.Item
                     className={itemClass}
                     value="github"
                     onSelect={() => run(() => window.open(siteConfig.github, '_blank', 'noopener'))}
                  >
                     GitHub
                  </Command.Item>
               )}
               {siteConfig.whatsapp && (
                  <Command.Item
                     className={itemClass}
                     value="whatsapp"
                     onSelect={() => run(() => window.open(siteConfig.whatsapp, '_blank', 'noopener'))}
                  >
                     WhatsApp
                  </Command.Item>
               )}
            </Command.Group>

            <Command.Group heading={labels.groupLang}>
               {locales
                  .filter((l) => l !== locale)
                  .map((l) => (
                     <Command.Item
                        key={l}
                        className={itemClass}
                        value={`language ${localeNamesFull[l]}`}
                        onSelect={() => switchLocale(l)}
                     >
                        {localeNamesFull[l]}
                     </Command.Item>
                  ))}
            </Command.Group>
         </Command.List>
      </Command.Dialog>
   );
}
