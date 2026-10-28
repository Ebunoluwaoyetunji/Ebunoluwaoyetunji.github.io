import { useEffect, useRef, useState } from 'react';
import { whenIdle } from '../lib/whenLoaded.js';
import BigHeading from './BigHeading.jsx';
import { approach, createTicker, falloff } from './ticker.js';

// Spread heading (settings come in as a
// prop from src/content/motion.js). Letters near the cursor on the line under the mouse move
// apart, leaving soft faded copies behind. They settle back when the mouse
// leaves the line. Letters only move with transforms, so the line never wraps
// or shifts.
//
// On touch screens a finger does the same: sliding sideways along a line parts
// the letters around it, and a tap parts them for a moment (touchHold).
// Up and down swipes still scroll the page (touch-action: pan-y).
export default function SpreadHeading({ lines, font, active, as, id, settings: s, className = '' }) {
  // The faded copies are not in the pre-rendered page (they are hidden until
  // the letters move): they are added once the page has started and is idle.
  const [withCopies, setWithCopies] = useState(false);
  useEffect(() => (active ? whenIdle(() => setWithCopies(true)) : undefined), [active]);
  const state = useRef(null); // measured letters and their positions
  const pointer = useRef({ line: -1, x: 0 });
  const ticker = useRef(null);
  const wrap = useRef(null);

  const onLayout = ({ heading, fontSize, lines: lineEls }) => {
    const old = state.current;
    heading.style.setProperty('--copy-blur', `${s.copyBlur}em`);
    state.current = {
      heading,
      fontSize,
      lines: lineEls.map(({ line, letters }) => ({
        line,
        letters: letters.map((el) => ({
          glyph: el.querySelector('.l__glyph'),
          copies: [...el.querySelectorAll('.l__copy')],
          centre: el.offsetLeft + el.offsetWidth / 2,
          x: 0,
          trail: s.copyLag.map(() => 0),
        })),
      })),
    };
    if (old) reset();
    warmUp();
  };

  // Draw the copies once, almost invisibly, right after load, so the browser
  // prepares them while the page is still. Without this, the first sweep
  // across the heading stalls for a moment.
  const warmUp = () => {
    const copies = state.current.lines.flatMap(({ letters }) => letters.flatMap((l) => l.copies));
    if (!copies.length) return;
    copies.forEach((c) => { c.style.opacity = '0.01'; });
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => {
      if (pointer.current.line < 0) copies.forEach((c) => { c.style.opacity = '0'; });
    }, 150)));
  };

  const reset = () => {
    state.current?.lines.forEach(({ letters }) => letters.forEach((l) => {
      l.x = 0;
      l.trail = l.trail.map(() => 0);
      l.glyph.style.transform = '';
      l.copies.forEach((c) => { c.style.transform = ''; c.style.opacity = '0'; });
    }));
  };

  useEffect(() => {
    if (!active) return undefined;

    const step = (dt) => {
      const st = state.current;
      if (!st) return false;
      const { line: activeLine, x: mouseX } = pointer.current;
      const reach = s.distance * st.fontSize;
      const radius = s.radius * st.fontSize;
      const fade = st.fontSize * 0.05;
      let moving = activeLine >= 0;

      st.lines.forEach(({ letters }, li) => {
        const isActive = li === activeLine;
        letters.forEach((l) => {
          let target = 0;
          if (isActive) {
            const dx = l.centre - mouseX;
            // Rises quickly beside the cursor, then fades slowly over the radius,
            // so outer letters are only nudged and do not pile into neighbours.
            const rise = 1 - Math.exp(-Math.abs(dx) / (radius * s.rise));
            target = Math.sign(dx) * rise * falloff(dx, radius) * reach;
          }
          l.x = approach(l.x, target, isActive ? s.follow : s.settle, dt);
          l.glyph.style.transform = `translateX(${l.x.toFixed(2)}px)`;
          l.trail = l.trail.map((t, i) => {
            const next = approach(t, l.x, s.copyLag[i], dt);
            const gap = Math.abs(next - l.x);
            const copy = l.copies[i];
            if (copy) {
              copy.style.transform = `translateX(${next.toFixed(2)}px)`;
              copy.style.opacity = (s.copyOpacity * (1 - i * 0.25) * Math.min(1, gap / fade)).toFixed(3);
            }
            if (gap > 0.05) moving = true;
            return next;
          });
          if (Math.abs(l.x - target) > 0.05) moving = true;
        });
      });
      return moving;
    };

    ticker.current = createTicker(step);
    const area = wrap.current;
    const onMove = (e) => {
      const st = state.current;
      if (!st) return;
      const index = st.lines.findIndex(({ line }) => {
        const r = line.getBoundingClientRect();
        return e.clientY >= r.top && e.clientY < r.bottom;
      });
      pointer.current.line = index;
      if (index >= 0) pointer.current.x = e.clientX - st.lines[index].line.getBoundingClientRect().left;
      ticker.current.wake();
    };
    const settle = () => {
      pointer.current.line = -1;
      ticker.current.wake();
    };
    // A finger: letters part from the moment it touches, and stay parted for
    // a moment after it lifts. If the page starts scrolling, they settle.
    let hold = 0;
    const isFinger = (e) => e.pointerType !== 'mouse';
    const onDown = (e) => { if (isFinger(e)) { clearTimeout(hold); onMove(e); } };
    const onUp = (e) => { if (isFinger(e)) { clearTimeout(hold); hold = setTimeout(settle, s.touchHold * 1000); } };
    const onCancel = (e) => { if (isFinger(e)) { clearTimeout(hold); settle(); } };
    const onLeave = (e) => { if (!isFinger(e)) settle(); };
    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerdown', onDown);
    area.addEventListener('pointerup', onUp);
    area.addEventListener('pointercancel', onCancel);
    area.addEventListener('pointerleave', onLeave);
    return () => {
      clearTimeout(hold);
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerdown', onDown);
      area.removeEventListener('pointerup', onUp);
      area.removeEventListener('pointercancel', onCancel);
      area.removeEventListener('pointerleave', onLeave);
      ticker.current.stop();
      pointer.current.line = -1;
      reset();
    };
  }, [active]);

  return (
    <div ref={wrap} className="spread-area">
    <BigHeading
      as={as}
      id={id}
      lines={lines}
      font={font}
      copies={active && withCopies ? s.copies : 0}
      onLayout={onLayout}
      maxScreenShare={s.maxScreenShare}
      maxFontSize={s.maxFontSize}
      className={`big--spread big--copies-${s.copyColour} ${className}`}
    />
    </div>
  );
}
