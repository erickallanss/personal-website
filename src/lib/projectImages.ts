import 'server-only';

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { imageSize } from 'image-size';

const IMAGE_RE = /\.(png|jpe?g|webp|avif|gif)$/i;

export interface ProjectImage {
   src: string;
   width: number;
   height: number;
}

/**
 * Returns the (sorted) public paths + intrinsic dimensions of every image dropped into
 * `public/work/<slug>/`. Read at build time (server-only); dimensions let callers hand
 * next/image real width/height so it reserves layout space (no CLS) and emits a srcset.
 * No code change is needed to add/remove images — just drop files in.
 */
export function getProjectImages(slug: string): ProjectImage[] {
   const dir = join(process.cwd(), 'public', 'work', slug);
   if (!existsSync(dir)) return [];
   return readdirSync(dir)
      .filter((file) => IMAGE_RE.test(file))
      .sort()
      .map((file) => {
         const { width, height } = imageSize(readFileSync(join(dir, file)));
         return { src: `/work/${slug}/${file}`, width: width ?? 1600, height: height ?? 900 };
      });
}
