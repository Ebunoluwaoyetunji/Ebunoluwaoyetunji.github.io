import { useEffect, useRef, useState } from 'react';
import useLens from '../motion/useLens.js';
import Lightbox from './Lightbox.jsx';
import look from '../content/look.js';

// One hung canvas. Every screen on the homepage sits in this same frame: a
// thin dark edge, a pale mount, and the screen centred inside. All frames are
// the same wide shape (look.js, frame.aspect).
//
// What goes in it (in the content files):
//   nothing yet:      { label: 'Fileo screen, coming' }        an empty frame with a small label
//   one screen:       { src, alt, width?, height? }          desktop screens fit the width
//   phone screens:    { images: [{ src, alt, width?, height? }, ...] }
//                     up to three from the same flow, side by side, centred
//   a video:          an image entry with { video, poster, description } instead of src
// Screens are never stretched: each is sized from its own shape.
//
// screen.mountSize: a thinner or wider margin for this frame (same shape).
// screen.edge: a thin light border and soft shadow on each screen.
//
// zoom (case studies): an image with `full` ({ src, width, height }, the whole
// tall screen; the frame shows only its top) can be opened by a click or tap,
// full and scrollable (Lightbox). Off on the homepage, where frames are links.
//
// layout 'phones' (the Fileo crops): the frame is filled with screen.fill,
// and every phone is the same height, look.frame.phoneHeight of the inside of
// the frame (from each image's phoneShare: how much of the image the phone
// takes). They sit evenly spaced. On small screens the frame turns upright
// and shows one phone at a time, to swipe, with dots.

export function imagesOf(screen) {
  if (screen.images?.length) return screen.images.slice(0, 3);
  return screen.src || screen.video ? [screen] : [];
}

// Small screens show one phone at a time. An image of two phones side by side
// (split: true, the before and after crops) becomes two slides there, one half
// each, so its phones are as big as every other phone.
const SMALL = '(max-width: 640px)';
function useSmall() {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && window.matchMedia(SMALL).matches);
  useEffect(() => {
    const m = window.matchMedia(SMALL);
    const on = () => setSmall(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return small;
}
// Touch screens get "Tap to view full screen".
const TOUCH = '(hover: none)';
function useTouch() {
  const [touch, setTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia(TOUCH).matches);
  useEffect(() => {
    const m = window.matchMedia(TOUCH);
    const on = () => setTouch(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return touch;
}
const ExpandIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M7 1h4v4M5 11H1V7M11 1 7 5M1 11l4-4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const halves = (img) => [
  { ...img, width: img.width / 2, half: 'left', key: `${img.src}#left` },
  { ...img, width: img.width / 2, half: 'right', alt: '', key: `${img.src}#right` },
];

// A muted, looping video that plays only while its frame is on screen, loads
// only when the frame is close, and has a clear pause/play button. With
// reduced motion it never starts by itself: the poster and Play show.
function VideoFit({ image }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const descId = useRef(`video-${Math.random().toString(36).slice(2, 8)}`).current;

  useEffect(() => {
    const v = ref.current;
    let loaded = false;
    const load = () => { if (!loaded) { loaded = true; v.src = image.video; } };
    const near = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) load(); }, { rootMargin: '600px 0px' });
    const seen = new IntersectionObserver((es) => {
      const on = es.some((e) => e.isIntersecting);
      if (on && !reduced && !v.dataset.userPaused) { load(); v.play().catch(() => {}); } else if (!on) v.pause();
    }, { threshold: 0.4 });
    near.observe(v); seen.observe(v);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('play', onPlay); v.addEventListener('pause', onPause);
    return () => { near.disconnect(); seen.disconnect(); v.removeEventListener('play', onPlay); v.removeEventListener('pause', onPause); };
  }, [image.video, reduced]);

  const toggle = () => {
    const v = ref.current;
    if (v.paused) {
      if (!v.src) v.src = image.video;
      delete v.dataset.userPaused; setUserPaused(false);
      v.play().catch(() => {});
    } else {
      v.dataset.userPaused = '1'; setUserPaused(true);
      v.pause();
    }
  };

  return (
    <>
      <video ref={ref} poster={image.poster} muted loop playsInline preload="none" width={image.width} height={image.height} aria-describedby={descId} />
      <p id={descId} className="visually-hidden">{image.description}</p>
      <button type="button" className="canvas__play" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'} data-user-paused={userPaused || undefined}>
        <span aria-hidden="true">{playing ? 'Pause' : 'Play'}</span>
      </button>
    </>
  );
}

function Fit({ image, lens, eager, phones, onOpen }) {
  const known = image.width && image.height ? image.width / image.height : null;
  const [ratio, setRatio] = useState(known);
  const onLoad = (e) => {
    if (!known && e.currentTarget.naturalWidth) setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight);
  };
  // How tall the whole image is, as a share of the inside of the frame, so its phone is phoneHeight tall.
  const h = phones && image.phoneShare ? Math.min(1, look.frame.phoneHeight / image.phoneShare) : 1;
  // The lens magnifier (mouse only). Not on half images (phones, cropped by CSS).
  const imgRef = useRef(null);
  useLens(imgRef, lens && !image.half && !image.video);
  const picture = image.video ? null : (
    <img
      ref={imgRef}
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.sizes}
      width={image.width}
      height={image.height}
      alt={image.alt || ''}
      className={image.half ? `canvas__half canvas__half--${image.half}` : undefined}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={onLoad}
    />
  );
  return (
    <div className={`canvas__fit${image.video ? ' canvas__fit--video' : ''}`} style={{ '--ratio': ratio || 0.75, '--h': h, visibility: ratio ? 'visible' : 'hidden' }}>
      {onOpen && image.full ? (
        <button type="button" className="canvas__zoom" onClick={(e) => onOpen(image, e.currentTarget)}>
          {picture}
          <span className="visually-hidden"> (opens the full screen)</span>
        </button>
      ) : image.video ? (
        <VideoFit image={image} />
      ) : picture}
    </div>
  );
}

// lens: the lens magnifier on the screens (mouse only; useLens.js).
// hung: adds the soft shadow for the gallery wall.
// screen.fill: a background colour for the mount and the space between
// images (the images' own brand background), with no gap between them.
// screen.hidden: no real image yet, so the frame is not shown at all.
// zoom: images with `full` open the whole screen (case studies only).
export default function ScreenSlot({ screen, lens = false, hung = false, eager = false, zoom = false }) {
  const windowRef = useRef(null);
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(null);
  const small = useSmall();
  const touch = useTouch();
  if (screen.hidden) return null;
  const phones = screen.layout === 'phones';
  const images = imagesOf(screen).flatMap((img) => (phones && small && img.split ? halves(img) : [img]));
  const style = {
    ...(screen.fill ? { '--frame-mount': screen.fill, '--frame-screen-gap': 0 } : {}),
    ...(screen.mountSize != null ? { '--frame-mount-size': screen.mountSize } : {}),
  };
  const zoomable = zoom && images.some((im) => im.full);
  // One screen: a click anywhere on the frame opens it (the screen itself is the keyboard button).
  // Clicks from inside the open view (which sits inside the frame) are not the frame's.
  const onFrameClick = zoomable && images.length === 1 ? (e) => { if (!e.target.closest('button, .lightbox')) setOpen({ ...images[0].full, alt: images[0].alt, from: e.currentTarget.querySelector('.canvas__zoom') }); } : undefined;
  // Small screens: which phone is in view, from the window's sideways scroll.
  const onScroll = (e) => {
    const w = e.currentTarget;
    setAt(Math.round(w.scrollLeft / Math.max(1, w.clientWidth)));
  };
  const go = (i) => { const w = windowRef.current; w.scrollTo({ left: i * w.clientWidth }); };
  return (
    <div className={`canvas${hung ? ' canvas--hung' : ''}${phones ? ' canvas--phones' : ''}${screen.edge ? ' canvas--edge' : ''}${zoomable ? ' canvas--zoom' : ''}`} style={style} onClick={onFrameClick}>
      <div className="canvas__window" ref={windowRef} style={{ '--n': images.length || 1 }} onScroll={phones && images.length > 1 ? onScroll : undefined}>
        {images.length ? (
          images.map((img) => <Fit key={img.key || img.src || img.video} image={img} lens={lens} eager={eager} phones={phones} onOpen={zoom ? (im, from) => setOpen({ ...im.full, alt: im.alt, from }) : null} />)
        ) : (
          <span className="facts canvas__label">{screen.label}</span>
        )}
      </div>
      {phones && images.length > 1 && (
        <div className="canvas__dots" role="group" aria-label="Choose a screen">
          {images.map((img, i) => (
            <button key={i} type="button" className="canvas__dot" aria-current={i === at ? 'true' : undefined} aria-label={`Screen ${i + 1} of ${images.length}`} onClick={() => go(i)} />
          ))}
        </div>
      )}
      {zoomable && (
        <span className="facts canvas__hint" aria-hidden="true">
          <ExpandIcon />
          {touch ? 'Tap to view full screen' : 'View full screen'}
        </span>
      )}
      {zoomable && <Lightbox image={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
