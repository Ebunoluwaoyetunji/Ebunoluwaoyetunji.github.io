// Helpers for the hand-drawn pen lines (the Journey and the case study guide).

// Small seeded random, so the hand-drawn wobble is the same on every visit.
export function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// A smooth curve through points (Catmull-Rom to cubic Bezier).
export function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

// Samples the curve smooth(pts) draws, going down the page, so lengthAt(y)
// finds how much of it to draw to reach height y, and pointAt(length) where
// that is. Worked out here from the same Bezier segments (asking the browser
// for hundreds of points, path.getPointAtLength, made the page's start slow on
// phones). total: the path's own length (path.getTotalLength(), one call), so
// lengths match the browser's dash drawing exactly.
const STEPS = 48; // points per segment
export function curveSampler(pts, total) {
  const r1 = (v) => Math.round(v * 10) / 10; // smooth() writes one decimal
  const samples = [[0, r1(pts[0][0]), r1(pts[0][1])]]; // [length, x, y]
  let len = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const a = [r1(p1[0]), r1(p1[1])];
    const b = [r1(p1[0] + (p2[0] - p0[0]) / 6), r1(p1[1] + (p2[1] - p0[1]) / 6)];
    const c = [r1(p2[0] - (p3[0] - p1[0]) / 6), r1(p2[1] - (p3[1] - p1[1]) / 6)];
    const d = [r1(p2[0]), r1(p2[1])];
    let [px, py] = a;
    for (let k = 1; k <= STEPS; k++) {
      const t = k / STEPS, u = 1 - t;
      const x = u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0];
      const y = u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1];
      len += Math.hypot(x - px, y - py);
      samples.push([len, x, y]);
      px = x; py = y;
    }
  }
  const scale = total && len ? total / len : 1;
  samples.forEach((s) => { s[0] *= scale; });
  const full = len * scale;
  const lengthAt = (y) => {
    if (y <= samples[0][2]) return 0;
    if (y >= samples[samples.length - 1][2]) return full;
    let lo = 0, hi = samples.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid][2] < y) lo = mid; else hi = mid;
    }
    const [l0, , y0] = samples[lo], [l1, , y1] = samples[hi];
    return l0 + ((y - y0) / Math.max(0.001, y1 - y0)) * (l1 - l0);
  };
  const pointAt = (l) => {
    let lo = 0, hi = samples.length - 1;
    if (l <= 0) return { x: samples[0][1], y: samples[0][2] };
    if (l >= full) return { x: samples[hi][1], y: samples[hi][2] };
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (samples[mid][0] < l) lo = mid; else hi = mid;
    }
    const [l0, x0, y0] = samples[lo], [l1, x1, y1] = samples[hi];
    const f = (l - l0) / Math.max(0.001, l1 - l0);
    return { x: x0 + (x1 - x0) * f, y: y0 + (y1 - y0) * f };
  };
  return { total: full, lengthAt, pointAt };
}
