// Single source of truth for the header appearance controls — exactly one mode is active at a time:
//   'theme'  → plain light/dark
//   'random' → main color replaced with a random one (--foreground override)
//   'linux'  → fixed Linux/terminal skin (.linux class)
// Read via useSyncExternalStore (hydration-safe, no effects). DOM/storage mutations happen here.

type Mode = 'theme' | 'random' | 'linux';

const listeners = new Set<() => void>();
function emit(): void {
   for (const listener of listeners) listener();
}

function clearForegroundDom(): void {
   document.documentElement.style.removeProperty('--foreground');
   try {
      localStorage.removeItem('fg');
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
      if (localStorage.getItem('fg')) return 'random';
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

/** Replace the main color with a random one readable on the current background; leave Linux mode. */
export function enterRandom(isDark: boolean): void {
   if (typeof document === 'undefined') return;
   clearLinuxDom();
   const hue = Math.floor(Math.random() * 360);
   const color = isDark ? `hsl(${hue} 80% 66%)` : `hsl(${hue} 70% 42%)`;
   document.documentElement.style.setProperty('--foreground', color);
   try {
      localStorage.setItem('fg', color);
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
