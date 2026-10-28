import useMedia from './useMedia.js';

// Effects run only with a mouse (or trackpad) and when the person has not
// asked for reduced motion. On touch screens everything stays still and sharp.
// False in the pre-rendered HTML (useMedia.js): effects start once the scripts run.
const QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export default function useEffectsAllowed() {
  return useMedia(QUERY);
}
