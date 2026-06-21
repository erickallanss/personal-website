import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   // Let .md/.mdx files be treated as pages/imports.
   pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
   images: {
      // Serve modern formats from the production optimizer (requires `sharp`).
      // All project images are local (public/work), so no remotePatterns are needed.
      formats: ['image/avif', 'image/webp'],
   },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
