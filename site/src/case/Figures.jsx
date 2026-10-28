import { useEffect, useRef, useState } from 'react';
import { srcSetOf } from '../components/ScreenSlot.jsx';

// A row of pictures that keep their own shape, each with its caption under it
// (the Boulote hand-drawn maps). Side by side across the text column on a
// laptop, one under another on a phone; in a row they share one height.
// A click or tap opens one larger; Escape, a tap or the Close button closes it.
//
// items: [{ src, alt, width, height, caption }]. In the row each loads a
// smaller copy (scripts/make-image-sizes.mjs); the larger view loads the original.

export default function Figures({ items }) {
  const [open, setOpen] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    const d = dialog.current;
    if (open !== null && !d.open) d.showModal();
  }, [open]);

  const close = () => dialog.current?.close();
  const onClosed = () => {
    setOpen(null);
    opener.current?.focus();
  };

  const item = open !== null ? items[open] : null;
  return (
    <>
      <div className="figures">
        {items.map((it, i) => (
          <figure key={it.src} className="figures__item" style={{ '--ratio': it.width / it.height }}>
            <button
              type="button"
              className="figures__open"
              onClick={(e) => { opener.current = e.currentTarget; setOpen(i); }}
            >
              <img src={it.src} srcSet={srcSetOf(it)} sizes="auto, (max-width: 640px) 100vw, 40vw" alt={it.alt} width={it.width} height={it.height} loading="lazy" decoding="async" />
              <span className="visually-hidden"> (opens larger)</span>
            </button>
            <figcaption className="facts figures__caption">{it.caption}</figcaption>
          </figure>
        ))}
      </div>
      {/* The larger view. A modal dialog: Escape closes it, and so does a tap anywhere. */}
      <dialog ref={dialog} className="figures__dialog" aria-label={item ? item.caption : 'Picture'} onClick={close} onClose={onClosed}>
        {item && (
          <>
            <img src={item.src} alt={item.alt} width={item.width} height={item.height} />
            <p className="facts figures__dialog-caption">{item.caption}</p>
            <button type="button" className="facts figures__close" onClick={close}>Close</button>
          </>
        )}
      </dialog>
    </>
  );
}
