import type { ComponentType } from 'react';

import type { Locale } from '@/i18n/config';

export interface ProjectMeta {
   name: string;
   excerpt: string;
   repoUrl?: string;
   liveUrl?: string;
   tags?: string[];
   /** When true, the card shows a "Private project" tag and no repo link. */
   private?: boolean;
   /** Optional "fact strip" fields shown on the project detail header. */
   role?: string;
   projectType?: string;
   status?: string;
   timeline?: string;
}

interface MdxModule {
   default: ComponentType;
   metadata: ProjectMeta;
}

type ProjectLoader = () => Promise<MdxModule>;

/**
 * Explicit static import map (one entry per project × locale). To add a project: create the two
 * `.mdx` files under `src/content/portfolio/<slug>/` and add a row here; drop images (optional) in
 * `public/work/<slug>/`. Order here = display order. Each `.mdx` exports `metadata` + a write-up body.
 */
const projects: Record<string, Record<Locale, ProjectLoader>> = {
   cliniqhub: {
      en: () => import('./cliniqhub/en.mdx') as unknown as Promise<MdxModule>,
      'pt-br': () => import('./cliniqhub/pt-br.mdx') as unknown as Promise<MdxModule>,
   },
   'laboratorio-potengi': {
      en: () => import('./laboratorio-potengi/en.mdx') as unknown as Promise<MdxModule>,
      'pt-br': () => import('./laboratorio-potengi/pt-br.mdx') as unknown as Promise<MdxModule>,
   },
};

export const projectSlugs = Object.keys(projects);

export const getProjectLoader = (slug: string, locale: Locale): ProjectLoader | undefined =>
   projects[slug]?.[locale];

export interface ProjectListItem extends ProjectMeta {
   slug: string;
}

export async function getProjectList(locale: Locale): Promise<ProjectListItem[]> {
   return Promise.all(
      projectSlugs.map(async (slug) => {
         const mod = await projects[slug][locale]();
         return { slug, ...mod.metadata };
      }),
   );
}
