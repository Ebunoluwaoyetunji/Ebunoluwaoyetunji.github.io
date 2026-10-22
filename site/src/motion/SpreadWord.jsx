import { useEffect, useRef } from 'react';
import { createTicker } from './ticker.js';

// Spread, word version. When the mouse (or keyboard focus) is on the word,
// every letter spaces out evenly around the word's centre, with a soft glow
// behind. It eases open and eases closed. Letters only move with transforms,
// so the line never wraps or shifts.
//
// The word is a link. `fontSize` comes from the parent so a group of words
// can share one size. settings: motion.wordSpread. active: false on touch
// screens and with reduced motion.

const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

export default function SpreadWord({ word, href, fontSize, settings: s, active, className = '' }) {
  const linkRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const link = linkRef.current;
    const letters = [...link.querySelectorAll('.w__letter')];
    const glows = [...link.querySelectorAll('.w__glow')];
    const n = letters.length;
    let open = false;
    let t = 0; // 0 closed, 1 open (before easing)

    const paint = () => {
      const k = ease(t);
      const gapPx = s.gap * fontSize * k;
      letters.forEach((el, i) => {
        const x = (i - (n - 1) / 2) * gapPx;
        el.style.transform = x ? `translateX(${x.toFixed(2)}px)` : '';
      });
      glows.forEach((g) => { g.style.opacity = (s.glow * k).toFixed(3); });
    };

    const ticker = createTicker((dt) => {
      const rate = dt / 1000 / (open ? s.openTime : s.closeTime);
      t = open ? Math.min(1, t + rate) : Math.max(0, t - rate);
      paint();
      return open ? t < 1 : t > 0;
    });

    const show = () => { open = true; ticker.wake(); };
    const hide = () => { open = false; ticker.wake(); };
    link.addEventListener('pointerenter', show);
    link.addEventListener('pointerleave', hide);
    link.addEventListener('focus', show);
    link.addEventListener('blur', hide);
    return () => {
      link.removeEventListener('pointerenter', show);
      link.removeEventListener('pointerleave', hide);
      link.removeEventListener('focus', show);
      link.removeEventListener('blur', hide);
      ticker.stop();
      t = 0;
      paint();
    };
  }, [active, fontSize, s]);

  return (
    <a
      ref={linkRef}
      href={href}
      className={`w ${className}`}
      style={{ fontSize: fontSize ? `${fontSize}px` : undefined, '--glow-size': `${s.glowSize}em` }}
    >
      <span className="visually-hidden">{word}</span>
      <span className="w__letters" aria-hidden="true">
        {[...word].map((ch, i) => (
          <span className="w__letter" key={i}>
            {active && <span className="w__glow">{ch}</span>}
            {ch}
          </span>
        ))}
      </span>
    </a>
  );
}
