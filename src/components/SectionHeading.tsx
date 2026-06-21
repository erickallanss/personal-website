import type { ReactNode } from 'react';

/**
 * Direction B numbered section header.
 * Renders e.g.  "01 — RECENT WORK"  with the index in the accent color, mono/uppercase/wide
 * tracking, and a hairline bottom rule. Pass `action` to put a link/control on the right.
 *
 *   <SectionHeading index={1} title={dict.about.experienceTitle} />
 *   <SectionHeading index={1} title={dict.home.recentWork} action={<Link …>View all</Link>} />
 */
export function SectionHeading({
   index,
   title,
   action,
   as: As = 'h2',
   className = '',
}: {
   index: number;
   title: string;
   action?: ReactNode;
   as?: 'h2' | 'h3';
   className?: string;
}) {
   return (
      <div className={`flex items-baseline justify-between gap-4 border-b border-foreground/10 pb-3 ${className}`}>
         <As className="font-mono text-sm uppercase tracking-[0.2em] text-foreground/70">
            <span className="text-accent">{String(index).padStart(2, '0')}</span>
            <span aria-hidden className="mx-2 text-foreground/30">—</span>
            {title}
         </As>
         {action ? <div className="shrink-0">{action}</div> : null}
      </div>
   );
}
