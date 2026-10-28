// Loads the butterfly drawings as text, so they can be drawn inline.
// Each option is a folder with three files: left-wing.svg, right-wing.svg, body.svg.
// To use a traced drawing, replace those three files (same names, same 100 x 100 box).
// Only the chosen option is downloaded (loadButterfly, before the homepage starts).
const files = import.meta.glob('./**/*.svg', { query: '?raw', import: 'default' });
const loaded = {};
const NAMES = ['left-wing', 'right-wing', 'body'];
const key = (option, name) => `./option-${option}/${name}.svg`;

export async function loadButterfly(option) {
  await Promise.all(NAMES.map(async (name) => {
    const load = files[key(option, name)];
    if (!load) throw new Error(`Butterfly file not found: src/content/butterfly/option-${option}/${name}.svg`);
    loaded[key(option, name)] ??= await load();
  }));
}

export function butterflyParts(option) {
  const part = (name) => {
    const svg = loaded[key(option, name)];
    if (!svg) throw new Error(`Butterfly not loaded yet: option ${option} (call loadButterfly first)`);
    return svg;
  };
  return { left: part('left-wing'), right: part('right-wing'), body: part('body') };
}
