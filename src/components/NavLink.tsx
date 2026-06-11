'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, label, exact }: { href: string; label: string; exact?: boolean }) {
   const pathname = usePathname();
   const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

   return (
      <Link
         href={href}
         aria-current={active ? 'page' : undefined}
         className={`transition-colors ${active ? 'text-accent' : 'text-foreground/60 hover:text-foreground'}`}
      >
         {label}
      </Link>
   );
}
