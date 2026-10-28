// Measures each site font against a common system font, so the fallback faces
// in src/fonts.css take the same room as the real fonts (no jump when they
// arrive). Prints the @font-face rules to paste into src/fonts.css.
// Needs the built site on the preview server (npm run build, npm run preview,
// port 4173; or pass another base) and Microsoft Edge.
//   node scripts/measure-fallback-fonts.mjs [base]
//
// size-adjust: the real font's width over the fallback's, on sample text.
// ascent/descent/line-gap-override: the real font's own, at that size
// (divided by size-adjust, because size-adjust scales them too).

import { spawn, execSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.argv[2] || 'http://localhost:4173';
const PAIRS = [
  { family: 'Italiana', weight: 400, fallback: 'Times New Roman', text: 'Good design is clear thinking made visible. Fileo Boulote Folowr Sporting News Work Gallery About Contact Page not found' },
  { family: 'IBM Plex Sans', weight: 400, fallback: 'Arial', text: 'Designing an AI-native tax filing service for Nigerian freelancers. The developers built it from my files and prototype. A scheduling platform for service businesses.' },
  { family: 'Courier Prime', weight: 400, fallback: 'Courier New', text: 'Product designer Case study Role Year Status Live 2025 View full screen' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const proc = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--remote-debugging-port=9495', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'edge-fonts-'))}`, 'about:blank']);
try {
  let t; for (let i = 0; i < 40 && !t; i++) { await sleep(250); t = await fetch('http://127.0.0.1:9495/json').then((r) => r.json()).catch(() => null); }
  const ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const p = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); p.get(d.id)?.(d); p.delete(d.id); };
  const send = (method, params = {}) => new Promise((r) => { p.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  await send('Network.enable'); await send('Network.setBlockedURLs', { urls: ['*gc.zgo.at*', '*goatcounter.com*'] });
  await send('Page.navigate', { url: `${BASE}/404.html` }); await sleep(2500);
  const out = (await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async () => {
    const pairs = ${JSON.stringify(PAIRS)};
    const res = [];
    for (const f of pairs) {
      await document.fonts.load(f.weight + ' 100px "' + f.family + '"');
      const m = (family) => {
        const c = document.createElement('canvas').getContext('2d');
        c.font = f.weight + ' 100px "' + family + '"';
        const tm = c.measureText(f.text);
        // The normal line height: ascent + descent + line gap.
        const s = document.createElement('span');
        s.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;line-height:normal;font:' + f.weight + ' 100px "' + family + '"';
        s.textContent = 'Hg';
        document.body.appendChild(s);
        const h = s.getBoundingClientRect().height; s.remove();
        return { width: tm.width, ascent: tm.fontBoundingBoxAscent, descent: tm.fontBoundingBoxDescent, normal: h };
      };
      const real = m(f.family), fb = m(f.fallback);
      const size = real.width / fb.width;
      const gap = Math.max(0, real.normal - real.ascent - real.descent);
      res.push({ family: f.family, fallback: f.fallback, sizeAdjust: size, ascent: real.ascent / 100 / size, descent: real.descent / 100 / size, lineGap: gap / 100 / size, real, fb });
    }
    return res;
  })()` })).result.result.value;
  const pct = (v) => `${(v * 100).toFixed(2)}%`;
  for (const r of out) {
    console.log(`/* ${r.family}: measured ${JSON.stringify(r.real)}; ${r.fallback}: ${JSON.stringify(r.fb)} */`);
    console.log(`@font-face {\n  font-family: '${r.family} Fallback';\n  src: local('${r.fallback}');\n  size-adjust: ${pct(r.sizeAdjust)};\n  ascent-override: ${pct(r.ascent)};\n  descent-override: ${pct(r.descent)};\n  line-gap-override: ${pct(r.lineGap)};\n}`);
  }
  ws.close();
} finally { try { execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: 'ignore' }); } catch {} }
process.exit(0);
