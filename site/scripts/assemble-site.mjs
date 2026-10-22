// Puts together what GitHub Pages publishes (site/_site), after `npm run build`:
//   1. the new site (site/dist): /, the case studies, 404.html, and the
//      redirects for /boulote.html, /folowr.html and /fileo_case_study.html
//      (site/public);
//   2. the old pages kept as they are, from the repo root: /nexapay.html,
//      /whimsy.html, the old Fileo prototypes (/fileo/fileo_*.html) and
//      /assets/thumbs/. The old root index.html, fileo/index.html,
//      boulote.html, folowr.html and fileo_case_study.html are NOT copied: the
//      new site (or a redirect) takes those addresses.
// It stops if a file would overwrite another. Run by .github/workflows/deploy.yml;
// locally: npm run pages.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = resolve(site, '..');
const dist = join(site, 'dist');
const out = join(site, '_site');

if (!existsSync(join(dist, 'index.html'))) throw new Error('No site/dist: run npm run build first.');
rmSync(out, { recursive: true, force: true });
cpSync(dist, out, { recursive: true });

const fileoPrototypes = readdirSync(join(repo, 'fileo')).filter((f) => /^fileo_.+\.html$/.test(f)).map((f) => `fileo/${f}`);
const thumbs = readdirSync(join(repo, 'assets/thumbs')).map((f) => `assets/thumbs/${f}`);
const old = ['nexapay.html', 'whimsy.html', ...fileoPrototypes, ...thumbs];

for (const path of old) {
  const to = join(out, path);
  if (existsSync(to)) throw new Error(`${path} is already in the new site; not overwriting it.`);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(join(repo, path), to);
}
console.log(`site/_site: the new site plus ${old.length} old files (${old.filter((p) => p.endsWith('.html')).join(', ')}, assets/thumbs).`);
