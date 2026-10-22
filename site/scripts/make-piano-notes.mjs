// Turns the raw University of Iowa piano recordings into the short notes the
// hero plays (public/sounds/piano/<note>.mp3).
//
// Source: University of Iowa Electronic Music Studios, piano (Steinway model B),
// single notes played mf, AIFF. theremin.music.uiowa.edu/MISpiano.html
// Their terms: the recordings "may be downloaded and used for any projects,
// without restrictions." The raw files are large (about 5 MB each), so they
// stay out of the repo.
//
// Each note: cut the silence before the key is struck (a 3 ms fade-in avoids
// a click), keep the first
// seconds, fade out, level the loudest point, save a small stereo mp3.
//
// Run from site/:
//   node scripts/make-piano-notes.mjs <folder with Piano.mf.<note>.aiff> [path to ffmpeg]
// The notes come from `piano.notes` in src/content/motion.js.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import motion from '../src/content/motion.js';

const [rawDir, ffmpeg = 'ffmpeg'] = process.argv.slice(2);
if (!rawDir) {
  console.error('Usage: node scripts/make-piano-notes.mjs <raw folder> [ffmpeg]');
  process.exit(1);
}

const LENGTH = 2.6; // seconds kept per note
const FADE = 1.1; // seconds of fade at the end
const PEAK = -1; // dB, loudest point of every note
const OUT = 'public/sounds/piano';
mkdirSync(OUT, { recursive: true });

// ffmpeg writes its reports to stderr.
const run = (args) => {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-nostats', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${r.stderr || r.error}`);
  return r.stderr;
};
const cut = `silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.004,atrim=0:${LENGTH},afade=t=in:d=0.003`; // the short fade-in avoids a click

for (const note of motion.piano.notes) {
  const src = join(rawDir, `Piano.mf.${note}.aiff`);
  if (!existsSync(src)) throw new Error(`Missing ${src}`);
  // Measure the loudest point after cutting, then level it to PEAK.
  const report = run(['-i', src, '-af', `${cut},volumedetect`, '-f', 'null', '-']);
  const max = Number(/max_volume: (-?[\d.]+) dB/.exec(report)?.[1]);
  if (!Number.isFinite(max)) throw new Error(`Could not measure ${src}`);
  const out = join(OUT, `${note}.mp3`);
  run(['-y', '-i', src, '-af', `${cut},volume=${(PEAK - max).toFixed(2)}dB,afade=t=out:st=${LENGTH - FADE}:d=${FADE}`,
    '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '80k', '-joint_stereo', '1', out]);
  console.log(`${note}: raised ${(PEAK - max).toFixed(1)} dB, ${(statSync(out).size / 1024).toFixed(0)} KB`);
}
