// Ebun's traced handwriting for the footer notes, loaded as text so it can
// draw itself. Made by scripts/trace-handwriting.mjs from
// raw-images/footer-notes-photo.webp. To change a note, replace its file.
// Downloaded only when the footer places its notes (loadFooterNotes).
const files = import.meta.glob('./*.svg', { query: '?raw', import: 'default' });
const loaded = {};

export async function loadFooterNotes(names) {
  await Promise.all(names.map(async (file) => {
    const load = files[`./${file}`];
    if (!load) throw new Error(`Footer note not found: src/content/footer-notes/${file}`);
    loaded[file] ??= await load();
  }));
}

export function footerNote(file) {
  const svg = loaded[file];
  if (!svg) throw new Error(`Footer note not loaded yet: ${file} (call loadFooterNotes first)`);
  // Drop the fixed size and the comment; the page sizes the note.
  return svg.replace(/<!--.*?-->\s*/s, '').replace(/ width="[\d.]+" height="[\d.]+"/, '');
}
