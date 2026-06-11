import { siteConfig } from '@/config/site';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

import { LanguageSwitcher } from './LanguageSwitcher';
import { LinuxModeButton } from './LinuxModeButton';
import { MobileNav } from './MobileNav';
import { NavLink } from './NavLink';
import { RandomThemeButton } from './RandomThemeButton';
import { ThemeToggle } from './ThemeToggle';

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
   const base = `/${locale}`;
   const links = [
      { href: base, label: dict.nav.home, exact: true },
      { href: `${base}/about`, label: dict.nav.about },
      { href: `${base}/portfolio`, label: dict.nav.portfolio },
      { href: `${base}/blog`, label: dict.nav.blog },
   ];
   const mobileItems = [...links, { href: siteConfig.cv, label: dict.nav.curriculum, external: true }];

   return (
      <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/70 backdrop-blur">
         <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-6">
            <MobileNav items={mobileItems} menuLabel={dict.nav.menu} closeLabel={dict.nav.close} />
            <nav className="hidden gap-5 text-sm sm:flex">
               {links.map((link) => (
                  <NavLink key={link.href} href={link.href} label={link.label} exact={link.exact} />
               ))}
               <a
                  href={siteConfig.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/60 transition-colors hover:text-foreground"
               >
                  {dict.nav.curriculum}
               </a>
            </nav>
            <div className="flex items-center gap-1">
               <RandomThemeButton label={dict.theme.random} />
               <LinuxModeButton label={dict.theme.linux} />
               <ThemeToggle label={dict.theme.toggle} />
               <LanguageSwitcher locale={locale} />
            </div>
         </div>
      </header>
   );
}
