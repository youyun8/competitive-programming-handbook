import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const [repositoryOwner, repositoryName] = process.env.GITHUB_REPOSITORY?.split('/') ?? [
  process.env.GITHUB_REPOSITORY_OWNER ?? 'youyun8',
  'algorithm-handbook'
];
const site =
  process.env.PUBLIC_SITE_URL ?? `https://${repositoryOwner}.github.io/${repositoryName}/`;
const base =
  process.env.PUBLIC_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? `/${repositoryName}` : '/');

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
