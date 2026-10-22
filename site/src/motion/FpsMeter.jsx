import { useEffect, useRef } from 'react';

// Frame-rate readout for checking smoothness. Shown only when the page is
// opened with ?fps (for example http://localhost:5173/?fps).
// "fps" is frames per second over the last half second. "slowest" is the
// longest frame in that time: under 17 ms is smooth on a 60 Hz screen.
export default function FpsMeter() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0, last = performance.now(), start = last, frames = 0, worst = 0;
    const tick = (now) => {
      const dt = now - last;
      last = now;
      frames += 1;
      worst = Math.max(worst, dt);
      if (now - start >= 500) {
        const fps = (frames * 1000) / (now - start);
        if (ref.current) ref.current.textContent = `${fps.toFixed(0)} fps, slowest ${worst.toFixed(1)} ms`;
        window.__labFps = { fps, worst };
        start = now; frames = 0; worst = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div ref={ref} className="fps small" aria-hidden="true">measuring</div>;
}
