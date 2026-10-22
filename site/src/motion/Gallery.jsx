import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { approach, createTicker } from './ticker.js';
import ScreenSlot from '../components/ScreenSlot.jsx';
import motion from '../content/motion.js';
import { Text } from '../components/Todo.jsx';

// The gallery wall. Every screen hangs in the same frame, in one row, evenly
// spaced, with a small museum label underneath.
// 'walk'  with a mouse and motion allowed: the page holds while the wall
//         slides sideways, as if walking past the frames.
// 'swipe' on touch screens: a row to swipe.
// 'grid'  with reduced motion: a still grid.
function useMode() {
  const get = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'grid';
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return 'walk';
    return 'swipe';
  };
  const [mode, setMode] = useState(get);
  useEffect(() => {
    const qs = ['(prefers-reduced-motion: reduce)', '(hover: hover) and (pointer: fine)'].map((q) => window.matchMedia(q));
    const update = () => setMode(get());
    qs.forEach((q) => q.addEventListener('change', update));
    return () => qs.forEach((q) => q.removeEventListener('change', update));
  }, []);
  return mode;
}

// Optional rests: each frame can pause in the middle for part of its share
// of the scroll (gallery.dwell in motion.js; 0 = a steady walk).
const ease = (x) => x * x * (3 - 2 * x);
function withRests(raw, dwell) {
  if (!dwell) return raw;
  const i = Math.floor(raw);
  const f = raw - i;
  const a = dwell / 2;
  if (f <= a) return i;
  if (f >= 1 - a) return i + 1;
  return i + ease((f - a) / (1 - dwell));
}

// The small label under a frame: screen name, project and year. Links to the case study.
function WallLabel({ item, onFocus }) {
  const body = (
    <>
      <span className="wall-label__what"><Text value={item.what} /></span>
      <span className="wall-label__meta">{item.project}, {item.year}</span>
    </>
  );
  return (
    <p className="facts wall-label">
      {item.href ? <a href={item.href} onFocus={onFocus}>{body}</a> : <>{body} <Text value={item.caseStudy} /></>}
    </p>
  );
}

export default function Gallery({ id, title, items, settings: s }) {
  const mode = useMode();
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const posRef = useRef({ shown: 0, target: 0 });
  const [current, setCurrent] = useState(0);
  const n = items.length;

  // Where the page must be scrolled to so frame i sits in the middle.
  const scrollFor = (i) => {
    const sec = sectionRef.current;
    const top = sec.getBoundingClientRect().top + window.scrollY;
    return top + ((sec.offsetHeight - window.innerHeight) * i) / (n - 1);
  };
  const goTo = (i, smooth = true) => {
    const k = Math.max(0, Math.min(n - 1, i));
    window.scrollTo({ top: scrollFor(k), behavior: smooth ? 'smooth' : 'auto' });
  };

  useLayoutEffect(() => {
    if (mode !== 'walk') return undefined;
    const sec = sectionRef.current;
    const rail = railRef.current;
    const cards = [...rail.children];
    let centres = [];
    let stageWidth = 0;

    const measure = () => {
      stageWidth = sec.clientWidth;
      centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
    };
    const centreAt = (f) => {
      const i = Math.max(0, Math.min(n - 1, Math.floor(f)));
      const j = Math.min(n - 1, i + 1);
      return centres[i] + (centres[j] - centres[i]) * (f - i);
    };
    const targetFromScroll = () => {
      const travel = sec.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, (window.scrollY - (sec.getBoundingClientRect().top + window.scrollY)) / travel));
      return withRests(p * (n - 1), s.dwell);
    };
    const paint = () => {
      const f = posRef.current.shown;
      rail.style.transform = `translate3d(${(stageWidth / 2 - centreAt(f)).toFixed(1)}px, 0, 0)`;
      const now = Math.round(f);
      setCurrent((c) => (c === now ? c : now));
    };

    const ticker = createTicker((dt) => {
      const pos = posRef.current;
      pos.target = targetFromScroll();
      pos.shown = approach(pos.shown, pos.target, s.smooth, dt);
      if (Math.abs(pos.shown - pos.target) < 0.0005) pos.shown = pos.target;
      paint();
      return pos.shown !== pos.target;
    });

    measure();
    posRef.current.shown = posRef.current.target = targetFromScroll();
    paint();
    const onScroll = () => ticker.wake();
    const onResize = () => { measure(); paint(); ticker.wake(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Left and right arrow keys move one frame while the wall fills the screen.
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      const r = sec.getBoundingClientRect();
      if (r.top > 1 || r.bottom < window.innerHeight - 1) return;
      const next = Math.round(posRef.current.target) + (e.key === 'ArrowRight' ? 1 : -1);
      if (next < 0 || next > n - 1) return;
      e.preventDefault();
      goTo(next);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      ticker.stop();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
      rail.style.transform = '';
    };
  }, [mode, n, s]);

  if (mode !== 'walk') {
    return (
      <section id={id} className={`gallery gallery--${mode}`} aria-labelledby={`${id}-title`}>
        <h2 className="facts gallery__title" id={`${id}-title`}>{title}</h2>
        <ul className="gallery__list">
          {items.map((item, i) => (
            <li key={i} className="gallery__item">
              <ScreenSlot screen={item} hung lens />
              <WallLabel item={item} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="gallery gallery--walk"
      style={{ height: `${(1 + s.scrollLength) * 100}vh` }}
      aria-labelledby={`${id}-title`}
    >
      <div className="gallery__stage" style={{ '--frame-height': `${s.height * 100}vh`, '--frame-gap': `${s.gap * 100}vw` }}>
        <h2 className="facts gallery__title" id={`${id}-title`}>{title}</h2>
        <div className="gallery__wall">
          <ul className="gallery__rail" ref={railRef}>
            {items.map((item, i) => (
              <li key={i} className="gallery__card" aria-current={i === current ? 'true' : undefined}>
                <ScreenSlot screen={item} hung lens />
                <WallLabel item={item} onFocus={() => goTo(i, false)} />
              </li>
            ))}
          </ul>
        </div>
        <div className="gallery__dots" role="group" aria-label="Choose a frame">
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              className="gallery__dot"
              aria-label={`Frame ${i + 1} of ${n}: ${item.project}${typeof item.what === 'string' ? `, ${item.what}` : ''}`}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
