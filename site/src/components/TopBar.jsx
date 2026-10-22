import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import WordStack from '../motion/WordStack.jsx';

// The black top bar. On laptops: name, role and the links in one row.
// On phones (PHONE below): name and role, and a Menu button that opens a
// full-screen black menu with the links as big words (like the footer) and
// Email and LinkedIn in small type underneath. The menu words stay still,
// like the footer words on phones. No animation: the menu just appears.
// No CV link (here, in the menu or the footer) until Ebun adds her CV
// (22 Oct 2026); CvLink.jsx is kept for then.
//
// The bar's real height is written to --bar-height so the hero fills exactly
// the rest of the first screen.
//
// Sticky (2026-10-11): the bar is fixed to the top of the screen, over a space
// of its full height, so nothing on the page moves when it changes.
//   - At the top of the page it scrolls with the page, full height.
//   - Further down it slides away as the reader scrolls down, and slides back,
//     slim (name and menu or links, less height), as soon as they scroll up.
//   - While the gallery wall is pinned it stays hidden, so the wall fills the screen.
//   - Tabbing to one of its links while it is hidden brings it back.
//   - With the phone menu open it stays as it is (the page cannot scroll then).
// How much of the screen it covers is written to --header-offset, so the case
// study's section bar sits right under it, and links to a section land below it.
// Reduced motion: no slide.

const PHONE = '(max-width: 640px)'; // keep in step with the @media rule in styles.css

export default function TopBar({ home, wordSettings, font }) {
  const bar = useRef(null);
  const button = useRef(null);
  const panel = useRef(null);
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0); // the menu starts under the bar, wherever the bar is
  // 'natural': at the top, full height, scrolling with the page. 'shown': slim,
  // at the top of the screen. 'hidden': slid up out of view.
  const [mode, setMode] = useState('natural');
  const modeRef = useRef('natural');
  const openRef = useRef(false);
  openRef.current = open;

  // Heights: full (the space it keeps in the page) and slim. Measured with the
  // slim style switched off or on for a moment, in one go, so nothing flickers.
  const heights = useRef({ full: 0, slim: 0 });
  useLayoutEffect(() => {
    const el = bar.current;
    const root = document.documentElement.style;
    const measure = () => {
      const was = el.classList.contains('topbar--slim');
      el.classList.remove('topbar--slim');
      const full = el.offsetHeight;
      el.classList.add('topbar--slim');
      const slim = el.offsetHeight;
      if (!was) el.classList.remove('topbar--slim');
      heights.current = { full, slim };
      root.setProperty('--bar-height', `${full}px`);
      root.setProperty('--bar-slim-height', `${slim}px`);
    };
    measure();
    const ro = new ResizeObserver(() => { if (modeRef.current === 'natural') measure(); });
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // Which state, from the scroll position and direction.
  useEffect(() => {
    const el = bar.current;
    const root = document.documentElement.style;
    let lastY = window.scrollY;
    let raf = 0;
    const set = (next) => { if (modeRef.current !== next) { modeRef.current = next; setMode(next); } };
    const wallPinned = () => {
      const wall = document.querySelector('.gallery--walk');
      if (!wall) return false;
      const r = wall.getBoundingClientRect();
      return r.top <= 0 && r.bottom > window.innerHeight;
    };
    const update = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const dy = y - lastY;
      lastY = y;
      const { full, slim } = heights.current;
      if (!openRef.current) {
        const m = modeRef.current;
        if (wallPinned()) set('hidden');
        else if (y <= 0) set('natural');
        else if (m === 'natural') { if (y >= full) set(dy < 0 ? 'shown' : 'hidden'); }
        else if (dy > 0) set('hidden');
        else if (dy < 0) set('shown');
      }
      // At the top it moves with the page; otherwise it is fixed in place.
      const m = modeRef.current;
      el.style.setProperty('--natural-shift', `${-Math.min(y, full)}px`);
      root.setProperty('--header-offset', `${m === 'natural' ? Math.max(0, full - y) : m === 'shown' ? slim : 0}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    // Tabbing into the bar while it is hidden brings it back.
    const onFocus = () => { if (modeRef.current === 'hidden') { set('shown'); update(); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    el.addEventListener('focusin', onFocus);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); el.removeEventListener('focusin', onFocus); };
  }, []);

  // The offset follows the state at once when it changes (not only on scroll).
  useEffect(() => {
    const { full, slim } = heights.current;
    const y = Math.max(0, window.scrollY);
    document.documentElement.style.setProperty('--header-offset', `${mode === 'natural' ? Math.max(0, full - y) : mode === 'shown' ? slim : 0}px`);
  }, [mode]);

  // Close the menu if the screen grows past phone width.
  useEffect(() => {
    const mq = window.matchMedia(PHONE);
    const update = () => { if (!mq.matches) setOpen(false); };
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // While open: the page behind cannot scroll or take focus, Escape closes,
  // and focus starts on the first link.
  useEffect(() => {
    if (!open) return undefined;
    const behind = [...document.querySelectorAll('.skip-link, #main, .footer')];
    behind.forEach((el) => el.setAttribute('inert', ''));
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    panel.current.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); button.current.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      behind.forEach((el) => el.removeAttribute('inert'));
      root.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // A link in the menu closes it, then the page goes to that section.
  const onMenuClick = (e) => { if (e.target.closest('a')) setOpen(false); };

  return (
    <>
      <div className="topbar-space" aria-hidden="true" />
      <header className={`topbar topbar--${mode}${mode === 'natural' ? '' : ' topbar--slim'}`} ref={bar}>
        <p className="topbar__who">
          <a className="topbar__name" href="/">{home.name}</a>
          <span className="facts topbar__role">{home.role}</span>
        </p>
        <nav className="topbar__nav" aria-label="Main">
          <ul className="topbar__links">
            {home.nav.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </nav>
        <button type="button" ref={button} className="topbar__menu-button" aria-expanded={open} aria-controls="phone-menu"
          onClick={() => {
            if (!open) setTop(Math.max(0, Math.round(bar.current.getBoundingClientRect().bottom)));
            setOpen(!open);
          }}>
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      {open && (
        <div id="phone-menu" className="phone-menu" ref={panel} style={{ top: `${top}px` }}>
          <nav className="phone-menu__nav" aria-label="Main" onClick={onMenuClick}>
            <WordStack words={home.nav} settings={wordSettings} active={false} font={font} />
            <ul className="facts footer__small">
              <li><a href={`mailto:${home.email}`}>Email</a></li>
              <li><a href={home.linkedin}>LinkedIn</a></li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
