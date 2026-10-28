// Writes each built page's full HTML (run by `npm run build`, after the two
// Vite builds). Uses the server copy of the app (dist-ssr/entry-server.js,
// from src/entry-server.jsx) to fill <div id="root"> in dist/<page>.html, so
// the words, headings, facts and frames show before any script runs. The
// page's scripts then take over that HTML (src/lib/start.jsx).
//
// It stops if a page is missing, has no empty root, or renders nothing.
// Then it removes dist-ssr.

import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(site, 'dist');
const ssrDir = join(site, 'dist-ssr');
const { files, render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

// React notes every useLayoutEffect it skips on the server. That is intended
// here (those effects measure the page and run in the browser), so leave that
// one message out; everything else still shows.
const error = console.error;
console.error = (msg, ...rest) => { if (!String(msg).includes('useLayoutEffect does nothing on the server')) error(msg, ...rest); };

const ROOT = '<div id="root"></div>';

// The page is already complete in its HTML, so its scripts are not needed for
// the first paint. Vite puts them in <head>, where they download at the same
// time as the CSS and the fonts and slow both on a weak connection. Move them
// to a tiny loader at the end of <body> that starts them right after the first
// frame is drawn (or after 1 s, if the tab is in the background).
function scriptsAfterFirstPaint(html, file) {
  const entry = /<script type="module" crossorigin src="([^"]+)"><\/script>\s*/.exec(html);
  if (!entry) throw new Error(`${file}: no page script found`);
  const preloads = [...html.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">\s*/g)];
  for (const m of [entry, ...preloads]) html = html.replace(m[0], '');
  const loader = `<script>(function(){var go=function(){if(go.done)return;go.done=1;${JSON.stringify(preloads.map((m) => m[1]))}.forEach(function(h){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=h;document.head.appendChild(l);});var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src=${JSON.stringify(entry[1])};document.head.appendChild(s);};requestAnimationFrame(function(){setTimeout(go,0);});setTimeout(go,1000);})();</script>`;
  return html.replace('</body>', `    ${loader}\n  </body>`);
}
for (const file of files) {
  const path = join(dist, file);
  let html = readFileSync(path, 'utf8');
  if (!html.includes(ROOT)) throw new Error(`${file}: no empty <div id="root"></div>`);
  const { head, body, after } = render(file);
  if (body.length < 200) throw new Error(`${file}: rendered almost nothing (${body.length} characters)`);
  html = html.replace('</head>', `${head}\n  </head>`).replace(ROOT, `<div id="root">${body}</div>\n    ${after}`);
  html = scriptsAfterFirstPaint(html, file);
  writeFileSync(path, html);
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`prerendered ${file}: ${Math.round(html.length / 1024)} KB of HTML, ${text.split(' ').length} words`);
}
rmSync(ssrDir, { recursive: true, force: true });
