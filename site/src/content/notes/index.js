// Loads every note SVG in this folder as text, so it can be drawn inline.
// To swap a placeholder for real handwriting, replace the .svg file and keep
// its name. Nothing else needs to change.
const files = import.meta.glob('./**/*.svg', { query: '?raw', import: 'default', eager: true });

export function noteSvg(path) {
  const svg = files[`./${path}`];
  if (!svg) throw new Error(`Note file not found: src/content/notes/${path}`);
  return svg;
}
