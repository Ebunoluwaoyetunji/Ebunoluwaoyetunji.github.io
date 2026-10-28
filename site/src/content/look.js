// Fonts, colour and frames for the homepage.
// Italiana: big headings, project names and footer words (one weight, no italic).
// Body: IBM Plex Sans (chosen 2026-10-09).
// Courier Prime: small facts only (dates, roles, labels).

export default {
  accent: '#D2220F', // vermilion, the only accent
  footerNoteInk: '#E8492F', // lighter vermilion for the handwriting on the black footer (4.76:1)
  display: "'Italiana', 'Italiana Fallback', serif",
  facts: "'Courier Prime', 'Courier Prime Fallback', 'Courier New', monospace",

  body: "'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif",

  // Every screen hangs in the same frame, like a canvas: a thin dark edge,
  // a pale mount, then the screen in the middle. One shape for all frames.
  frame: {
    aspect: '16 / 10', // the wide frame: width / height
    edge: '#1c1c1c', // thin dark edge
    mount: '#f4f4f1', // pale border around the screen
    mountSize: 0.045, // mount above and below the screen, as a share of the frame width (the sides are wider to match the frame's shape)
    screenGap: 0.03, phoneHeight: 0.86 /* phone frames: each phone's height, as a share of the inside of the frame */, // space between phone screens sharing a frame, as a share of the space inside the mount
  },
};
