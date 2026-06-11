import type { MDXComponents } from 'mdx/types';

// Required by @next/mdx with the App Router. Element styling is handled by the Tailwind
// `prose` wrapper around rendered posts, so the global overrides stay empty for now.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
   return components;
}
