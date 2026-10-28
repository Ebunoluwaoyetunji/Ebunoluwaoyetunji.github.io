import React, { startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import whenLoaded from './whenLoaded.js';

// Starts a page. The built pages already hold their full HTML
// (scripts/prerender.mjs), so the scripts take over what is there (hydrate)
// instead of drawing it again. The dev server's pages are empty, so there the
// page is drawn from scratch.
// ready: things the first render needs (a page's signposts), loaded first.
// Runs fn once the page has finished loading and the browser is idle (for
// downloads the page may want later, so they never compete with the first load).
export function later(fn) {
  whenLoaded(() => (window.requestIdleCallback ? requestIdleCallback(() => fn(), { timeout: 3000 }) : setTimeout(fn, 200)));
}

export async function start(element, ready = []) {
  await Promise.all(ready);
  const root = document.getElementById('root');
  const app = <React.StrictMode>{element}</React.StrictMode>;
  // Taking over is split into small pieces (a transition), so the page stays
  // responsive on a slow phone instead of being busy for one long stretch.
  if (root.hasChildNodes()) startTransition(() => { hydrateRoot(root, app); });
  else createRoot(root).render(app);
}
