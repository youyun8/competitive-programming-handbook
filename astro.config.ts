import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'algorithm-competition-handbook';
const site = process.env.PUBLIC_SITE_URL ?? `https://example.github.io/${repository}/`;
const base = process.env.PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? `/${repository}` : '/');

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: {
    enabled: false
  },
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    }),
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true
    }
  },
  vite: {
    define: {
      __APP_BASE__: JSON.stringify(base)
    }
  }
});
