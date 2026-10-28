// Makes smaller copies of every screen image, so each frame loads the size it
// shows at (ScreenSlot.jsx builds srcset from them):
//   <name>.webp  ->  <name>-800.webp and <name>-1400.webp (WebP quality 85),
//   each only when the original is wider than that (not for tall screens that
//   have a <name>-top.webp: those open full size only). The original is never
//   changed: it stays the largest choice, and the lens and "View full screen"
//   use it.
// Run after adding or replacing a screen in public/images/:
//   node scripts/make-image-sizes.mjs          (makes what is missing or older than its original)
//   node scripts/make-image-sizes.mjs --list   (only lists the images and their widths)

import { readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const STEPS = [800, 1400]; // keep in step with SIZE_STEPS in src/components/ScreenSlot.jsx
const QUALITY = 85;
const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(site, 'public/images');
const list = process.argv.includes('--list');

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const isCopy = (f) => /-(800|1400)\.webp$/.test(f);
// A tall screen whose frame shows its <name>-top.webp is only ever opened full
// size ("View full screen"), so it needs no smaller copies.
const onlyFull = (f) => existsSync(f.replace(/\.webp$/, '-top.webp'));
const originals = walk(root).filter((f) => f.endsWith('.webp') && !isCopy(f) && !onlyFull(f));

let made = 0;
let saved = 0;
for (const file of originals) {
  const { width, height } = await sharp(file).metadata();
  const rel = file.slice(root.length + 1).split('\\').join('/');
  if (list) { console.log(`${width} x ${height}  ${Math.round(statSync(file).size / 1024)} KB  ${rel}`); continue; }
  for (const w of STEPS.filter((s) => s < width)) {
    const out = file.replace(/\.webp$/, `-${w}.webp`);
    if (existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs) continue;
    await sharp(file).resize({ width: w }).webp({ quality: QUALITY, effort: 6 }).toFile(out);
    made++;
    saved += statSync(file).size - statSync(out).size;
  }
}
if (!list) console.log(`${originals.length} screen images; ${made} smaller copies made (${Math.round(saved / 1024)} KB smaller than their originals in total).`);
