// Turns the full-size screens in raw-images/ into WebP files at two widths.
// Run with: npm run images
// Add a new screen by adding a line to `screens` below.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const screens = [
  // [source, output base name, widths]
  ['raw-images/fileo-dashboard.png', 'public/images/fileo/dashboard', [388, 776]],
  ['raw-images/fileo-landing-hero.png', 'public/images/fileo/landing-hero', [1440, 2880]],
  ['raw-images/fileo-review.png', 'public/images/fileo/review', [390, 780]],
  ['raw-images/fileo-incomplete.png', 'public/images/fileo/incomplete', [390, 780]],
  // Boulote screens are cropped from the case study images, which are small.
  // TODO (Ebun): replace with full-size exports from Figma.
  ['raw-images/boulote-ongoing.png', 'public/images/boulote/ongoing', [443]],
  ['raw-images/boulote-search.png', 'public/images/boulote/search', [572]],
  ['raw-images/boulote-projects-empty.png', 'public/images/boulote/projects-empty', [657]],
];

for (const [src, out, widths] of screens) {
  mkdirSync(dirname(out), { recursive: true });
  const meta = await sharp(src).metadata();
  console.log(`${src}: ${meta.width} x ${meta.height}`);
  for (const w of widths) {
    const file = `${out}-${w}.webp`;
    const info = await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82 }).toFile(file);
    console.log(`  ${file}  ${info.width} x ${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}
