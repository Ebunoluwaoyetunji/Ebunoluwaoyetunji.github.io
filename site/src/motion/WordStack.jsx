import { useLayoutEffect, useRef, useState } from 'react';
import SpreadWord from './SpreadWord.jsx';
import { whenIdle } from '../lib/whenLoaded.js';

// Big words stacked and centred, one per row, with faint rules between them.
// All words share one font size: as big as the window height allows
// (maxScreenShare each, never over maxFontSize), and small enough that the
// longest word still fits the width when fully open.
export default function WordStack({ words, settings: s, active, font }) {
  const ref = useRef(null);
  const [size, setSize] = useState(null);

  useLayoutEffect(() => {
    const el = ref.current;
    let cancelled = false;
    const fit = () => {
      if (cancelled) return;
      const probe = document.createElement('span');
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-family:${font};font-size:100px;line-height:1`;
      document.body.appendChild(probe);
      const widest = Math.max(...words.map((w) => {
        probe.textContent = w.label;
        // Room for the open state: each letter moves out by up to gap * size.
        return probe.getBoundingClientRect().width + (w.label.length - 1) * s.gap * 100;
      }));
      probe.remove();
      const byWidth = (100 * el.clientWidth * 0.92) / widest;
      const byHeight = window.innerHeight * s.maxScreenShare;
      setSize(Math.floor(Math.min(byWidth, byHeight, s.maxFontSize)));
    };
    // Sized in a quiet moment once the font is ready (the footer is far below
    // the first screen; the menu is opened by hand), so the page's start stays short.
    let cancelIdle = () => {};
    const later = () => { if (!cancelled) cancelIdle = whenIdle(fit, 300); };
    document.fonts.load(`400 100px ${font}`).then(later, later);
    // Fit again only when the width really changed (it also reports once when it starts watching).
    let lastWidth = el.clientWidth;
    const ro = new ResizeObserver(() => { if (el.clientWidth === lastWidth) return; lastWidth = el.clientWidth; fit(); });
    ro.observe(el);
    window.addEventListener('resize', fit);
    return () => { cancelled = true; cancelIdle(); ro.disconnect(); window.removeEventListener('resize', fit); };
  }, [words, s, font]);

  return (
    <ul className="wordstack" ref={ref}>
      {words.map((w) => (
        <li key={w.label} className="wordstack__row">
          <SpreadWord word={w.label} href={w.href} fontSize={size} settings={s} active={active} />
        </li>
      ))}
    </ul>
  );
}
