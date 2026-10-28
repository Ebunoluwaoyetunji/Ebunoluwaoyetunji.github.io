import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { butterflyParts, loadButterfly } from '../content/butterfly/index.js';

// One butterfly in the hero. It flies in on load and lands on top of a
// letter. While resting its wings open and close slowly. When the mouse comes
// near, or the letter under it parts because of Spread, it lifts off, flies a
// short curved path and lands on a different letter. It never leaves the hero
// and never sits where it would hide much of another letter.
//
// mode: 'full'  (mouse, motion allowed)
//       'touch' (flies in once, lands, stays, slow wings; lifts off only if a
//                finger parts the letter under it)
//       'still' (reduced motion: sits on a letter, no flying, no wing movement)
// settings: motion.butterfly. option: which drawing (1, 2 or 3).

const easeInOut = (t) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
const bezier = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const offsetOf = (glyph) => {
  const m = /translateX\((-?[\d.]+)px\)/.exec(glyph.style.transform || '');
  return m ? parseFloat(m[1]) : 0;
};
// The point the butterfly stands on, inside its 100 x 100 drawing box.
const FOOT_X = 0.5;
const FOOT_Y = 0.82;

// It is not in the pre-rendered HTML: it appears once its drawing has loaded,
// after the page has started (it flies in, so nothing jumps).
export default function Butterfly(props) {
  const [parts, setParts] = useState(null);
  useEffect(() => {
    let live = true;
    loadButterfly(props.option).then(() => { if (live) setParts(butterflyParts(props.option)); });
    return () => { live = false; };
  }, [props.option]);
  return parts ? <ButterflyDrawing {...props} parts={parts} /> : null;
}

function ButterflyDrawing({ headingId, font, settings: s, mode, parts }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const hero = el.parentElement;
    let cancelled = false;
    let raf = 0;
    let fontSize = 0;
    let size = 0;
    let spots = []; // valid resting spots: { el, glyph }
    let current = -1; // index into spots
    let state = 'waiting'; // waiting | flying | resting
    let pos = [0, 0]; // where the feet are, in hero coordinates
    let tilt = 0;
    let flight = null;
    let landedAt = 0;
    let landedOffset = 0;
    let mouse = null;

    const canvas = document.createElement('canvas').getContext('2d');

    // Where the very top of a letter's ink is, across its width (0 to 1).
    // For a "d" that is the tall stem on the right, not the middle of the
    // letter. Worked out once per letter and size by drawing it off screen.
    const topCentre = new Map();
    const inkTopAt = (char) => {
      const key = `${char}@${fontSize}`;
      if (topCentre.has(key)) return topCentre.get(key);
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.font = `${font.weight} ${fontSize}px ${font.family}`;
      const m = ctx.measureText(char);
      c.width = Math.ceil(m.width) + 4;
      c.height = Math.ceil(m.actualBoundingBoxAscent + 4);
      ctx.font = `${font.weight} ${fontSize}px ${font.family}`;
      ctx.fillText(char, 2, m.actualBoundingBoxAscent + 2);
      // Look at a thin band at the top of the ink.
      const band = Math.max(2, Math.round(fontSize * 0.06));
      const { data } = ctx.getImageData(0, 0, c.width, band + 2);
      let min = Infinity, max = -Infinity;
      for (let y = 0; y < band + 2; y++) {
        for (let x = 0; x < c.width; x++) {
          if (data[(y * c.width + x) * 4 + 3] > 60) { min = Math.min(min, x); max = Math.max(max, x); }
        }
      }
      const at = min <= max ? ((min + max) / 2 - 2) / Math.max(1, m.width) : 0.5;
      topCentre.set(key, at);
      return at;
    };

    // Where the feet go on a letter: on the top of its ink.
    const perch = (spot) => {
      const h = hero.getBoundingClientRect();
      const g = spot.glyph.getBoundingClientRect();
      const box = spot.el.getBoundingClientRect();
      canvas.font = `${font.weight} ${fontSize}px ${font.family}`;
      const m = canvas.measureText(spot.char);
      const baseline = box.top + (box.height - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
      return [g.left + g.width * inkTopAt(spot.char) - h.left, baseline - m.actualBoundingBoxAscent - h.top - s.gap * size];
    };

    // Find the resting spots from settings, and drop any where the butterfly
    // would cover too much of another letter or stick out of the hero.
    const findSpots = () => {
      const heading = document.getElementById(headingId);
      fontSize = parseFloat(heading.style.fontSize) || 0;
      size = s.size * fontSize;
      el.style.width = el.style.height = `${size}px`;
      const lines = [...heading.querySelectorAll('.big__line')];
      const letters = lines.map((line) => [...line.querySelectorAll('.l')]);
      canvas.font = `${font.weight} ${fontSize}px ${font.family}`;
      const h = hero.getBoundingClientRect();
      const inkBoxes = letters.flat().map((l) => {
        const ch = l.textContent.slice(-1);
        const r = l.getBoundingClientRect();
        const m = canvas.measureText(ch);
        const baseline = r.top + (r.height - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
        return { el: l, left: r.left - h.left, right: r.right - h.left, top: baseline - m.actualBoundingBoxAscent - h.top, bottom: baseline + m.actualBoundingBoxDescent - h.top };
      });
      const found = [];
      s.spots.forEach(({ word, letter }) => {
        lines.forEach((line, li) => {
          const text = letters[li].map((l) => l.textContent.slice(-1)).join('');
          const w = text.split(' ').indexOf(word);
          if (w < 0) return;
          const start = text.split(' ').slice(0, w).join(' ').length + (w ? 1 : 0);
          const at = start + word.indexOf(letter);
          const spotEl = letters[li][at];
          if (!spotEl) return;
          const spot = { el: spotEl, glyph: spotEl.querySelector('.l__glyph'), char: letter };
          const [x, y] = perch(spot);
          const box = { left: x - size * 0.48, right: x + size * 0.48, top: y - size * FOOT_Y, bottom: y };
          const inside = box.top >= 0 && box.left >= 0 && box.right <= h.width;
          const covers = inkBoxes.some((b) => {
            if (b.el === spotEl) return false;
            const ow = Math.min(box.right, b.right) - Math.max(box.left, b.left);
            const oh = Math.min(box.bottom, b.bottom) - Math.max(box.top, b.top);
            if (ow <= 0 || oh <= 0) return false;
            return (ow * oh) / ((b.right - b.left) * (b.bottom - b.top)) > s.maxCover;
          });
          if (inside && !covers) found.push(spot);
        });
      });
      spots = found;
      el.dataset.spots = String(spots.length);
    };

    const place = () => {
      el.style.transform = `translate3d(${(pos[0] - size * FOOT_X).toFixed(1)}px, ${(pos[1] - size * FOOT_Y).toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    };
    const setWings = (kind) => { el.dataset.wings = kind; };

    const land = () => {
      state = 'resting';
      el.dataset.state = 'resting';
      el.dataset.spot = `${spots[current].char} in "${spots[current].el.closest('.big__line').textContent.replace(/(.)\1{3}/g, '$1')}"`;
      flight = null;
      tilt = 0;
      pos = perch(spots[current]);
      place();
      setWings(mode === 'still' ? 'still' : 'rest');
      landedAt = performance.now();
      landedOffset = offsetOf(spots[current].glyph);
    };

    const flyTo = (next) => {
      const from = [...pos];
      const to = perch(spots[next]);
      const dx = to[0] - from[0];
      const lift = s.lift * size + Math.abs(dx) * 0.12;
      const h = hero.getBoundingClientRect();
      const clampY = (y) => Math.max(size, Math.min(h.height - size * 0.2, y));
      const c1 = [from[0] + dx * 0.3, clampY(Math.min(from[1], to[1]) - lift)];
      const c2 = [to[0] - dx * 0.25, clampY(to[1] - lift * 0.8)];
      const length = Math.hypot(c1[0] - from[0], c1[1] - from[1]) + Math.hypot(c2[0] - c1[0], c2[1] - c1[1]) + Math.hypot(to[0] - c2[0], to[1] - c2[1]);
      flight = { from, c1, c2, next, start: performance.now(), duration: Math.min(s.maxFlight, Math.max(s.minFlight, length / s.speed)) * 1000 };
      current = next;
      state = 'flying';
      el.dataset.state = 'flying';
      setWings('fly');
      wake();
    };

    // Choose where to go next: a different letter, away from the mouse, not
    // on a line that is currently parting, as near as possible.
    const chooseNext = () => {
      const options = spots.map((spot, i) => ({ i, p: perch(spot), moving: Math.abs(offsetOf(spot.glyph)) > 0.5 })).filter((o) => o.i !== current && !o.moving);
      if (!options.length) return -1;
      const far = (o) => !mouse || Math.hypot(o.p[0] - mouse[0], o.p[1] - mouse[1]) > s.near * size * 1.6;
      const pool = options.filter(far).length ? options.filter(far) : options;
      pool.sort((a, b) => Math.hypot(a.p[0] - pos[0], a.p[1] - pos[1]) - Math.hypot(b.p[0] - pos[0], b.p[1] - pos[1]));
      // One of the nearest few, so it does not always hop between the same two letters.
      return pool[Math.floor(Math.random() * Math.min(3, pool.length))].i;
    };

    const frame = (now) => {
      raf = 0;
      if (state === 'flying' && flight) {
        // Follow the target letter if it moves while the butterfly is in the air.
        const to = perch(spots[flight.next]);
        const t = easeInOut((now - flight.start) / flight.duration);
        const p = bezier(flight.from, flight.c1, flight.c2, to, t);
        const vx = p[0] - pos[0];
        tilt += (Math.max(-14, Math.min(14, vx * 1.2)) - tilt) * 0.12;
        pos = p;
        place();
        if (now - flight.start >= flight.duration) land();
        else raf = requestAnimationFrame(frame);
        return;
      }
      const watching = mode === 'full' ? !!mouse : mode === 'touch' && now < fingerUntil;
      if (state === 'resting' && watching) {
        // Lift off if the letter underneath parts because of Spread.
        if (Math.abs(offsetOf(spots[current].glyph) - landedOffset) > s.partLift * fontSize) {
          const next = chooseNext();
          if (next >= 0) { flyTo(next); return; }
        }
        raf = requestAnimationFrame(frame);
      }
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e) => {
      const h = hero.getBoundingClientRect();
      const inside = e.clientX >= h.left && e.clientX <= h.right && e.clientY >= h.top && e.clientY <= h.bottom;
      mouse = inside ? [e.clientX - h.left, e.clientY - h.top] : null;
      if (state !== 'resting' || !mouse) return;
      const centre = [pos[0], pos[1] - size * 0.45];
      if (performance.now() - landedAt > s.cooldown * 1000 && Math.hypot(mouse[0] - centre[0], mouse[1] - centre[1]) < s.near * size) {
        const next = chooseNext();
        if (next >= 0) { flyTo(next); return; }
      }
      wake();
    };

    // Touch screens: while a finger is on the hero (and for a moment after,
    // while the letters settle), watch whether the letter underneath parts.
    let fingerUntil = 0;
    const onFinger = (e) => {
      if (e.pointerType === 'mouse') return;
      const h = hero.getBoundingClientRect();
      mouse = [e.clientX - h.left, e.clientY - h.top];
      fingerUntil = performance.now() + 1500;
      wake();
    };

    const start = () => {
      if (cancelled) return;
      findSpots();
      if (!spots.length || !size) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = 'visible';
      current = 0;
      if (mode === 'still') { land(); return; }
      // Fly in from the top right of the hero along a soft curve.
      const h = hero.getBoundingClientRect();
      pos = [h.width - size * 1.4, size * 1.3];
      tilt = 0;
      place();
      setWings('fly');
      setTimeout(() => { if (!cancelled) { current = -1; flyTo(0); } }, s.flyInDelay * 1000);
    };

    // Wait for the heading to have its size and its font.
    const ready = () => {
      const heading = document.getElementById(headingId);
      if (cancelled) return;
      if (!heading || !heading.style.fontSize) { requestAnimationFrame(ready); return; }
      document.fonts.ready.then(() => requestAnimationFrame(start));
    };
    el.style.visibility = 'hidden';
    ready();

    // When the heading changes size, find the spots again and stay on the same letter.
    const heading = document.getElementById(headingId);
    const ro = new ResizeObserver(() => {
      if (state === 'waiting' || !heading?.style.fontSize) return;
      const wasOn = spots[current]?.el;
      findSpots();
      const again = spots.findIndex((sp) => sp.el === wasOn);
      current = again >= 0 ? again : 0;
      if (state === 'resting' && spots.length) land();
    });
    if (heading) ro.observe(heading);
    if (mode === 'full') window.addEventListener('pointermove', onMove, { passive: true });
    if (mode === 'touch') {
      hero.addEventListener('pointerdown', onFinger, { passive: true });
      hero.addEventListener('pointermove', onFinger, { passive: true });
      hero.addEventListener('pointerup', onFinger, { passive: true });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerdown', onFinger);
      hero.removeEventListener('pointermove', onFinger);
      hero.removeEventListener('pointerup', onFinger);
    };
  }, [headingId, font, s, mode]);

  return (
    <div ref={ref} className="butterfly" aria-hidden="true" data-wings="still" style={{ '--rest-flap': `${s.restFlap}s`, '--fly-flap': `${s.flyFlap}s` }}>
      <div className="butterfly__part butterfly__wing butterfly__wing--left" dangerouslySetInnerHTML={{ __html: parts.left }} />
      <div className="butterfly__part butterfly__wing butterfly__wing--right" dangerouslySetInnerHTML={{ __html: parts.right }} />
      <div className="butterfly__part butterfly__body" dangerouslySetInnerHTML={{ __html: parts.body }} />
    </div>
  );
}
