// Shared steps for tracing handwriting into pen strokes (used by
// trace-handwriting.mjs for the footer notes and trace-signposts.mjs).
// Nothing is redrawn: the paths are the centre of the ink, lightly smoothed
// only to remove pixel steps, with the pen width measured from the ink.

// Pen width: from the distance of skeleton pixels to the paper.
export function distanceToPaper(mask, w, h) {
  const d = new Float32Array(w * h);
  const INF = 1e9;
  for (let i = 0; i < w * h; i++) d[i] = mask[i] ? INF : 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (!d[i]) continue;
    if (x > 0) d[i] = Math.min(d[i], d[i - 1] + 1);
    if (y > 0) d[i] = Math.min(d[i], d[i - w] + 1);
    if (x > 0 && y > 0) d[i] = Math.min(d[i], d[i - w - 1] + 1.414);
    if (x < w - 1 && y > 0) d[i] = Math.min(d[i], d[i - w + 1] + 1.414);
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x; if (!d[i]) continue;
    if (x < w - 1) d[i] = Math.min(d[i], d[i + 1] + 1);
    if (y < h - 1) d[i] = Math.min(d[i], d[i + w] + 1);
    if (x < w - 1 && y < h - 1) d[i] = Math.min(d[i], d[i + w + 1] + 1.414);
    if (x > 0 && y < h - 1) d[i] = Math.min(d[i], d[i + w - 1] + 1.414);
  }
  return d;
}

// Zhang-Suen thinning: ink down to one-pixel centre lines.
export function thin(mask, w, h) {
  const m = Uint8Array.from(mask);
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : m[y * w + x]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const step of [0, 1]) {
      const del = [];
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        if (!m[y * w + x]) continue;
        const p = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1), at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
        const b = p.reduce((s, v) => s + v, 0);
        if (b < 2 || b > 6) continue;
        let a = 0;
        for (let k = 0; k < 8; k++) if (!p[k] && p[(k + 1) % 8]) a++;
        if (a !== 1) continue;
        if (step === 0 && (p[0] * p[2] * p[4] || p[2] * p[4] * p[6])) continue;
        if (step === 1 && (p[0] * p[2] * p[6] || p[0] * p[4] * p[6])) continue;
        del.push(y * w + x);
      }
      if (del.length) { changed = true; del.forEach((i) => (m[i] = 0)); }
    }
  }
  return m;
}

// Follow the centre lines into strokes, keeping the pen's direction through
// crossings, starting from the leftmost free end each time (writing order).
export function follow(skel, w, h) {
  const left = Uint8Array.from(skel);
  const N = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const free = (x, y) => N.map(([dx, dy]) => [x + dx, y + dy]).filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < w && ny < h && left[ny * w + nx]);
  const strokes = [];
  for (;;) {
    let start = null, best = Infinity;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!left[y * w + x]) continue;
      const deg = free(x, y).length;
      const score = (deg <= 1 ? 0 : 1e6) + x; // ends first, then leftmost
      if (score < best) { best = score; start = [x, y]; }
    }
    if (!start) break;
    const pts = [start];
    left[start[1] * w + start[0]] = 0;
    for (;;) {
      const [x, y] = pts[pts.length - 1];
      const next = free(x, y);
      if (!next.length) break;
      const back = pts[Math.max(0, pts.length - 5)];
      const dir = [x - back[0], y - back[1]];
      const len = Math.hypot(...dir) || 1;
      next.sort((a, b) => {
        const turn = (p) => { const v = [p[0] - x, p[1] - y]; return -((v[0] * dir[0] + v[1] * dir[1]) / (len * Math.hypot(...v))); };
        return turn(a) - turn(b);
      });
      const [nx, ny] = next[0];
      left[ny * w + nx] = 0;
      pts.push([nx, ny]);
    }
    strokes.push(pts);
  }
  return strokes;
}

// Smooth away pixel steps (a short moving average), then drop points that add nothing.
export function tidy(pts) {
  if (pts.length < 3) return pts;
  const k = 2;
  const avg = pts.map((p, i) => {
    let sx = 0, sy = 0, n = 0;
    for (let j = Math.max(0, i - k); j <= Math.min(pts.length - 1, i + k); j++) { sx += pts[j][0]; sy += pts[j][1]; n++; }
    return i === 0 || i === pts.length - 1 ? p : [sx / n, sy / n];
  });
  const rdp = (a, eps) => {
    if (a.length < 3) return a;
    const [s, e] = [a[0], a[a.length - 1]];
    let far = 0, idx = 0;
    for (let i = 1; i < a.length - 1; i++) {
      const d = Math.abs((e[1] - s[1]) * a[i][0] - (e[0] - s[0]) * a[i][1] + e[0] * s[1] - e[1] * s[0]) / (Math.hypot(e[0] - s[0], e[1] - s[1]) || 1);
      if (d > far) { far = d; idx = i; }
    }
    return far > eps ? [...rdp(a.slice(0, idx + 1), eps).slice(0, -1), ...rdp(a.slice(idx), eps)] : [s, e];
  };
  return rdp(avg, 0.7);
}

export const f1 = (n) => Math.round(n * 10) / 10;
export function pathOf(pts) {
  if (pts.length === 1) return `M${f1(pts[0][0])} ${f1(pts[0][1])}h0.1`;
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}


// One note: mask (1 = ink) of w x h, and its ink pieces in the same
// coordinates ({ n: pixel count, x0, y0, x1, y1 }). Returns the stroke paths
// in writing order and the pen width.
export function traceNote(mask, w, h, pieces) {
  const dist = distanceToPaper(mask, w, h);
  const skel = thin(mask, w, h);
  const widths = [];
  for (let i = 0; i < w * h; i++) if (skel[i]) widths.push(dist[i]);
  widths.sort((a, c) => a - c);
  const pen = Math.max(2, 2 * widths[Math.floor(widths.length / 2)]);
  let strokes = follow(skel, w, h).filter((s) => s.length >= Math.max(3, pen * 0.6));

  // Keep small separate marks (the dot of a "?") even though they are short.
  const dots = pieces.filter((p) => p.n < pen * pen * 3).map((p) => [[(p.x0 + p.x1) / 2, (p.y0 + p.y1) / 2]]);
  dots.forEach((d) => { if (!strokes.some((s) => s.some(([x, y]) => Math.hypot(x - d[0][0], y - d[0][1]) < pen))) strokes.push(d); });

  // Writing order: by line (top to bottom), then left to right.
  const lineGap = pen * 7;
  const info2 = strokes.map((s) => ({ s, x: Math.min(...s.map((p) => p[0])), y: s.reduce((t, p) => t + p[1], 0) / s.length }));
  info2.sort((a, c) => a.y - c.y);
  let line = 0, lastY = info2[0].y;
  info2.forEach((o) => { if (o.y - lastY > lineGap) line++; o.line = line; lastY = o.y; });
  info2.sort((a, c) => a.line - c.line || a.x - c.x);
  const paths = info2.map((o) => pathOf(tidy(o.s)));

  return { paths, pen };
}
