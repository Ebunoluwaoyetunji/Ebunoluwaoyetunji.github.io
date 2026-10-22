import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { signpost } from '../content/signposts/index.js';
import motion from '../content/motion.js';

// One of Ebun's handwritten signposts under a turning point, in the pen's
// vermilion. It draws itself stroke by stroke every time it comes into view
// (scrolling down or back up), like the footer notes draw once. Once it has
// fully left the screen it is reset, ready to draw again; while any part of
// it is still on screen it is never restarted. With reduced motion it shows
// already drawn. Screen readers read its words (text), never the drawing.
//
// signpost: { file, text } from the case study's `turns`. still: reduced motion.
// settings: motion.signposts.

export default function Signpost({ signpost: sp, still }) {
  const ref = useRef(null);
  const s = motion.signposts;
  const svg = useMemo(() => signpost(sp.file), [sp.file]);
  const [w, h] = useMemo(() => /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg).slice(1).map(Number), [svg]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (still) return undefined;
    const strokes = [...el.querySelectorAll('path')];
    // Ready: hidden, waiting to draw. Cleared: shown as plain strokes.
    const ready = () => strokes.forEach((p) => { p.style.opacity = '0'; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
    const clear = () => strokes.forEach((p) => { p.style.opacity = ''; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
    let tl = null;
    let armed = true; // true once fully off screen (and at the start): the next entry draws it
    ready();

    const draw = () => {
      // Measured now, at the size it is shown.
      const svgEl = el.querySelector('svg');
      const scale = svgEl.getBoundingClientRect().width / svgEl.viewBox.baseVal.width;
      tl = gsap.timeline();
      strokes.forEach((p, i) => {
        const length = p.getTotalLength();
        const duration = Math.min(s.longestStroke, Math.max(s.shortestStroke, (length * scale) / s.speed));
        tl.set(p, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length, opacity: 1 });
        tl.to(p, { strokeDashoffset: 0, duration, ease: 'sine.inOut' });
        if (i < strokes.length - 1) tl.to({}, { duration: s.pauseStroke });
      });
      tl.set(strokes, { clearProps: 'strokeDasharray,strokeDashoffset,opacity' });
    };

    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      if (!e.isIntersecting) {
        // Fully off screen: stop and reset, ready to draw again.
        if (!armed) { tl?.kill(); tl = null; ready(); armed = true; }
      } else if (armed && e.intersectionRatio >= s.startWhenVisible) {
        armed = false;
        draw();
      }
    }, { threshold: [0, s.startWhenVisible] });
    io.observe(el);
    return () => { io.disconnect(); tl?.kill(); clear(); };
  }, [still, s]);

  return (
    <p className="turn__signpost">
      <span className="visually-hidden">{sp.text}</span>
      <span
        ref={ref}
        className="signpost"
        aria-hidden="true"
        style={{ width: `${w * s.size}rem`, aspectRatio: `${w} / ${h}` }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </p>
  );
}
