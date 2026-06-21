import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

/**
 * A single headline metric for case studies: big mono number + small accent label.
 * Use in MDX: <Metric value="<120ms" label="p95 API" />
 */
function Metric({ value, label }: { value: string; label: string }) {
   return (
      <div className="flex flex-col gap-1">
         <span className="font-mono text-3xl font-semibold tracking-tight text-foreground">{value}</span>
         <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{label}</span>
      </div>
   );
}

/** Responsive grid wrapper for <Metric> items (escapes the prose flow). */
function MetricGrid({ children }: { children: ReactNode }) {
   return <div className="not-prose my-8 grid grid-cols-2 gap-6 sm:grid-cols-3">{children}</div>;
}

// Required by @next/mdx with the App Router. Element styling is handled by the Tailwind `prose`
// wrapper; here we register custom components MDX bodies can use (e.g. case-study metrics).
const components: MDXComponents = {
   Metric,
   MetricGrid,
};

export function useMDXComponents(): MDXComponents {
   return components;
}
