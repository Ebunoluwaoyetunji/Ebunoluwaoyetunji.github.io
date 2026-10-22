import { useEffect, useState } from 'react';

// Effects run only with a mouse (or trackpad) and when the person has not
// asked for reduced motion. On touch screens everything stays still and sharp.
const QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export default function useEffectsAllowed() {
  const [allowed, setAllowed] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setAllowed(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return allowed;
}
