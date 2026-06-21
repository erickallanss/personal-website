// Single source of truth for the header appearance controls — exactly one mode is active at a time:
//   'theme'  → plain light/dark
//   'random' → main color replaced with a random one (--foreground override)
//   'linux'  → fixed Linux/terminal skin (.linux class)
// Read via useSyncExternalStore (hydration-safe, no effects). DOM/storage mutations happen here.

type Mode = 'theme' | 'random' | 'linux';

// Storage key for the random color. Bumped from 'fg' → 'fg2' when the generator switched to
// contrast-targeted colors, so any legacy low-contrast value is ignored (returning visitors reset).
const FG_KEY = 'fg2';

const listeners = new Set<() => void>();
function emit(): void {
   for (const listener of listeners) listener();
}

function clearForegroundDom(): void {
   document.documentElement.style.removeProperty('--foreground');
   try {
      localStorage.removeItem(FG_KEY);
   } catch {
      // ignore
   }
}

function clearLinuxDom(): void {
   document.documentElement.classList.remove('linux');
   try {
      localStorage.removeItem('linux');
   } catch {
      // ignore
   }
}

function readInitialMode(): Mode {
   if (typeof document === 'undefined') return 'theme';
   try {
      if (localStorage.getItem('linux') === '1' || document.documentElement.classList.contains('linux')) return 'linux';
      if (localStorage.getItem(FG_KEY)) return 'random';
   } catch {
      if (document.documentElement.classList.contains('linux')) return 'linux';
   }
   return 'theme';
}

let mode: Mode = readInitialMode();
// A fresh seed each page load → a different curiosity each time Linux mode is shown.
let factSeed = typeof window === 'undefined' ? 0 : Math.random();

export function subscribe(callback: () => void): () => void {
   listeners.add(callback);
   return () => {
      listeners.delete(callback);
   };
}

export function getMode(): Mode {
   return mode;
}
export function getServerMode(): Mode {
   return 'theme';
}
export function getEnabled(): boolean {
   return mode === 'linux';
}
export function getServerEnabled(): boolean {
   return false;
}
export function getFactSeed(): number {
   return factSeed;
}
export function getServerSeed(): number {
   return 0;
}

/**
 * Picks a random hue whose lightness is tuned (per hue) so the color clears a strong
 * contrast target against the current background. The headroom keeps opacity-reduced tokens
 * (text-foreground/40..../70, which layer on --foreground) above the WCAG 4.5:1 threshold.
 * HSL lightness is NOT perceptually uniform (a yellow at L=50% is far brighter than a blue),
 * so we binary-search the lightness per hue instead of using a fixed value — finding the most
 * vivid lightness that still meets the target rather than washing every color out to white/near-black.
 */
function randomReadableColor(isDark: boolean): string {
   const hue = Math.floor(Math.random() * 360);
   const sat = isDark ? 80 : 70;
   const bg: [number, number, number] = isDark ? [10, 10, 10] : [255, 255, 255];
   // Tune against the WORST readable tier: muted text rendered at 60% opacity (text-foreground/60,
   // the lowest opacity used for readable copy). Full-strength text then clears ~11–16:1. A
   // full-color target alone is NOT enough — blending toward the bg at /60 eats most of the contrast.
   const target = 4.8;

   const channel = (c: number): number => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
   };
   const luminance = (rgb: [number, number, number]): number =>
      0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
   const contrast = (rgb: [number, number, number]): number => {
      const a = luminance(rgb);
      const b = luminance(bg);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
   };
   const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
      const sn = s / 100;
      const ln = l / 100;
      const k = (n: number): number => (n + h / 30) % 12;
      const a = sn * Math.min(ln, 1 - ln);
      const f = (n: number): number => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
      return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
   };
   // The /60 muted color as actually composited over the background.
   const mutedOverBg = (rgb: [number, number, number]): [number, number, number] =>
      [0, 1, 2].map((i) => Math.round(rgb[i] * 0.6 + bg[i] * 0.4)) as [number, number, number];

   // The /60 contrast is monotonic in lightness for a fixed bg: on dark it rises as the color
   // lightens; on light it rises as the color darkens. Binary-search the threshold lightness —
   // the most vivid color whose muted tier is still legible (lightest on dark / darkest on light).
   let lo = 0;
   let hi = 100;
   let lightness = isDark ? 66 : 42;
   for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      const meets = contrast(mutedOverBg(hslToRgb(hue, sat, mid))) >= target;
      if (isDark) {
         if (meets) hi = mid;
         else lo = mid;
      } else {
         if (meets) lo = mid;
         else hi = mid;
      }
      lightness = isDark ? hi : lo;
   }
   return `hsl(${hue} ${sat}% ${lightness.toFixed(1)}%)`;
}

/** Replace the main color with a random one readable on the current background; leave Linux mode. */
export function enterRandom(isDark: boolean): void {
   if (typeof document === 'undefined') return;
   clearLinuxDom();
   const color = randomReadableColor(isDark);
   document.documentElement.style.setProperty('--foreground', color);
   try {
      localStorage.setItem(FG_KEY, color);
   } catch {
      // ignore
   }
   mode = 'random';
   emit();
}

/** Turn on the fixed Linux/terminal skin; clears the random color. */
export function enterLinux(): void {
   if (typeof document === 'undefined') return;
   clearForegroundDom();
   document.documentElement.classList.add('linux');
   try {
      localStorage.setItem('linux', '1');
   } catch {
      // ignore
   }
   factSeed = Math.random();
   mode = 'linux';
   emit();
}

/** Back to the plain light/dark theme — clears both the random color and Linux skin. */
export function exitToTheme(): void {
   if (typeof document === 'undefined') return;
   clearForegroundDom();
   clearLinuxDom();
   mode = 'theme';
   emit();
}
