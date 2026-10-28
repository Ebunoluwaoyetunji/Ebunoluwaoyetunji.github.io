import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { sampler, seeded, smooth } from '../lib/penLine.js';
import useMedia from '../motion/useMedia.js';

// The guide on case study pages: the only scroll motion there.
//
// Wide screens: in the left margin, a thin vermilion pen line (the Journey's
// style) with one dot and name per main section. It stays in view beside the
// article and never leaves it. As the page scrolls, the line draws down to
// where you are reading (settings.penAt): it is tied straight to the scroll,
// so it never runs ahead. Sections passed are black, sections ahead are grey
// (4.74:1), and the current one is marked: a vermilion dot and an underline.
//
// Narrow screens (phones, small tablets): a slim bar that sticks under the
// top of the screen, with a thin vermilion line for how far you are and the
// current section's name. Tapping it opens the list of sections.
//
// Clicking a name jumps straight to that section (no smooth scroll: no other
// motion). With reduced motion the line is fully drawn; the current section
// is still marked. Everything is measured again when the article changes
// size (window resized, proposed cuts shown or hidden).
//
// sections: [{ id, title, sub? }] (sub: a group inside a section, shown smaller and indented). settings: motion.guide.
// barExtra: shown in the narrow bar too (the Short read / Full read switch), so it stays in reach.
// barExtraAfter: a selector for the page's own copy of it. The bar's copy shows
// only while no part of the page's copy is on screen (outside the bar), so only
// one is ever visible. Hidden, it keeps its space (the bar never changes
// height), is invisible, and cannot be reached by keyboard or screen readers.
// The guide finds its article from where it sits (its parent), so it works on
// the very first render.

export default function Guide({ sections, still, settings: s, barExtra = null, barExtraAfter = null }) {
  const wideQuery = `(min-width: ${s.wideFrom}px)`;
  // The pre-rendered HTML has the narrow bar; on wide screens CSS hides it
  // until the scripts swap in the margin guide (styles.css, .guide--bar).
  const wide = useMedia(wideQuery);
  const [current, setCurrent] = useState(-1);
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const barRef = useRef(null);
  const toggleRef = useRef(null);
  const rootRef = useRef(null);
  const extraRef = useRef(null);
  const [extraShown, setExtraShown] = useState(!barExtraAfter);

  // Narrow bar: show its switch only once the page's own switch is out of view.
  useEffect(() => {
    if (wide || !barExtra || !barExtraAfter) return undefined;
    let raf = 0;
    const check = () => {
      raf = 0;
      const own = document.querySelector(barExtraAfter);
      const bar = rootRef.current;
      if (!own || !bar) return;
      const o = own.getBoundingClientRect();
      const b = bar.getBoundingClientRect();
      // The parts of the page's switch on screen, less what the bars cover
      // (the top bar, when it shows, and this bar).
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) || 0;
      const top = Math.max(o.top, header);
      const bottom = Math.min(o.bottom, window.innerHeight);
      const above = Math.max(0, Math.min(bottom, b.top) - top);
      const below = Math.max(0, bottom - Math.max(top, b.bottom));
      const seen = bottom > top && (above > 0 || below > 0);
      // Out of view because it has gone up past the top, not because it is still further down.
      setExtraShown(!seen && o.top < window.innerHeight);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [wide, barExtra, barExtraAfter]);

  // The bar's height, so links to a section land below it (html scroll-padding-top).
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    const el = rootRef.current;
    if (wide || !el) { root.setProperty('--section-bar-height', '0px'); return undefined; }
    const set = () => root.setProperty('--section-bar-height', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => { ro.disconnect(); root.setProperty('--section-bar-height', '0px'); };
  }, [wide]);

  // Hidden: out of the keyboard order and away from screen readers too.
  useEffect(() => {
    if (extraRef.current) extraRef.current.inert = !extraShown;
  }, [extraShown, wide]);

  // Switching between the bar and the margin guide closes the list.
  useEffect(() => { setOpen(false); }, [wide]);

  useLayoutEffect(() => {
    const article = rootRef.current?.closest('.case__article');
    if (!article) return undefined;
    let tops = []; // page y of each section's top
    let end = 0; // page y of the article's end
    let dotYs = []; // wide: y of each dot inside the guide
    let line = null; // wide: { total, lengthAt, endY }
    let raf = 0;

    const measure = () => {
      tops = sections.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      });
      const r = article.getBoundingClientRect();
      end = r.bottom + window.scrollY;
      if (!wide) return;
      // The pen line through the dots, with a little hand wobble between them.
      const list = listRef.current;
      const svg = svgRef.current;
      const path = pathRef.current;
      const listTop = list.getBoundingClientRect().top;
      dotYs = [...list.querySelectorAll('.guide__dot-at')].map((el) => {
        const b = el.getBoundingClientRect();
        return b.top - listTop + b.height / 2;
      });
      const h = list.offsetHeight;
      const endY = Math.min(h, dotYs[dotYs.length - 1] + s.tail);
      svg.setAttribute('viewBox', `0 0 24 ${h}`);
      svg.style.height = `${h}px`;
      const rand = seeded(53);
      const x = 8;
      const pts = [[x, dotYs[0]]];
      dotYs.forEach((y, i) => {
        if (i > 0) pts.push([x + (rand() - 0.5) * s.wobble * 2, (pts[pts.length - 1][1] + y) / 2]);
        if (i > 0) pts.push([x + (rand() - 0.5) * s.wobble * 0.4, y]);
      });
      pts.push([x + (rand() - 0.5) * s.wobble, endY]);
      path.setAttribute('d', smooth(pts));
      line = { ...sampler(path), endY };
      path.style.strokeDasharray = `${line.total} ${line.total}`;
      svg.querySelectorAll('.guide__dot').forEach((dot, i) => {
        const p = path.getPointAtLength(line.lengthAt(dotYs[i]));
        dot.setAttribute('cx', p.x.toFixed(1));
        dot.setAttribute('cy', p.y.toFixed(1));
      });
    };

    const draw = () => {
      raf = 0;
      const y = window.scrollY + window.innerHeight * s.penAt; // where you are reading
      let i = -1;
      tops.forEach((t, k) => { if (t <= y) i = k; });
      setCurrent(i);
      // How far into the current section, 0 to 1.
      const next = i >= 0 ? (tops[i + 1] ?? end) : tops[0];
      const frac = i < 0 ? 0 : Math.max(0, Math.min(1, (y - tops[i]) / Math.max(1, next - tops[i])));
      if (wide && line) {
        let drawnTo = 0;
        if (still) drawnTo = line.endY;
        else if (i >= 0) {
          const from = dotYs[i];
          const to = dotYs[i + 1] ?? line.endY;
          drawnTo = from + (to - from) * frac;
        }
        const drawn = still ? line.total : line.lengthAt(drawnTo);
        pathRef.current.style.strokeDashoffset = (line.total - drawn).toFixed(1);
      }
      if (!wide && barRef.current) {
        const all = still ? 1 : Math.max(0, Math.min(1, (y - tops[0]) / Math.max(1, end - tops[0])));
        barRef.current.style.transform = `scaleX(${all.toFixed(4)})`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const onResize = () => { measure(); draw(); };

    measure();
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(article);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [sections, still, s, wide]);

  // Narrow: close the list with Escape or a tap elsewhere.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    const onDown = (e) => { if (!e.target.closest('.guide')) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  const stateOf = (i) => (i === current ? 'current' : i < current ? 'passed' : 'ahead');
  const items = (
    <ol className="guide__list" ref={listRef}>
      {sections.map(({ id, title, sub }, i) => (
        <li key={id} className={`guide__item guide__item--${stateOf(i)}${sub ? ' guide__item--sub' : ''}`}>
          <span className="guide__dot-at" aria-hidden="true" />
          <a href={`#${id}`} aria-current={i === current ? 'true' : undefined} onClick={() => setOpen(false)}>{title}</a>
        </li>
      ))}
    </ol>
  );

  if (wide) {
    return (
      <nav ref={rootRef} className={`guide guide--wide${still ? ' guide--still' : ''}`} aria-label="Case study sections">
        <svg className="guide__line" ref={svgRef} aria-hidden="true">
          <path ref={pathRef} className="guide__path" />
          {sections.map(({ id, sub }, i) => <circle key={id} className={`guide__dot guide__dot--${stateOf(i)}${sub ? ' guide__dot--sub' : ''}`} r={sub ? 3 : 4} />)}
        </svg>
        {items}
      </nav>
    );
  }

  const now = sections[Math.max(0, current)];
  return (
    <nav ref={rootRef} className={`guide guide--bar${open ? ' is-open' : ''}`} aria-label="Case study sections">
      <button type="button" className="guide__toggle" ref={toggleRef} aria-expanded={open} aria-controls="guide-list" onClick={() => setOpen((o) => !o)}>
        <span className="facts guide__label">Section</span>
        <span className="guide__now">{now?.title}</span>
        <span className="facts guide__more">{open ? 'Close' : 'All sections'}</span>
      </button>
      <span className="guide__progress" aria-hidden="true"><span ref={barRef} className="guide__fill" /></span>
      {barExtra && <div ref={extraRef} className={`guide__extra${extraShown ? ' is-shown' : ''}`} aria-hidden={extraShown ? undefined : 'true'}>{barExtra}</div>}
      <div id="guide-list" className="guide__panel" hidden={!open}>{items}</div>
    </nav>
  );
}
