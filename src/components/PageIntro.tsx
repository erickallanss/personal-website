import type { ReactNode } from 'react';

/**
 * Direction B page intro: the accent left-rule + mono eyebrow + display title used at the top of
 * About / Portfolio / Blog (and, in a compact form, the detail pages). Mirrors the home hero so the
 * whole site reads as one system. Wrapped in `.animate-rise` for a consistent entrance.
 *
 *   <PageIntro eyebrow={dict.portfolio.eyebrow} title={dict.portfolio.title}>
 *      {dict.portfolio.subtitle}
 *   </PageIntro>
 */
export function PageIntro({
   eyebrow,
   title,
   children,
   className = '',
}: {
   eyebrow: string;
   title: string;
   /** Optional lede / subtitle rendered under the title. */
   children?: ReactNode;
   className?: string;
}) {
   return (
      <header className={`animate-rise ${className}`}>
         <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{`// ${eyebrow}`}</p>
         <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
         {children ? (
            <div className="mt-4 max-w-prose text-lg leading-relaxed text-foreground/70">{children}</div>
         ) : null}
      </header>
   );
}
