// Draws the three butterfly options as pen-line SVGs, three files each:
//   src/content/butterfly/option-N/left-wing.svg
//   src/content/butterfly/option-N/right-wing.svg
//   src/content/butterfly/option-N/body.svg
// All parts share one 100 x 100 box. The body runs down the middle (x = 50)
// and its lower tip, at (50, 82), is the point that rests on a letter.
// Run with: node scripts/make-butterflies.mjs (overwrites the files).
// To use Ebun's own drawing instead, replace the three files of one option
// with traced SVGs in the same 100 x 100 box, with the body on x = 50.
import { mkdirSync, writeFileSync } from 'node:fs';

const f = (n) => Math.round(n * 10) / 10;

// Seeded wobble, so each run draws the same "hand".
function wobbler(seed) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return (n) => (rand() - 0.5) * 2 * n;
}

// Smooth pen line through points (Catmull-Rom to cubic Bezier).
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

// A stroke from points, with a little hand wobble (ends kept steady).
const stroke = (pts, wob, amount = 0.9) => smooth(pts.map(([x, y], i) => (i === 0 || i === pts.length - 1 ? [x, y] : [x + wob(amount), y + wob(amount)])));
const mirror = (pts) => pts.map(([x, y]) => [100 - x, y]);

function svg(paths, width) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">
${paths.map((d) => `  <path d="${d}"/>`).join('\n')}
</svg>
`;
}

const options = {
  // 1. Classic: rounded upper wing, smaller lower wing, curled antennae.
  1: {
    width: 2.4,
    wing: [[48, 46], [41, 35], [30, 24], [18, 18], [9, 23], [8, 35], [15, 45], [29, 51], [44, 52], [35, 58], [25, 66], [22, 75], [29, 80], [40, 75], [46, 62], [48.5, 52]],
    veins: [],
    body: [[50, 37], [51.8, 47], [51.4, 63], [50.2, 80], [48.8, 63], [48.4, 47], [50, 37]],
    antennae: [[[49.6, 36], [46, 27], [42, 18], [39.5, 14.5], [41.5, 13]], [[50.4, 36], [54, 27], [58, 18], [60.5, 14.5], [58.5, 13]]],
  },
  // 2. Simple: one soft loop per wing, straight-ish antennae.
  2: {
    width: 2.4,
    wing: [[48, 48], [38, 32], [24, 21], [11, 23], [6, 37], [11, 53], [21, 65], [33, 70], [43, 64], [48, 55], [47.2, 47]],
    veins: [],
    body: [[50, 36], [50.6, 52], [50.3, 66], [50, 81]],
    antennae: [[[49.6, 36], [45.5, 25], [42, 16]], [[50.4, 36], [54.5, 25], [58.5, 16.5]]],
  },
  // 3. Sketch: a pointed upper wing with one vein line, like a quick pen study.
  3: {
    width: 2.2,
    wing: [[48, 46], [35, 29], [19, 15], [7, 16], [7, 28], [14, 42], [28, 50], [46, 52], [31, 60], [21, 71], [26, 80], [38, 76], [46, 62], [48.4, 53]],
    veins: [[[47, 49], [37, 39], [23, 27]], [[47, 57], [39, 64], [31, 72]]],
    body: [[50, 36], [51.6, 46], [51.2, 64], [50.1, 81], [48.9, 64], [48.5, 46], [50, 36]],
    antennae: [[[49.6, 36], [46.5, 28], [44, 19], [42.5, 15]], [[50.4, 36], [53.5, 28], [56, 19], [57.5, 15]]],
  },
};

for (const [n, o] of Object.entries(options)) {
  const dir = `src/content/butterfly/option-${n}`;
  mkdirSync(dir, { recursive: true });
  const left = wobbler(100 + Number(n));
  const right = wobbler(200 + Number(n)); // a different hand for the right wing: never a perfect mirror
  const body = wobbler(300 + Number(n));
  writeFileSync(`${dir}/left-wing.svg`, svg([stroke(o.wing, left), ...o.veins.map((v) => stroke(v, left, 0.6))], o.width));
  writeFileSync(`${dir}/right-wing.svg`, svg([stroke(mirror(o.wing), right), ...o.veins.map((v) => stroke(mirror(v), right, 0.6))], o.width));
  writeFileSync(`${dir}/body.svg`, svg([stroke(o.body, body, 0.3), ...o.antennae.map((a) => stroke(a, body, 0.5))], o.width));
  console.log(`wrote ${dir}`);
}
