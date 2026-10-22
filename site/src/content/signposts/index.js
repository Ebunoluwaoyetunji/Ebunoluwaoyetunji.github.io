// Ebun's handwritten signposts for the case study turning points, loaded as
// text so they can draw themselves. Made by scripts/trace-signposts.mjs from
// the PNGs in this folder. To change one, replace its PNG and run the script.
const files = import.meta.glob('./*.svg', { query: '?raw', import: 'default', eager: true });

export function signpost(file) {
  const svg = files[`./${file}`];
  if (!svg) throw new Error(`Signpost not found: src/content/signposts/${file}`);
  // Drop the fixed size and the comment; the page sizes the note.
  return svg.replace(/<!--.*?-->\s*/s, '').replace(/ width="[\d.]+" height="[\d.]+"/, '');
}
