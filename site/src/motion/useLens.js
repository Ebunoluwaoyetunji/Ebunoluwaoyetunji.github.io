import { useEffect } from 'react';

// A round lens that magnifies part of a screen image, under the mouse.
// It replaces the old Glass hover effect on every framed screen.
//
// - Only with a mouse (hover: hover and pointer: fine). Touch screens get
//   nothing: a tap opens the frame as before.
// - The lens appears after the mouse rests on the image for DELAY ms, follows
//   it, and fades out when it leaves. The image itself never changes.
// - Inside, the image shows at ZOOM times its size on screen, drawn from the
//   image file itself (full resolution, never resized), so it stays sharp.
// - A press hides it at once, so the page change and "View full screen" start
//   from a clean image. Scrolling hides it too.
// - Keyboard users get nothing extra; nothing else depends on it.
// - Reduced motion: no fade (styles.css, .lens).
// One lens element is shared by the whole page.

const SIZE = 180; // px, the lens width and height
const ZOOM = 2;
const DELAY = 150; // ms of resting before it appears
const MOUSE = '(hover: hover) and (pointer: fine)';

let lens = null;
function theLens() {
  if (!lens) {
    lens = document.createElement('div');
    lens.className = 'lens';
    lens.setAttribute('aria-hidden', 'true');
    lens.style.width = `${SIZE}px`;
    lens.style.height = `${SIZE}px`;
    document.body.appendChild(lens);
  }
  return lens;
}

// ref: the <img> to magnify. on: false to switch the lens off for this image.
export default function useLens(ref, on = true) {
  useEffect(() => {
    const img = ref.current;
    if (!on || !img) return undefined;
    const mouse = window.matchMedia(MOUSE);
    let timer = 0;
    let shown = false;
    let last = null;

    const place = (e) => {
      const L = theLens();
      const r = img.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { hide(); return; }
      const R = SIZE / 2;
      L.style.transform = `translate(${e.clientX - R}px, ${e.clientY - R}px)`;
      L.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
      L.style.backgroundSize = `${r.width * ZOOM}px ${r.height * ZOOM}px`;
      L.style.backgroundPosition = `${R - x * ZOOM}px ${R - y * ZOOM}px`;
    };
    const show = () => {
      if (!last) return;
      shown = true;
      place(last);
      theLens().classList.add('is-on');
    };
    function hide(now = false) {
      clearTimeout(timer);
      if (!shown && !now) return;
      shown = false;
      const L = theLens();
      if (now) {
        // At once: no fade, then the fade comes back for next time.
        L.style.transition = 'none';
        L.classList.remove('is-on');
        requestAnimationFrame(() => { L.style.transition = ''; });
      } else {
        L.classList.remove('is-on');
      }
    }

    const onEnter = (e) => {
      if (e.pointerType !== 'mouse' || !mouse.matches || !img.complete || !img.naturalWidth) return;
      last = e;
      clearTimeout(timer);
      timer = setTimeout(show, DELAY);
    };
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || !mouse.matches) return;
      last = e;
      if (shown) place(e);
      else { clearTimeout(timer); timer = setTimeout(show, DELAY); }
    };
    const onLeave = () => hide();
    const onDown = () => hide(true);
    const onScroll = () => hide();

    img.addEventListener('pointerenter', onEnter);
    img.addEventListener('pointermove', onMove);
    img.addEventListener('pointerleave', onLeave);
    img.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      hide(true);
      img.removeEventListener('pointerenter', onEnter);
      img.removeEventListener('pointermove', onMove);
      img.removeEventListener('pointerleave', onLeave);
      img.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ref, on]);
}
