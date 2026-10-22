import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { footerNote } from '../content/footer-notes/index.js';

// Ebun's handwritten notes beside the four footer words. Decoration only:
// hidden from screen readers (the links already have names).
//
// Each note sits close to its word, to the left or right, at a slight angle,
// and never inside the space the word takes when it opens up with Spread.
// If the notes would crowd the words (small screens), they are all hidden.
// They draw themselves once, one after another, when the footer comes into
// view. On touch screens and with reduced motion they show already drawn.
//
// words: home.footer.words (each may have a `note`). spread: motion.wordSpread.
// settings: motion.footerNotes. animate: false for touch / reduced motion.

const STROKES = 'path, line, polyline, polygon, circle, ellipse';

function rotatedSize(w, h, deg) {
  const a = (deg * Math.PI) / 180;
  return { w: Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a)), h: Math.abs(w * Math.sin(a)) + Math.abs(h * Math.cos(a)) };
}
const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

export default function FooterNotes({ words, spread, settings: s, animate }) {
  const ref = useRef(null);
  const [layout, setLayout] = useState({ items: [], hidden: true });
  const drawn = useRef(false);

  // Place the notes beside their words.
  useLayoutEffect(() => {
    const layer = ref.current;
    const menu = layer.parentElement;
    const place = () => {
      const base = menu.getBoundingClientRect();
      const links = [...menu.querySelectorAll('.wordstack .w')];
      if (!links.length) return;
      const fontSize = parseFloat(links[0].style.fontSize) || 0;
      if (!fontSize) return;
      const unit = (fontSize / 100) * s.scale; // screen px per scan px
      const gap = s.clearance * fontSize;

      // The space each word takes when fully open (letters spread + glow).
      const open = links.map((a, i) => {
        const r = a.getBoundingClientRect();
        const n = words[i].label.length;
        const grow = ((n - 1) / 2) * spread.gap * fontSize + spread.glowSize * fontSize;
        return { left: r.left - base.left - grow, right: r.right - base.left + grow, top: r.top - base.top, bottom: r.bottom - base.top };
      });

      const items = [];
      let crowded = false;
      words.forEach((word, i) => {
        if (!word.note) return;
        const svg = footerNote(word.note.file);
        const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
        const w = Number(vb[1]) * unit, h = Number(vb[2]) * unit;
        const rot = rotatedSize(w, h, word.note.angle);
        const o = open[i];
        const cy = (o.top + o.bottom) / 2 + word.note.dy * fontSize;
        const side = word.note.side === 'left' ? -1 : 1;
        let cx = side < 0 ? o.left - gap - rot.w / 2 : o.right + gap + rot.w / 2;
        const boxAt = (x) => ({ left: x - rot.w / 2, right: x + rot.w / 2, top: cy - rot.h / 2, bottom: cy + rot.h / 2 });
        // Move outward until it clears every word (and the notes placed so far).
        for (let k = 0; k < 40; k++) {
          const b = boxAt(cx);
          const hit = [...open.map((ob) => ({ ...ob, left: ob.left - gap, right: ob.right + gap })), ...items.map((it) => it.box)].some((ob) => overlaps(b, ob));
          if (!hit) break;
          cx += side * gap * 0.5;
        }
        const box = boxAt(cx);
        if (box.left < 0 || box.right > base.width || box.top < 0 || box.bottom > base.height) crowded = true;
        if ([...open, ...items.map((it) => it.box)].some((ob) => overlaps(box, ob))) crowded = true;
        items.push({ key: word.label, svg, box, style: { left: `${cx - w / 2}px`, top: `${cy - h / 2}px`, width: `${w}px`, height: `${h}px`, transform: `rotate(${word.note.angle}deg)` } });
      });
      setLayout({ items, hidden: crowded });
    };
    place();
    // The word size is set after the first paint and the footer keeps its
    // height, so watch the words themselves as well as the footer.
    const ro = new ResizeObserver(place);
    ro.observe(menu);
    menu.querySelectorAll('.wordstack, .wordstack .w').forEach((el) => ro.observe(el));
    window.addEventListener('resize', place);
    return () => { ro.disconnect(); window.removeEventListener('resize', place); };
  }, [words, spread, s]);

  // Draw once when the footer comes into view.
  useLayoutEffect(() => {
    const layer = ref.current;
    const notes = [...layer.querySelectorAll('.footer-note')];
    if (!animate || layout.hidden || !notes.length || drawn.current) return undefined;
    const strokes = notes.map((n) => [...n.querySelectorAll(STROKES)]);
    strokes.flat().forEach((el) => { el.style.opacity = '0'; });

    const tl = gsap.timeline({ paused: true });
    strokes.forEach((list, ni) => {
      list.forEach((el, i) => {
        const length = el.getTotalLength();
        const svg = el.ownerSVGElement;
        const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        const duration = Math.min(s.longestStroke, Math.max(s.shortestStroke, (length * scale) / s.speed));
        tl.set(el, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length, opacity: 1 });
        tl.to(el, { strokeDashoffset: 0, duration, ease: 'sine.inOut' });
        if (i < list.length - 1) tl.to({}, { duration: s.pauseStroke });
      });
      if (ni < strokes.length - 1) tl.to({}, { duration: s.pauseNote });
    });
    tl.set(strokes.flat(), { clearProps: 'strokeDasharray,strokeDashoffset,opacity' });

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        drawn.current = true;
        tl.play();
        io.disconnect();
      }
    }, { threshold: s.startWhenVisible });
    io.observe(layer.closest('footer') || layer);
    return () => {
      io.disconnect();
      if (!drawn.current) {
        tl.kill();
        strokes.flat().forEach((el) => { el.style.opacity = ''; el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; });
      }
    };
  }, [animate, layout.hidden, layout.items.length, s]);

  return (
    <div ref={ref} className={`footer-notes${layout.hidden ? ' footer-notes--hidden' : ''}`} aria-hidden="true">
      {layout.items.map((it) => (
        <div key={it.key} className="footer-note" style={it.style} dangerouslySetInnerHTML={{ __html: it.svg }} />
      ))}
    </div>
  );
}
