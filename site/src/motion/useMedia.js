import { useCallback, useSyncExternalStore } from 'react';

// True while a media query matches, kept up to date.
// The pages are pre-rendered (scripts/prerender.mjs), so the HTML is made
// without a screen: there, and while the scripts take over that HTML, the
// answer is `atBuild`. Right after, it becomes the real answer and the page
// updates. So the pre-rendered HTML always matches what the scripts expect.
export default function useMedia(query, atBuild = false) {
  const subscribe = useCallback((onChange) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => atBuild);
}
