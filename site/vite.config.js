import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// The page scripts block the first paint (blocking="render"), so the page
// change between the homepage and a case study finds its frame on the first
// frame. Vite drops the attribute when it builds, so put it back.
const renderBlockingEntry = () => ({
  name: 'render-blocking-entry',
  transformIndexHtml: {
    order: 'post',
    handler: (html) => html.replace(/<script type="module" crossorigin src=/g, '<script type="module" blocking="render" crossorigin src='),
  },
});

export default defineConfig({
  plugins: [react(), renderBlockingEntry()],
  base: '/',
  build: {
    rollupOptions: {
      // Pages: the site (/), the case studies (/fileo/, /boulote/, /folowr/, /sporting-news/) and 404.html.
      // Each case study is a real page, so links and refresh work on GitHub Pages.
      input: {
        main: resolve(__dirname, 'index.html'),
        fileo: resolve(__dirname, 'fileo/index.html'),
        boulote: resolve(__dirname, 'boulote/index.html'),
        folowr: resolve(__dirname, 'folowr/index.html'),
        'sporting-news': resolve(__dirname, 'sporting-news/index.html'),
        // The page GitHub Pages shows for an address that does not exist.
        'not-found': resolve(__dirname, '404.html'),
      },
    },
  },
});
