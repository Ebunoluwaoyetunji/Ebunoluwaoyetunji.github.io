import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import NotFound from './NotFound.jsx';
import CaseStudy from './case/CaseStudy.jsx';
import home from './content/home.js';
import fileo from './content/case-studies/fileo.js';
import boulote from './content/case-studies/boulote.js';
import folowr from './content/case-studies/folowr.js';
import sportingNews from './content/case-studies/sporting-news.js';
import { casePages } from './content/case-studies/index.js';
import { revealScript } from './lib/frameTransition.js';
import { fitScript } from './lib/fitScript.js';
import { rootVarsCss } from './lib/rootVars.js';
import { goatcounterTags } from './lib/goatcounter.js';

// The server copy of the pages, used only by scripts/prerender.mjs at build
// time to write each page's HTML. Each entry: the built HTML file, what it
// shows, and anything extra its <head> needs before the page shows.
const PAGES = {
  'index.html': { element: <App />, head: () => `<script>${revealScript(casePages, home.projects)}</script>` },
  'fileo/index.html': { element: <CaseStudy study={fileo} /> },
  'boulote/index.html': { element: <CaseStudy study={boulote} /> },
  'folowr/index.html': { element: <CaseStudy study={folowr} /> },
  'sporting-news/index.html': { element: <CaseStudy study={sportingNews} /> },
  '404.html': { element: <NotFound /> },
};

export const files = Object.keys(PAGES);

// head: added at the end of <head> (look variables, the homepage's page-change
// script, GoatCounter: src/lib/goatcounter.js). body: the page's HTML for <div id="root">.
// after: right after it (sizes the big headings before the first paint).
export function render(file) {
  const page = PAGES[file];
  return {
    head: `<style>${rootVarsCss()}</style>${page.head?.() ?? ''}${goatcounterTags()}`,
    body: renderToString(<React.StrictMode>{page.element}</React.StrictMode>),
    after: `<script>${fitScript()}</script>`,
  };
}
