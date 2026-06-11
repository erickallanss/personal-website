# Personal website

My website — portfolio and blog, bilingual (English / Portuguese).
Built with Next.js, Tailwind CSS, and MDX.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
pnpm lint
```

## Content

- Projects: `src/content/portfolio/<slug>/{en,pt-br}.mdx` (images in `public/work/<slug>/`)
- Blog posts: `src/content/blog/<slug>/{en,pt-br}.mdx`
- UI copy: `src/i18n/{en,pt-br}.json`
