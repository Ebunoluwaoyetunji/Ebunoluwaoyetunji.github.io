import look from '../content/look.js';
import motion from '../content/motion.js';

// The CSS variables every page sets from look.js and motion.js: accent, fonts,
// frame shape and the pen line width. scripts/prerender.mjs writes them into
// each page's HTML, so frames have their shape before any script runs; the
// pages set them again when they start (setRootVars), so a change in look.js
// shows in the dev server too.
export function rootVars() {
  const [fw, fh] = look.frame.aspect.split('/').map(Number);
  return {
    '--accent': look.accent,
    '--display': look.display,
    '--facts': look.facts,
    '--body': look.body,
    '--footer-note-ink': look.footerNoteInk,
    '--frame-aspect': look.frame.aspect,
    '--frame-ratio': String(fw / fh),
    '--frame-edge': look.frame.edge,
    '--frame-mount': look.frame.mount,
    '--frame-mount-size': String(look.frame.mountSize),
    '--frame-screen-gap': String(look.frame.screenGap),
    '--journey-stroke': `${motion.journey.strokeWidth}px`,
  };
}

export function setRootVars() {
  const root = document.documentElement.style;
  Object.entries(rootVars()).forEach(([k, v]) => root.setProperty(k, v));
}

// For the pre-rendered HTML: the same variables as a :root rule.
export const rootVarsCss = () => `:root{${Object.entries(rootVars()).map(([k, v]) => `${k}:${v}`).join(';')}}`;
