// Draws ROUGH PLACEHOLDER notes as SVG files in src/content/notes/.
// Ebun will replace every file this makes with her own handwriting from Figma.
// Run with: npm run placeholder-notes   (this overwrites the files, so do not
// run it after real handwriting has been dropped in).
//
// Two files per note:
//   <id>-marks.svg  Circles, underlines and (only when needed) arrows. The
//                   viewBox is the screen image's size in pixels, so marks
//                   land on the right spot.
//   <id>-words.svg  2 to 4 handwritten words. Any size. Shown on the page
//                   beside the screen, never on it.
// The typed sentence under the words lives in the content file, not here.
//
// Words use a single-line Hershey font (one stroke per pen movement) only so
// the placeholder draws like a pen. The final site ships no handwriting font.
//
// Every mark is checked against the boxes of the elements around it. If a
// mark would touch something it is not about, the script stops with an error.
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const hershey = require('hersheytext');

const OUT = 'src/content/notes/fileo';
mkdirSync(OUT, { recursive: true });

// Small seeded random so the wobble is the same every run.
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const wobble = (n) => (rand() - 0.5) * 2 * n;
const f = (n) => Math.round(n * 10) / 10;

// Smooth curve through points (Catmull-Rom to cubic Bezier).
function smooth(pts) {
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

// A stroke is its points (for the touch check) plus its path data.
const stroke = (pts) => ({ pts, d: smooth(pts) });

// A hand-drawn rounded loop that goes all the way round a box without
// cutting its corners, with a small overshoot where the pen comes back round
// past its start. box = [left, top, right, bottom].
function loop([l, t, r, b], padX, padY = padX) {
  const cx = (l + r) / 2, cy = (t + b) / 2;
  const rx = (r - l) / 2 + padX, ry = (b - t) / 2 + padY;
  // Corner roundness: the roundest loop whose corners still clear the box's
  // corners. Higher n = squarer corners.
  const cornerX = ((r - l) / 2 + 6) / (rx * 0.985), cornerY = ((b - t) / 2 + 6) / (ry * 0.985);
  let n = 4;
  while (cornerX ** n + cornerY ** n > 0.92 && n < 40) n += 0.5;
  const start = -2.35 + wobble(0.1);
  const sweep = Math.PI * 2 + 0.4;
  const phase = rand() * 6;
  const pts = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const a = start + sweep * k;
    const c = Math.cos(a), s = Math.sin(a);
    const spiral = 0.992 + k * 0.016; // starts a touch inside, ends a touch outside
    const sway = 1 + Math.sin(a * 3 + phase) * 0.004;
    pts.push([
      cx + Math.sign(c) * Math.abs(c) ** (2 / n) * rx * spiral * sway,
      cy + Math.sign(s) * Math.abs(s) ** (2 / n) * ry * spiral * sway,
    ]);
  }
  return [stroke(pts)];
}

// A quick underline, drawn left to right, drifting slightly.
function underline(x1, x2, y, drift = 3) {
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const k = i / 10;
    pts.push([x1 + (x2 - x1) * k, y + Math.sin(k * Math.PI) * drift - k * drift * 0.8 + wobble(0.6)]);
  }
  return [stroke(pts)];
}

// A slightly bowed line with a two-stroke head at the end.
function arrow(x1, y1, x2, y2, bow, head) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const k = i / 12;
    const b = Math.sin(k * Math.PI) * bow;
    pts.push([x1 + (x2 - x1) * k + nx * b, y1 + (y2 - y1) * k + ny * b]);
  }
  const end = pts[pts.length - 1], prev = pts[pts.length - 3];
  const ang = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
  const wing = (side) => {
    const a = ang + Math.PI + side * (0.5 + wobble(0.05));
    return stroke([[end[0] + Math.cos(a) * head, end[1] + Math.sin(a) * head], end]);
  };
  return [stroke(pts), wing(1), wing(-1)];
}

// Fails loudly if any point of a mark (allowing for stroke width) lands
// inside a box it must not touch.
function check(id, strokes, avoid, sw) {
  const clear = sw / 2 + 2;
  for (const s of strokes) {
    for (let i = 0; i < s.pts.length; i++) {
      const a = s.pts[i], b = s.pts[i + 1] || a;
      for (let k = 0; k <= 8; k++) {
        const x = a[0] + (b[0] - a[0]) * (k / 8), y = a[1] + (b[1] - a[1]) * (k / 8);
        for (const [name, [l, t, r, btm]] of Object.entries(avoid)) {
          if (x > l - clear && x < r + clear && y > t - clear && y < btm + clear) {
            throw new Error(`${id}: mark touches "${name}" near (${f(x)}, ${f(y)})`);
          }
        }
      }
    }
  }
}

function marksSvg(w, h, sw, strokes) {
  const body = strokes.map((s) => `  <path d="${s.d}"/>`).join('\n');
  return `<!-- PLACEHOLDER marks. Replace with Ebun's handwriting from Figma. Keep viewBox="0 0 ${w} ${h}". -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none" stroke="#2440C8" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
${body}
</svg>
`;
}

// Words in upright print, one <path> per letter so the pen moves letter by
// letter. Each letter tilts and sits a tiny bit differently, like a hand.
function wordsSvg(text, capHeight = 17, sw = 2.4) {
  const size = capHeight / 500; // EMS Tech cap height is 500 units
  const baseY = capHeight + 3;
  const paths = [];
  let x = 0;
  for (const ch of hershey.renderTextArray(text, { font: 'ems_tech' })) {
    if (!ch) continue;
    const w = ch.width * size;
    if (ch.d) {
      const tilt = wobble(0.03), lift = wobble(0.7), ox = x + w / 2;
      const d = ch.d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, px, py) => {
        const gx = x + px * size - ox, gy = -py * size; // Hershey y points up
        const rx = gx * Math.cos(tilt) - gy * Math.sin(tilt);
        const ry = gx * Math.sin(tilt) + gy * Math.cos(tilt);
        return `${f(ox + rx)} ${f(baseY + ry + lift)}`;
      });
      paths.push(d);
    }
    x += w;
  }
  const width = Math.ceil(x + 4), height = Math.ceil(capHeight * 1.6 + 6);
  const body = paths.map((d) => `  <path d="${d}"/>`).join('\n');
  return `<!-- PLACEHOLDER words. Replace with Ebun's handwriting from Figma (any size). -->
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="-2 -2 ${width} ${height}" fill="none" stroke="#2440C8" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
${body}
</svg>
`;
}

// Element boxes measured from each screen image, in image pixels:
// [left, top, right, bottom].
const screens = {
  // Fileo dashboard for a returning user, 776 x 2242
  dashboard: {
    size: [776, 2242], sw: 5,
    boxes: {
      header: [48, 38, 727, 105], divider: [4, 144, 771, 145],
      card: [48, 186, 727, 777], nextCard: [48, 810, 727, 1037],
      history: [48, 1076, 727, 1533], documentsTitle: [49, 1589, 720, 1608],
    },
  },
  // Fileo review screen, 780 x 1910
  review: {
    size: [780, 1910], sw: 5,
    boxes: {
      subtitle: [31, 281, 653, 374], card: [30, 422, 747, 711], income: [30, 752, 747, 863],
      info: [30, 1330, 747, 1485], approve: [30, 1566, 747, 1653], change: [30, 1686, 747, 1773],
      changeLabel: [231, 1719, 545, 1746],
    },
  },
  // Fileo landing page hero, 2880 x 1137
  landing: {
    size: [2880, 1137], sw: 9,
    boxes: {
      badge: [1269, 260, 1611, 308], headline: [1106, 350, 1774, 572], sub: [1040, 607, 1840, 760],
      startButton: [1002, 826, 1545, 914], howButton: [1569, 824, 1878, 916], howLabel: [1616, 859, 1830, 879],
      pillTime: [856, 996, 1156, 1028], pillReview: [1212, 996, 1685, 1028], pillSecure: [1741, 996, 2024, 1028],
    },
  },
};

const without = (boxes, ...keep) => Object.fromEntries(Object.entries(boxes).filter(([k]) => !keep.includes(k)));

const notes = {
  'dash-status': {
    screen: 'dashboard', about: ['card'],
    marks: (b) => loop(b.card, 24, 19), // 41px free above, 33 below
    words: 'Status first',
  },
  'dash-history': {
    screen: 'dashboard', about: ['history'],
    marks: (b) => loop(b.history, 26, 24), // 39px free above, 56 below
    words: 'Every filing kept',
  },
  'review-card': {
    screen: 'review', about: ['card'],
    marks: (b) => loop(b.card, 22, 24), // 48px free above, 41 below
    words: 'Savings beside the bill',
  },
  'review-approve': {
    screen: 'review', about: ['approve'],
    marks: (b) => loop(b.approve, 20, 21), // 81px free above, 33 below
    words: 'Their final call',
  },
  'review-change': {
    screen: 'review', about: ['change', 'changeLabel'],
    marks: (b) => underline(b.changeLabel[0] - 6, b.changeLabel[2] + 6, b.changeLabel[3] + 11),
    words: 'Same size', onTarget: true, // an underline sits inside the button
  },
  // Landing page version of the hero, kept for comparison. The words sit far
  // from these marks, so they keep an arrow from the screen's edge.
  'landing-headline': {
    screen: 'landing', about: ['headline'],
    marks: (b) => [...loop(b.headline, 44, 23), ...arrow(2860, 461, 1846, 461, -24, 34)], // 42px free above, 35 below
    words: 'Complexity, removed',
  },
  'landing-steps': {
    screen: 'landing', about: ['howButton', 'howLabel'],
    marks: (b) => [...underline(b.howLabel[0] - 8, b.howLabel[2] + 8, b.howLabel[3] + 14, 4), ...arrow(2860, 870, 1915, 870, 18, 34)],
    words: 'Show the steps', onTarget: true,
  },
  'landing-trust': {
    screen: 'landing', about: ['pillReview', 'pillSecure'],
    marks: (b) => [...underline(b.pillReview[0] + 6, b.pillSecure[2] - 4, b.pillReview[3] + 18, 4), ...arrow(2860, 1050, 2065, 1050, 14, 34)],
    words: 'Specific trust', onTarget: true,
  },
};

for (const [id, n] of Object.entries(notes)) {
  const s = screens[n.screen];
  const strokes = n.marks(s.boxes);
  check(id, strokes, without(s.boxes, ...(n.onTarget ? n.about : [])), s.sw);
  writeFileSync(`${OUT}/${id}-marks.svg`, marksSvg(s.size[0], s.size[1], s.sw, strokes));
  writeFileSync(`${OUT}/${id}-words.svg`, wordsSvg(n.words));
  console.log(`ok  ${id}: ${n.onTarget ? 'touches only' : 'goes round, touching nothing:'} ${n.about.join(', ')}`);
}
