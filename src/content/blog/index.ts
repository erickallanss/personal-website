import type { ComponentType } from 'react';

import type { Locale } from '@/i18n/config';

export interface PostMeta {
   title: string;
   excerpt: string;
   date: string; // ISO (YYYY-MM-DD)
}

interface MdxModule {
   default: ComponentType;
   metadata: PostMeta;
}

type PostLoader = () => Promise<MdxModule>;

/**
 * No posts published yet. To publish one: create `src/content/blog/<slug>/{en,pt-br}.mdx`
 * (each exporting `metadata` + the body) and add a row here, e.g.:
 *   'my-post': {
 *      en: () => import('./my-post/en.mdx') as unknown as Promise<MdxModule>,
 *      'pt-br': () => import('./my-post/pt-br.mdx') as unknown as Promise<MdxModule>,
 *   },
 */
const posts: Record<string, Record<Locale, PostLoader>> = {};

export const postSlugs = Object.keys(posts);

export const getPostLoader = (slug: string, locale: Locale): PostLoader | undefined => posts[slug]?.[locale];

export interface PostListItem extends PostMeta {
   slug: string;
}

export async function getPostList(locale: Locale): Promise<PostListItem[]> {
   return Promise.all(
      postSlugs.map(async (slug) => {
         const mod = await posts[slug][locale]();
         return { slug, ...mod.metadata };
      }),
   );
}
