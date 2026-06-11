// Shared button styles for a consistent feel across the site. Apply to <Link>, <a>, or <button>.

const base =
   'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40';

/** Filled, accent-colored — primary call to action. */
export const buttonPrimary = `${base} bg-accent text-background hover:opacity-90`;

/** Outlined — secondary action. */
export const buttonSecondary = `${base} border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5`;
