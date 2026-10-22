// Loads the butterfly drawings as text, so they can be drawn inline.
// Each option is a folder with three files: left-wing.svg, right-wing.svg, body.svg.
// To use a traced drawing, replace those three files (same names, same 100 x 100 box).
const files = import.meta.glob('./**/*.svg', { query: '?raw', import: 'default', eager: true });

export function butterflyParts(option) {
  const part = (name) => {
    const svg = files[`./option-${option}/${name}.svg`];
    if (!svg) throw new Error(`Butterfly file not found: src/content/butterfly/option-${option}/${name}.svg`);
    return svg;
  };
  return { left: part('left-wing'), right: part('right-wing'), body: part('body') };
}
