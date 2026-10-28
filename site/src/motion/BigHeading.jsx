import { useLayoutEffect, useRef } from 'react';

// A very large heading set as fixed lines that never wrap. The font size is
// worked out so the longest line fits the width, capped so all the lines fit
// in maxScreenShare of the window height and never pass maxFontSize. It is
// worked out again when the window or the font changes.
//
// Each letter is its own span so effects can move or blur it. Screen readers
// get the plain sentence instead of the letters.
//
// copies: faded duplicates of each letter, used by the spread effect.
// onLayout(info): called after every fit with the heading element, its lines,
// letters and font size, so an effect can measure positions.
export default function BigHeading({ as: Tag = 'h1', id, lines, font, copies = 0, onLayout, className = '', maxScreenShare = 1, maxFontSize = Infinity }) {
  const ref = useRef(null);
  const layoutRef = useRef(onLayout);
  layoutRef.current = onLayout;

  useLayoutEffect(() => {
    const el = ref.current;
    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      el.style.fontSize = '100px';
      const lineEls = [...el.querySelectorAll('.big__line')];
      const widest = Math.max(...lineEls.map((l) => l.scrollWidth));
      const byWidth = ((100 * el.clientWidth) / widest) * 0.985;
      const byHeight = (100 * window.innerHeight * maxScreenShare) / el.scrollHeight;
      const size = Math.floor(Math.min(byWidth, byHeight, maxFontSize));
      el.style.fontSize = `${size}px`;
      layoutRef.current?.({
        heading: el,
        fontSize: size,
        lines: lineEls.map((line) => ({ line, letters: [...line.querySelectorAll('.l')] })),
      });
    };

    // Wait for the chosen font so the measurement uses the real letter widths.
    document.fonts.load(`${font.weight} 100px ${font.family}`).then(fit, fit);
    // Refit only when the width changes. Fitting changes the height, which
    // must not trigger another fit.
    let lastWidth = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return;
      lastWidth = el.clientWidth;
      fit();
    });
    ro.observe(el);
    // The height cap depends on the window, so a taller or shorter window refits too.
    let lastHeight = window.innerHeight;
    const onResize = () => {
      if (window.innerHeight === lastHeight) return;
      lastHeight = window.innerHeight;
      fit();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [font.family, font.weight, lines.join('|'), copies, maxScreenShare, maxFontSize]);

  return (
    <Tag
      id={id}
      ref={ref}
      className={`big ${className}`}
      style={{ fontFamily: font.family, fontWeight: font.weight }}
      // For the inline script that sizes the heading before the page's scripts load (src/lib/fitScript.js).
      data-fit-share={maxScreenShare}
      data-fit-max={Number.isFinite(maxFontSize) ? maxFontSize : undefined}
    >
      <span className="visually-hidden">{lines.join(' ')}</span>
      <span className="big__lines" aria-hidden="true">
        {lines.map((line) => (
          <span className="big__line" key={line}>
            {[...line].map((ch, i) => (
              <span className="l" key={i}>
                {Array.from({ length: copies }, (_, c) => (
                  <span className="l__copy" key={c}>{ch}</span>
                ))}
                <span className="l__glyph">{ch}</span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
