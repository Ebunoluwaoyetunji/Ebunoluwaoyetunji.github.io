// Traces Ebun's three handwritten signposts (transparent PNGs, dark ink) into
// pen strokes, one SVG each, the same way as the footer notes
// (scripts/trace-handwriting.mjs, shared steps in lib/trace-strokes.mjs).
//
//   node scripts/trace-signposts.mjs
//   in:  src/content/signposts/signpost-N-*.png and <project>-signpost-N-*.png
//   out: the same name, .svg
//
// Each PNG is first scaled so its pen is about as wide as in the footer scan
// (PEN px), so the same thinning and smoothing settings apply. Her strokes
// are kept as they are: nothing is redrawn or tidied beyond pixel steps.
import sharp from 'sharp';
import { readdirSync, writeFileSync } from 'node:fs';
import { traceNote, distanceToPaper, f1 } from './lib/trace-strokes.mjs';

const DIR = 'src/content/signposts';
const PEN = 8; // target pen width in px, as in the footer scan
const ALPHA = 128; // alpha above which a pixel counts as ink
const INK = 140; // and grey level below which

// Ink mask at a given scale.
async function inkAt(file, scale) {
  const meta = await sharp(file).metadata();
  const w = Math.round(meta.width * scale), h = Math.round(meta.height * scale);
  const { data, info } = await sharp(file).ensureAlpha().resize(w, h, { kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
  const c = info.channels;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * c], g = data[i * c + 1], b = data[i * c + 2], a = data[i * c + 3];
    mask[i] = a > ALPHA && 0.2126 * r + 0.7152 * g + 0.0722 * b < INK ? 1 : 0;
  }
  return { mask, w, h };
}

// The pen width of the ink: twice the typical distance from the middle of a stroke to the paper.
function penWidth(mask, w, h) {
  const d = distanceToPaper(mask, w, h);
  const peaks = [];
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x; if (!d[i]) continue;
    if (d[i] >= d[i - 1] && d[i] >= d[i + 1] && d[i] >= d[i - w] && d[i] >= d[i + w]) peaks.push(d[i]);
  }
  peaks.sort((a, b) => a - b);
  return 2 * peaks[Math.floor(peaks.length / 2)];
}

// Connected pieces of ink (8-connected), with their boxes.
function piecesOf(mask, w, h) {
  const seen = new Uint8Array(w * h);
  const pieces = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i]) continue;
    const stack = [i]; seen[i] = 1;
    let n = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
    while (stack.length) {
      const p = stack.pop(); n++;
      const x = p % w, y = (p / w) | 0;
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); }
      }
    }
    pieces.push({ n, x0, y0, x1, y1 });
  }
  return pieces;
}

const report = [];
for (const name of readdirSync(DIR).filter((f) => /^([a-z-]+-)?signpost-\d.*\.png$/.test(f)).sort()) {
  const file = `${DIR}/${name}`;
  const full = await inkAt(file, 1);
  const scale = PEN / penWidth(full.mask, full.w, full.h);
  const { mask: m0, w: W, h: H } = await inkAt(file, scale);
  // Crop to the ink, with a margin, and drop dust.
  const all = piecesOf(m0, W, H).filter((p) => p.n >= 6);
  const pad = 14;
  const bx0 = Math.min(...all.map((p) => p.x0)), by0 = Math.min(...all.map((p) => p.y0));
  const bx1 = Math.max(...all.map((p) => p.x1)), by1 = Math.max(...all.map((p) => p.y1));
  const w = bx1 - bx0 + 1 + pad * 2, h = by1 - by0 + 1 + pad * 2;
  const mask = new Uint8Array(w * h);
  for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) if (m0[y * W + x]) mask[(y - by0 + pad) * w + (x - bx0 + pad)] = 1;
  const pieces = piecesOf(mask, w, h).filter((p) => p.n >= 6);
  const { paths, pen } = traceNote(mask, w, h, pieces);
  const svg = `<!-- Ebun's handwriting, traced from ${name} by scripts/trace-signposts.mjs (scaled by ${scale.toFixed(3)}). Strokes are in writing order. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="${f1(pen)}" stroke-linecap="round" stroke-linejoin="round">
${paths.map((d) => `  <path d="${d}"/>`).join('\n')}
</svg>
`;
  writeFileSync(file.replace(/\.png$/, '.svg'), svg);
  report.push(`${name}: scaled ${scale.toFixed(3)}, ${w} x ${h}, ${paths.length} strokes, pen width ${f1(pen)} px`);
}
console.log(report.join('\n'));
