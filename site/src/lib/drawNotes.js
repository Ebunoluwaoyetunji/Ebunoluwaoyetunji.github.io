// The signature motion: notes drawing themselves in pen.
// Each stroke in an SVG is revealed along its length with a dash offset.
// Notes draw one after another: marks first, then the handwritten words.
// When the pen finishes a note, its typed sentence fades in while the pen
// moves on to the next note.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import pen from '../content/pen.js';

gsap.registerPlugin(ScrollTrigger);

const STROKES = 'path, line, polyline, polygon, circle, ellipse, rect';

// Everything that starts hidden and appears as the pen moves.
const HIDDEN = `[data-pen] :is(${STROKES}), [data-sentence]`;

const clamp = (n) => Math.min(pen.longestStroke, Math.max(pen.shortestStroke, n));

// Length of a stroke in screen pixels, so speed is the same at any size.
function screenLength(el, length) {
  const svg = el.ownerSVGElement;
  const vb = svg.viewBox.baseVal;
  const scale = vb && vb.width ? svg.getBoundingClientRect().width / vb.width : 1;
  return length * scale;
}

function addStrokes(tl, svg, speed, pause, ease) {
  const strokes = svg ? [...svg.querySelectorAll(STROKES)] : [];
  strokes.forEach((el, i) => {
    const length = el.getTotalLength();
    const duration = clamp(screenLength(el, length) / speed);
    tl.set(el, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length, opacity: 1 });
    tl.to(el, { strokeDashoffset: 0, duration, ease });
    if (i < strokes.length - 1) tl.to({}, { duration: pause });
  });
  return strokes;
}

// A screen shown small (on a phone) shrinks its notes with it. Thicken any
// stroke that would draw thinner than pen.minStrokeWidth pixels. The width
// from the SVG file is kept and used again when the screen grows.
export function keepStrokesReadable(root) {
  root.querySelectorAll('[data-pen] svg').forEach((svg) => {
    const vb = svg.viewBox.baseVal;
    const shown = svg.getBoundingClientRect().width;
    if (!vb || !vb.width || !shown) return;
    const min = pen.minStrokeWidth / (shown / vb.width);
    svg.querySelectorAll(STROKES).forEach((el) => {
      if (el.dataset.fileStrokeWidth == null) {
        el.dataset.fileStrokeWidth = parseFloat(getComputedStyle(el).strokeWidth) || 1;
      }
      el.style.strokeWidth = Number(el.dataset.fileStrokeWidth) < min ? String(min) : '';
    });
  });
}

function hideAll(root) {
  root.querySelectorAll(HIDDEN).forEach((el) => {
    el.style.opacity = '0';
  });
}

function buildTimeline(root) {
  const tl = gsap.timeline({ paused: true });
  const notes = [...root.querySelectorAll('[data-note-index]')]
    .map((el) => Number(el.dataset.noteIndex))
    .filter((v, i, all) => all.indexOf(v) === i);

  notes.forEach((n, i) => {
    const marks = root.querySelector(`[data-pen="marks"][data-note-index="${n}"] svg`);
    const words = root.querySelector(`[data-pen="words"][data-note-index="${n}"] svg`);
    const sentence = root.querySelector(`[data-sentence][data-note-index="${n}"]`);
    addStrokes(tl, marks, pen.markSpeed, pen.pauseBetweenMarks, 'power1.inOut');
    tl.to({}, { duration: pen.pauseBeforeWords });
    addStrokes(tl, words, pen.wordSpeed, pen.pauseBetweenLetters, 'sine.inOut');
    if (sentence) tl.to(sentence, { opacity: 1, duration: pen.sentenceFade, ease: 'power1.out' });
    // The pen waits before the next note while the sentence is fading in.
    if (i < notes.length - 1) tl.to({}, { duration: pen.pauseBetweenNotes }, sentence ? '<' : '>');
  });

  // Clean up so the finished notes are plain strokes again.
  tl.set(root.querySelectorAll(HIDDEN), { clearProps: 'strokeDasharray,strokeDashoffset,opacity' });
  return tl;
}

// trigger: 'load' draws as soon as the screen image is ready.
//          'scroll' draws once, when the block scrolls into view.
// Returns { replay, cleanup }.
export function drawNotes(root, { trigger, image }) {
  const mm = gsap.matchMedia();
  let tl = null;

  // Only with a mouse and without reduced motion. On touch screens and with
  // reduced motion nothing is hidden, so every note shows already drawn.
  mm.add('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)', () => {
    hideAll(root);
    let cancelled = false;
    let st = null;

    const start = () => {
      if (cancelled) return;
      tl = buildTimeline(root);
      if (trigger === 'load') {
        tl.delay(pen.heroDelay).play();
      } else {
        st = ScrollTrigger.create({
          trigger: root,
          start: pen.scrollStart,
          once: true,
          onEnter: () => tl.play(),
        });
        // Page opened already scrolled past this block: show it finished.
        if (st.progress === 1) tl.progress(1);
      }
    };

    const ready = image && !image.complete ? image.decode().catch(() => {}) : Promise.resolve();
    ready.then(start);

    return () => {
      cancelled = true;
      st?.kill();
      tl?.kill();
      tl = null;
      root.querySelectorAll(HIDDEN).forEach((el) => {
        el.style.removeProperty('opacity');
        el.style.removeProperty('stroke-dasharray');
        el.style.removeProperty('stroke-dashoffset');
      });
    };
  });

  return {
    replay: () => {
      if (!tl) return;
      tl.kill();
      tl = buildTimeline(root);
      hideAll(root);
      tl.play();
    },
    cleanup: () => mm.revert(),
  };
}
