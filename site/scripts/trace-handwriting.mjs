// Traces Ebun's handwriting from a clean scan (black ink on white) into pen
// strokes, one SVG per note, so each note can draw itself like a pen.
//
//   node scripts/trace-handwriting.mjs
//   in:  raw-images/footer-notes-photo.webp
//   out: src/content/footer-notes/{work,gallery,about,contact}.svg
//
// How: find the ink, group it into the four notes, thin every stroke down to
// its centre line, then follow each line in writing order. Nothing is
// redrawn or replaced with a font: the paths are the centre of her own ink,
// lightly smoothed only to remove pixel steps. The pen width is measured
// from the ink. Ink that touches stays joined (the tail of the "y" in "what
// you" running into "should" is kept).
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { traceNote, f1 } from './lib/trace-strokes.mjs';

const SRC = 'raw-images/footer-notes-photo.webp';
const OUT = 'src/content/footer-notes';
const INK = 140; // grey level below which a pixel counts as ink
const GROUP = 110; // px: ink pieces closer than this belong to the same note

const { data, info } = await sharp(SRC).greyscale().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const ink = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) ink[i] = data[i] < INK ? 1 : 0;

// Connected pieces of ink (8-connected).
const label = new Int32Array(W * H).fill(-1);
const pieces = [];
for (let i = 0; i < W * H; i++) {
  if (!ink[i] || label[i] >= 0) continue;
  const id = pieces.length, stack = [i], px = [];
  label[i] = id;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  while (stack.length) {
    const p = stack.pop(); px.push(p);
    const x = p % W, y = (p / W) | 0;
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const q = ny * W + nx;
      if (ink[q] && label[q] < 0) { label[q] = id; stack.push(q); }
    }
  }
  pieces.push({ px, x0, y0, x1, y1 });
}
const real = pieces.filter((p) => p.px.length >= 6); // ignore dust

// Group pieces into notes.
const groups = real.map((p) => [p]);
let merged = true;
const box = (g) => ({ x0: Math.min(...g.map((p) => p.x0)), y0: Math.min(...g.map((p) => p.y0)), x1: Math.max(...g.map((p) => p.x1)), y1: Math.max(...g.map((p) => p.y1)) });
while (merged) {
  merged = false;
  outer: for (let a = 0; a < groups.length; a++) for (let b = a + 1; b < groups.length; b++) {
    const A = box(groups[a]), B = box(groups[b]);
    const gx = Math.max(0, Math.max(A.x0, B.x0) - Math.min(A.x1, B.x1));
    const gy = Math.max(0, Math.max(A.y0, B.y0) - Math.min(A.y1, B.y1));
    if (Math.hypot(gx, gy) < GROUP) { groups[a].push(...groups[b]); groups.splice(b, 1); merged = true; break outer; }
  }
}
if (groups.length !== 4) throw new Error(`Expected 4 notes in the scan, found ${groups.length}. Stopping rather than guessing.`);

// Name them by position: top row is Work then Gallery, bottom row About then Contact.
const named = groups.map((g) => ({ g, b: box(g) })).map((n) => ({ ...n, cx: (n.b.x0 + n.b.x1) / 2, cy: (n.b.y0 + n.b.y1) / 2 }));
const midY = (Math.min(...named.map((n) => n.cy)) + Math.max(...named.map((n) => n.cy))) / 2;
const top = named.filter((n) => n.cy < midY).sort((a, b) => a.cx - b.cx);
const bottom = named.filter((n) => n.cy >= midY).sort((a, b) => a.cx - b.cx);
if (top.length !== 2 || bottom.length !== 2) throw new Error('Could not tell the four notes apart by position.');
const notes = { work: top[0], gallery: top[1], about: bottom[0], contact: bottom[1] };

mkdirSync(OUT, { recursive: true });
const report = [];
for (const [name, note] of Object.entries(notes)) {
  const pad = 14;
  const b = note.b;
  const w = b.x1 - b.x0 + 1 + pad * 2, h = b.y1 - b.y0 + 1 + pad * 2;
  const mask = new Uint8Array(w * h);
  note.g.forEach((p) => p.px.forEach((i) => { const x = (i % W) - b.x0 + pad, y = ((i / W) | 0) - b.y0 + pad; mask[y * w + x] = 1; }));
  const pieces = note.g.map((p) => ({ n: p.px.length, x0: p.x0 - b.x0 + pad, y0: p.y0 - b.y0 + pad, x1: p.x1 - b.x0 + pad, y1: p.y1 - b.y0 + pad }));
  const { paths, pen } = traceNote(mask, w, h, pieces);

  const svg = `<!-- Ebun's handwriting, traced from raw-images/footer-notes-photo.webp by scripts/trace-handwriting.mjs. Strokes are in writing order. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" data-source="${b.x0 - pad},${b.y0 - pad}" fill="none" stroke="currentColor" stroke-width="${f1(pen)}" stroke-linecap="round" stroke-linejoin="round">
${paths.map((d) => `  <path d="${d}"/>`).join('\n')}
</svg>
`;
  writeFileSync(`${OUT}/${name}.svg`, svg);
  report.push(`${name}: ${w} x ${h}, ${paths.length} strokes, pen width ${f1(pen)} px`);
}
console.log(report.join('\n'));
