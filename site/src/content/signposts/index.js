// Ebun's handwritten signposts for the case study turning points, loaded as
// text so they can draw themselves. Made by scripts/trace-signposts.mjs from
// the PNGs in this folder. To change one, replace its PNG and run the script.
//
// Each file is its own small download: a page loads only its own signposts
// (loadSignposts, in the background once it has started), not every case study's.
const files = import.meta.glob('./*.svg', { query: '?raw', import: 'default' });
const loaded = {};

export async function loadSignposts(names) {
  await Promise.all(names.map(async (file) => {
    const load = files[`./${file}`];
    if (!load) throw new Error(`Signpost not found: src/content/signposts/${file}`);
    loaded[file] ??= await load();
  }));
}

// The signposts a case study uses (its turns).
export const signpostsOf = (study) => (study.turns || []).map((t) => t.signpost?.file).filter(Boolean);

// The drawing, or null while it has not loaded yet.
export function signpost(file) {
  const svg = loaded[file];
  if (!svg) return null;
  // Drop the fixed size and the comment; the page sizes the note.
  return svg.replace(/<!--.*?-->\s*/s, '').replace(/ width="[\d.]+" height="[\d.]+"/, '');
}
