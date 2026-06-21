'use client';

// Subtle "⌘K" pill in the header that opens the command palette (via a window event the
// CommandMenu listens for). Desktop-only — the shortcut works everywhere regardless.
export function CommandMenuTrigger({ label }: { label: string }) {
   return (
      <button
         type="button"
         aria-label={label}
         onClick={() => window.dispatchEvent(new CustomEvent('open-command-menu'))}
         className="hidden items-center gap-1 rounded-md border border-foreground/15 px-2 py-1 font-mono text-[11px] text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground sm:inline-flex"
      >
         <span aria-hidden>⌘</span>K
      </button>
   );
}
