import { useEffect, useRef } from 'react';

// The full screen of a tall design, scrollable, over the page (Boulote frames
// show only the top of each screen). It shows the screen at its real size (the
// exports are 2x: 1440 wide for desktop) and fits the width on smaller screens,
// where it can be pinched to zoom. A modal dialog: focus goes into it (Close),
// Escape, Close or a click outside the screen closes it, and focus goes back to
// the frame that opened it.
//
// image: { src, alt, width, height, from? } or null (closed); from: the button
// that opened it (focus returns there). onClose: called once it is closed.

export default function Lightbox({ image, onClose }) {
  const dialog = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    const d = dialog.current;
    if (image && !d.open) {
      opener.current = image.from || document.activeElement;
      d.showModal();
      d.scrollTop = 0;
    }
  }, [image]);

  const close = () => dialog.current?.close();
  const onClosed = () => {
    onClose();
    opener.current?.focus?.();
  };

  return (
    <dialog ref={dialog} className="lightbox" aria-label={image ? image.alt : 'Screen'} onClick={(e) => { if (e.target === e.currentTarget || e.target.classList.contains('lightbox__page')) close(); }} onClose={onClosed}>
      {image && (
        <>
          <button type="button" className="facts lightbox__close" onClick={close}>Close</button>
          <div className="lightbox__page">
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} style={{ maxWidth: `${Math.round(image.width / 2)}px` }} />
          </div>
        </>
      )}
    </dialog>
  );
}
