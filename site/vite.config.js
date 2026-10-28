import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// `npm run build` builds the pages, then a server copy of the app
// (src/entry-server.jsx) that scripts/prerender.mjs uses to write each page's
// full HTML, so words, headings, facts and frames show before any script runs.
// The scripts then take over the page that is already there (hydrate).
export default defineConfig({
  plugins: [react()],
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
