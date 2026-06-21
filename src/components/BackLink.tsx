import Link from 'next/link';

// Refined back link: a subtle pill with an arrow that nudges left on hover.
export function BackLink({ href, label }: { href: string; label: string }) {
   return (
      <Link
         href={href}
         className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/15 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-foreground/70 transition-all hover:border-foreground/30 hover:text-foreground"
      >
         <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ←
         </span>
         {label}
      </Link>
   );
}
