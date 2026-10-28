import useMedia from './useMedia.js';

// True when the person has asked their device for reduced motion.
// False in the pre-rendered HTML (useMedia.js).
const QUERY = '(prefers-reduced-motion: reduce)';

export default function useReducedMotion() {
  return useMedia(QUERY);
}
