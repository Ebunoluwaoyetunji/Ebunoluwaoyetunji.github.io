// Ebun's traced handwriting for the footer notes, loaded as text so it can
// draw itself. Made by scripts/trace-handwriting.mjs from
// raw-images/footer-notes-photo.webp. To change a note, replace its file.
const files = import.meta.glob('./*.svg', { query: '?raw', import: 'default', eager: true });

export function footerNote(file) {
  const svg = files[`./${file}`];
  if (!svg) throw new Error(`Footer note not found: src/content/footer-notes/${file}`);
  // Drop the fixed size and the comment; the page sizes the note.
  return svg.replace(/<!--.*?-->\s*/s, '').replace(/ width="[\d.]+" height="[\d.]+"/, '');
}
