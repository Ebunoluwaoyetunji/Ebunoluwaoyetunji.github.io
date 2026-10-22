// Makes the link-preview cards (public/share/*.jpg, 1200 x 630, for LinkedIn,
// WhatsApp and others) and the favicon (public/favicon.ico, icon-192.png,
// apple-touch-icon.png). Run it again after a lead screen or a tagline changes.
//
// Needs the built site on the preview server (npm run build, then
// npm run preview, port 4173) and Microsoft Edge. Fonts come from Google Fonts,
// as on the site.
//   node scripts/make-share-cards.mjs
//
// Home card: the name in Italiana, "Product designer", a vermilion pen line and
// the butterfly. Case study cards: "Case study", the project name, its tagline
// and its first top frame, captured from the built page.

import { spawn, execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'http://localhost:4173';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PAPER = '#f8f6f1';
const INK = '#141414';
const MUTED = '#55554f';
const ACCENT = '#D2220F';
const CASES = ['fileo', 'boulote', 'folowr', 'sporting-news'];
const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime&family=IBM+Plex+Sans:wght@400;500&family=Italiana&display=block">';

const butterfly = ['left-wing', 'right-wing', 'body']
  .map((p) => readFileSync(join(site, `src/content/butterfly/option-2/${p}.svg`), 'utf8').replace(/<svg[^>]*>|<\/svg>/g, ''))
  .join('');

const page = (body, css) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: ${PAPER}; color: ${INK}; }
  ${css}</style></head><body>${body}</body></html>`;

const homeCard = () => page(`
  <div class="name">Ebunoluwa<br>Oyetunji</div>
  <svg class="line" viewBox="0 0 520 24"><path d="M4 14 C 90 6, 200 18, 300 11 S 460 6, 516 12" fill="none" stroke="${ACCENT}" stroke-width="4" stroke-linecap="round"/></svg>
  <div class="role">Product designer</div>
  <div class="url">ebunoluwaoyetunji.github.io</div>
  <svg class="fly" viewBox="0 0 100 100" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${butterfly}</svg>`, `
  .name { position: absolute; left: 88px; top: 92px; font: 150px/0.95 Italiana, serif; letter-spacing: 0.01em; }
  .line { position: absolute; left: 92px; top: 400px; width: 520px; height: 24px; }
  .role { position: absolute; left: 92px; top: 448px; font: 400 36px 'IBM Plex Sans', sans-serif; }
  .url { position: absolute; left: 92px; bottom: 56px; font: 22px 'Courier Prime', monospace; color: ${MUTED}; }
  .fly { position: absolute; right: 110px; top: 150px; width: 260px; height: 260px; transform: rotate(8deg); }`);

const caseCard = ({ name, tagline, frame, w, h }) => {
  // The frame fits a 640 x 470 box on the right.
  const s = Math.min(640 / w, 470 / h);
  return page(`
  <div class="text">
    <div class="kicker">Case study</div>
    <div class="name">${name}</div>
    <div class="tag">${tagline}</div>
  </div>
  <div class="by">Ebunoluwa Oyetunji, product designer</div>
  <img class="frame" src="${frame}" style="width:${Math.round(w * s)}px;height:${Math.round(h * s)}px">`, `
  .text { position: absolute; left: 72px; top: 72px; width: 400px; }
  .kicker { font: 22px 'Courier Prime', monospace; color: ${MUTED}; margin-bottom: 18px; }
  .name { font: ${name.length > 10 ? 84 : 104}px/1 Italiana, serif; margin-bottom: 26px; }
  .tag { font: 400 26px/1.35 'IBM Plex Sans', sans-serif; }
  .by { position: absolute; left: 72px; bottom: 56px; font: 20px 'Courier Prime', monospace; color: ${MUTED}; }
  .frame { position: absolute; right: 64px; top: 50%; transform: translateY(-50%); box-shadow: 0 18px 40px -22px rgba(20,20,20,0.45); }`);
};

// The favicon: an "E" in Italiana, vermilion on paper. Small sizes get a
// heavier stroke so the thin letter still reads in a browser tab.
const iconPage = (stroke) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  html, body { margin: 0; width: 512px; height: 512px; overflow: hidden; background: transparent; }
  .tile { position: absolute; inset: 0; border-radius: 96px; background: ${PAPER}; display: grid; place-items: center; }
  .e { font: 440px/1 Italiana, serif; color: ${ACCENT}; -webkit-text-stroke: ${stroke}px ${ACCENT}; transform: translateY(14px); }
  </style></head><body><div class="tile"><div class="e">E</div></div></body></html>`;

function ico(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, e); head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => p.data)]);
}

const port = 9431;
const profile = mkdtempSync(join(tmpdir(), 'edge-cards-'));
const proc = spawn(EDGE, ['--headless=new', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  let targets;
  for (let i = 0; i < 40 && !targets; i++) { await sleep(250); targets = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).catch(() => null); }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d); pending.delete(d.id); };
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  const js = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.result?.value;
  const shot = async (clip) => Buffer.from((await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: false })).result.data, 'base64');
  const render = async (html, w, h, dpr) => {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: false });
    await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    await send('Page.navigate', { url: 'about:blank' }); await sleep(200);
    await js(`document.open(); document.write(${JSON.stringify(html)}); document.close();`);
    await js(`(async () => { const l = document.querySelector('link[rel=stylesheet]'); if (!l.sheet) await new Promise(r => { l.onload = l.onerror = r; }); await Promise.all(['150px Italiana', '36px "IBM Plex Sans"', '22px "Courier Prime"'].map(f => document.fonts.load(f))); await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); })()`);
    await sleep(400);
    return shot({ x: 0, y: 0, width: w, height: h });
  };
  await send('Page.enable'); await send('Runtime.enable');

  // Home card.
  const cards = [['home', homeCard()]];
  // Case study cards: capture each first top frame from the built page.
  for (const slug of CASES) {
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Page.navigate', { url: `${BASE}/${slug}/` }); await sleep(3000);
    const info = await js(`(async () => {
      const c = document.querySelector('.case__visuals .case__screen:first-child .canvas');
      c.querySelectorAll('.canvas__hint').forEach(h => { h.style.display = 'none'; });
      await Promise.all([...c.querySelectorAll('img')].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
      c.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 600));
      const r = c.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height, name: document.title.split(',')[0].trim(), tagline: document.querySelector('.case__tagline').textContent.trim() };
    })()`);
    const png = await shot({ x: info.x, y: info.y, width: info.width, height: info.height });
    const frame = `data:image/png;base64,${png.toString('base64')}`;
    cards.push([slug, caseCard({ name: info.name, tagline: info.tagline, frame, w: info.width, h: info.height })]);
  }
  await send('Emulation.setEmulatedMedia', { features: [] });
  for (const [name, html] of cards) {
    const png = await render(html, 1200, 630, 2);
    const jpg = await sharp(png).resize(1200, 630).flatten({ background: PAPER }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
    writeFileSync(join(site, `public/share/${name}.jpg`), jpg);
    console.log(`share/${name}.jpg ${Math.round(jpg.length / 1024)} KB`);
  }

  // Favicon.
  const big = await render(iconPage(4), 512, 512, 1);
  const small = await render(iconPage(22), 512, 512, 1);
  const size = (src, n) => sharp(src).resize(n, n, { kernel: 'lanczos3' }).png().toBuffer();
  writeFileSync(join(site, 'public/icon-192.png'), await size(big, 192));
  writeFileSync(join(site, 'public/apple-touch-icon.png'), await sharp(big).resize(180, 180).flatten({ background: PAPER }).png().toBuffer());
  writeFileSync(join(site, 'public/favicon.ico'), ico([
    { size: 16, data: await size(small, 16) },
    { size: 32, data: await size(small, 32) },
    { size: 48, data: await size(small, 48) },
  ]));
  console.log('favicon.ico, icon-192.png, apple-touch-icon.png');
  ws.close();
} finally {
  try { execSync(`taskkill /PID ${proc.pid} /T /F`, { stdio: 'ignore' }); } catch {}
  await sleep(500);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
