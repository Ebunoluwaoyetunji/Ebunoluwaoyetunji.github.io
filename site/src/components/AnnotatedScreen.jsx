import { useLayoutEffect, useRef, useState } from 'react';
import { noteSvg } from '../content/notes/index.js';
import { drawNotes, keepStrokesReadable } from '../lib/drawNotes.js';
import pen from '../content/pen.js';

// Finds where the words for a note should sit: level with the right-hand
// side of its marks. For an arrow that is its tail. For a loop with a long,
// flat right side, it is the middle of that side.
function anchorY(svg) {
  const vb = svg.viewBox.baseVal;
  const points = [];
  svg.querySelectorAll('path, line, polyline, polygon, circle, ellipse, rect').forEach((el) => {
    const length = el.getTotalLength();
    for (let i = 0; i <= 48; i++) points.push(el.getPointAtLength((length * i) / 48));
  });
  if (!points.length || !vb.height) return 0.5;
  const maxX = Math.max(...points.map((p) => p.x));
  const side = points.filter((p) => p.x >= maxX - vb.width * 0.02);
  return side.reduce((sum, p) => sum + p.y, 0) / side.length / vb.height;
}

// One shared empty list, so switching notes off does not hand the effects
// below a new array on every render.
const NO_NOTES = [];

// A product screen with pen notes. variant: 'wide' (desktop screens) or 'phone'.
// trigger: 'load' (hero) or 'scroll'.
// When pen.showNotes is false, only the screen and its caption show.
// framed: the screen hangs in the homepage's canvas frame (see ScreenSlot).
export default function AnnotatedScreen({ screen, notes: allNotes, caption, status, variant = 'wide', trigger = 'scroll', eager = false, tools = true, framed = false }) {
  const notes = pen.showNotes ? allNotes : NO_NOTES;
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const penRef = useRef(null);
  const [tops, setTops] = useState([]);

  // On every resize: keep strokes readable, then place each note beside the
  // screen so its handwritten words sit level with its marks. The typed
  // sentence hangs below the words. Later notes move down if two overlap.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const place = () => {
      keepStrokesReadable(root);
      const imgBox = imgRef.current.getBoundingClientRect();
      const screenH = imgBox.height;
      // In a frame the image sits inside a mount, so notes start where the image starts.
      const offset = imgBox.top - root.querySelector('.annotated__row').getBoundingClientRect().top;
      const items = [...root.querySelectorAll('.note')];
      let floor = 0;
      const next = notes.map((note, i) => {
        const marks = root.querySelector(`[data-pen="marks"][data-note-index="${i}"] svg`);
        const at = note.wordsAt != null ? note.wordsAt / 100 : anchorY(marks);
        const h = items[i].getBoundingClientRect().height;
        const wordsH = items[i].querySelector('.note__words').getBoundingClientRect().height;
        const top = Math.max(floor, offset + at * screenH - wordsH / 2, 0);
        floor = top + h + 20;
        return top;
      });
      setTops(next);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(root);
    return () => ro.disconnect();
  }, [notes]);

  useLayoutEffect(() => {
    if (!notes.length) return undefined;
    penRef.current = drawNotes(rootRef.current, { trigger, image: imgRef.current });
    return () => penRef.current.cleanup();
  }, [trigger, notes.length]);

  const known = screen.width && screen.height ? screen.width / screen.height : null;
  const [ratio, setRatio] = useState(known);
  const screenInner = (
    <>
      <img
        ref={imgRef}
        src={screen.src}
        srcSet={screen.srcSet}
        sizes={screen.sizes}
        width={screen.width}
        height={screen.height}
        alt={screen.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : undefined}
        decoding="async"
        onLoad={(e) => { if (!known) setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight); }}
      />
      {notes.map((note, i) => (
        <div
          key={note.marks}
          className="annotated__marks"
          data-pen="marks"
          data-note-index={i}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: noteSvg(note.marks) }}
        />
      ))}
    </>
  );

  return (
    <figure className={`annotated annotated--${variant}${framed ? ' annotated--framed' : ''}`} ref={rootRef}>
      <div className="annotated__row">
        {framed ? (
          <div className="canvas">
            <div className="canvas__window" style={{ '--n': 1 }}>
              <div className="canvas__fit annotated__screen" style={{ '--ratio': ratio || 0.75 }}>
                {screenInner}
              </div>
            </div>
          </div>
        ) : (
          <div className="annotated__screen">{screenInner}</div>
        )}

        {notes.length > 0 && <ul className="annotated__notes" aria-label="Design notes">
          {notes.map((note, i) => (
            <li key={note.words} className="note" style={tops[i] != null ? { '--top': `${tops[i]}px` } : undefined}>
              <span
                className="note__words"
                data-pen="words"
                data-note-index={i}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: noteSvg(note.words) }}
              />
              <p className="note__sentence" data-sentence data-note-index={i}>
                {note.sentence}
              </p>
            </li>
          ))}
        </ul>}
      </div>

      {(caption || status) && (
        <figcaption className="annotated__caption">
          {caption} {status}
        </figcaption>
      )}

      {notes.length > 0 && <div className="annotated__tools">
        {tools && (
          <button type="button" className="redraw" onClick={() => penRef.current?.replay()}>
            Draw the notes again
          </button>
        )}
        <span className="todo">TODO (Ebun): placeholder notes. Replace with your handwriting.</span>
      </div>}
    </figure>
  );
}
