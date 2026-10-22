# Portfolio redesign (prototype)

The new site. React + Vite + GSAP. The old site at the repo root is untouched.
Design rules live in `../DESIGN.md`.

## Run it (Windows, Command Prompt)

```
cd %USERPROFILE%\ebunoluwaoyetunji.github.io
git switch redesign
cd site
npm install
npm run dev
```

Open http://localhost:5173. Press Ctrl+C in Command Prompt to stop.
`npm install` is only needed the first time, or after dependencies change.

## Where things live

| What | File |
| --- | --- |
| Home words, hero screen, hero notes | `src/content/home.js` |
| Fileo words, screens, notes | `src/content/fileo.js` |
| Pen speed and pauses | `src/content/pen.js` |
| Note drawings (SVG) | `src/content/notes/fileo/` |
| Screen images | `public/images/fileo/` (made from `raw-images/` by `npm run images`) |

## Comparing the two hero versions

The hero shows the Fileo dashboard by default. To see the landing page version,
open http://localhost:5173/?hero=landing (and ?hero=app to go back).
To change the default, set `show` in `src/content/home.js`.

## What a note is made of

1. **Marks** on the screen: a circle or underline that touches only the thing
   it is about. An arrow only when the words cannot sit right beside the mark.
2. **Handwritten words** beside the screen, on the page, never on the screen: 2 to 4 words.
3. **A typed sentence** under the words, in the body font. It fades in after
   the pen finishes. Screen readers read the sentence and skip the drawing.
   Edit it as `sentence` in the content file.

## Replacing a placeholder note with your handwriting

Each note is two SVG files. Replace a file, keep the same name, and refresh. That is all.

**Marks** (`...-marks.svg`): circles, underlines, arrows on the screen.
1. In Figma, make a frame exactly the size of the screen image:
   dashboard 776 x 2242, review screen 780 x 1910, landing page 2880 x 1137.
2. Drop the screen image (from `raw-images/`) in at 0,0. Draw on top with the Pencil tool.
3. Hide the screen image. Remove the frame's fill.
4. Export the frame as SVG. Save it over the old file.

**Words** (`...-words.svg`): your handwriting, any size. It shows at the size
you export it, beside the screen on wide screens and below it on phones.

Export tips so the pen can draw it:
- Keep strokes as strokes. Do not use Outline Stroke, and avoid variable-width brushes.
  The animation traces each stroke along its length.
- Each separate stroke is drawn in the order it appears in the layer list (bottom first).
- Colour does not matter. Every note is shown in pen blue.

The words line up with the right-hand side of their marks (an arrow's tail,
or the middle of a circle's right side). To place them yourself, add
`wordsAt: 40` (percent down the screen) to that note in the content file.

`npm run placeholder-notes` rebuilds the placeholders and checks that no mark
touches anything it is not about. It overwrites the note files, so do not run
it after adding your own handwriting.
