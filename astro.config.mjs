// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import path from 'path';
import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    })
  ],
  markdown: {
    remarkPlugins: [remarkGfm, remarkReadingTime],
    rehypePlugins: [
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    shikiConfig: {
      theme: 'github-dark-default',
    },
  },
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }
});
