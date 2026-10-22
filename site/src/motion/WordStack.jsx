import { useLayoutEffect, useRef, useState } from 'react';
import SpreadWord from './SpreadWord.jsx';

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
    document.fonts.load(`400 100px ${font}`).then(fit, fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('resize', fit);
    return () => { cancelled = true; ro.disconnect(); window.removeEventListener('resize', fit); };
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
