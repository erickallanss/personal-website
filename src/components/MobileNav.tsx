'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export interface MobileNavItem {
   href: string;
   label: string;
   exact?: boolean;
   external?: boolean;
}

function MenuIcon() {
   return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
         <path d="M3 6h18M3 12h18M3 18h18" />
      </svg>
   );
}

function CloseIcon() {
   return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
         <path d="M6 6l12 12M18 6L6 18" />
      </svg>
   );
}

// Phone-only nav: a hamburger that opens a dropdown of the links (inline nav is used on ≥sm).
export function MobileNav({ items, menuLabel, closeLabel }: { items: MobileNavItem[]; menuLabel: string; closeLabel: string }) {
   const [open, setOpen] = useState(false);
   const pathname = usePathname();
   const triggerRef = useRef<HTMLButtonElement>(null);
   const navRef = useRef<HTMLElement>(null);
   const close = () => setOpen(false);

   // While open: Escape closes and returns focus to the trigger; move focus into the menu on open.
   useEffect(() => {
      if (!open) return;
      const onKey = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            setOpen(false);
            triggerRef.current?.focus();
         }
      };
      document.addEventListener('keydown', onKey);
      navRef.current?.querySelector<HTMLElement>('a')?.focus();
      return () => document.removeEventListener('keydown', onKey);
   }, [open]);

   return (
      <div className="sm:hidden">
         <button
            ref={triggerRef}
            type="button"
            aria-label={open ? closeLabel : menuLabel}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
            className="grid size-8 place-items-center rounded-md text-foreground/70 transition-colors hover:text-foreground"
         >
            {open ? <CloseIcon /> : <MenuIcon />}
         </button>

         {open && (
            <>
               {/* Click-away backdrop. Non-focusable + AT-hidden; Escape provides the keyboard close. */}
               <div aria-hidden onClick={close} className="fixed inset-0 z-40" />
               <nav
                  id="mobile-menu"
                  ref={navRef}
                  aria-label={menuLabel}
                  className="absolute inset-x-0 top-16 z-50 border-b border-foreground/10 bg-background shadow-lg"
               >
                  <ul className="mx-auto flex w-full max-w-5xl flex-col px-6 py-2 text-sm">
                     {items.map((item) => {
                        if (item.external) {
                           return (
                              <li key={item.href}>
                                 <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={close}
                                    className="block py-2.5 text-foreground/70 transition-colors hover:text-foreground"
                                 >
                                    {item.label}
                                 </a>
                              </li>
                           );
                        }
                        const active = item.exact
                           ? pathname === item.href
                           : pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                           <li key={item.href}>
                              <Link
                                 href={item.href}
                                 onClick={close}
                                 className={`block py-2.5 transition-colors ${
                                    active ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'
                                 }`}
                              >
                                 {item.label}
                              </Link>
                           </li>
                        );
                     })}
                  </ul>
               </nav>
            </>
         )}
      </div>
   );
}
