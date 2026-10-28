import { useLayoutEffect, useRef } from 'react';
import { Text } from '../components/Todo.jsx';
import { curveSampler, seeded, smooth } from '../lib/penLine.js';

// The Journey: one continuous vermilion path down the page, drawn like a pen
// stroke with gentle curves. The stops sit beside it, alternating sides on a
// laptop and all on one side on a phone.
//
// As the page scrolls, the line draws down to a fixed point in the window
// (settings.penAt). It is tied straight to the scroll, so it never runs ahead
// and stops when the scrolling stops. A stop turns from light grey to black
// when the line reaches its dot. With reduced motion the line is fully drawn
// and every stop is black from the start.

export default function Journey({ stops, settings: s, still }) {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const items = [...root.querySelectorAll('.stop')];
    const dots = [...svg.querySelectorAll('.journey__dot')];
    let line = null; // the path's sampler (src/lib/penLine.js): how far to draw for a height
    let built = { w: 0, h: 0 };
    let total = 0;
    let stopYs = [];
    let raf = 0;

    // Build the path through the stops' dots, with a little hand wobble between them.
    const build = () => {
      const w = root.clientWidth;
      const h = root.scrollHeight;
      built = { w, h };
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.style.height = `${h}px`;
      const oneSide = w < s.oneSideBelow;
      const x0 = oneSide ? s.phoneLineX : w / 2;
      const amp = oneSide ? s.wobble * 0.35 : s.wobble;
      const rand = seeded(97);
      const rootTop = root.getBoundingClientRect().top;
      stopYs = items.map((el) => {
        const date = el.querySelector('.stop__date');
        const r = date.getBoundingClientRect();
        return r.top - rootTop + r.height / 2;
      });
      const pts = [[x0, 0]];
      stopYs.forEach((y, i) => {
        const prev = pts[pts.length - 1][1];
        // A gentle bend between stops, leaning toward the side the next stop is on.
        const lean = oneSide ? 1 : (i % 2 ? 1 : -1);
        pts.push([x0 + lean * amp * (0.6 + 0.4 * rand()), prev + (y - prev) * 0.5]);
        pts.push([x0 + (rand() - 0.5) * amp * 0.25, y]);
      });
      pts.push([x0 + (rand() - 0.5) * amp, h]);
      path.setAttribute('d', smooth(pts));
      line = curveSampler(pts, path.getTotalLength());
      total = line.total;
      path.style.strokeDasharray = `${total} ${total}`;
      // Put each dot exactly on the line, level with its stop's date.
      stopYs.forEach((y, i) => {
        const p = line.pointAt(line.lengthAt(y));
        dots[i].setAttribute('cx', p.x.toFixed(1));
        dots[i].setAttribute('cy', p.y.toFixed(1));
      });
    };

    const draw = () => {
      raf = 0;
      if (!line) return;
      const y = still ? Infinity : window.innerHeight * s.penAt - root.getBoundingClientRect().top;
      const drawn = still ? total : line.lengthAt(y);
      path.style.strokeDashoffset = (total - drawn).toFixed(1);
      items.forEach((el, i) => {
        const reached = still || stopYs[i] <= y;
        el.classList.toggle('is-reached', reached);
        dots[i].classList.toggle('is-reached', reached);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(draw); };

    build();
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Rebuild only when the size really changed (it also reports once when it
    // starts watching, right after the build above).
    const ro = new ResizeObserver(() => {
      if (root.clientWidth === built.w && root.scrollHeight === built.h) return;
      build(); draw();
    });
    ro.observe(root);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [stops, s, still]);

  return (
    <div className={`journey${still ? ' journey--still' : ''}`} ref={rootRef}>
      <svg className="journey__line" ref={svgRef} aria-hidden="true">
        <path ref={pathRef} className="journey__path" />
        {stops.map((_, i) => <circle key={i} className="journey__dot" r="5" />)}
      </svg>
      <ol className="journey__stops">
        {stops.map((stop, i) => (
          <li key={i} className={`stop stop--${i % 2 ? 'right' : 'left'}`}>
            <span className="facts stop__date"><Text value={stop.date} /></span>
            {stop.role && <span className="stop__role"><Text value={stop.role} /></span>}
            {stop.line && <span className="stop__line"><Text value={stop.line} /></span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
