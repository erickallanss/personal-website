import 'server-only';

import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const IMAGE_RE = /\.(png|jpe?g|webp|avif|gif)$/i;

/**
 * Returns the (sorted) public paths of every image dropped into `public/work/<slug>/`.
 * Read at build time; no code change is needed to add/remove images — just drop files in.
 */
export function getProjectImages(slug: string): string[] {
   const dir = join(process.cwd(), 'public', 'work', slug);
   if (!existsSync(dir)) return [];
   return readdirSync(dir)
      .filter((file) => IMAGE_RE.test(file))
      .sort()
      .map((file) => `/work/${slug}/${file}`);
}
