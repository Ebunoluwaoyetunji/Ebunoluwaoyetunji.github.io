// Runs fn once the page has finished loading, or after `cap` ms at most, so a
// slow outside script (GoatCounter loads async and can hold the load event)
// never holds back the demo video or the signposts. Returns a cancel function.
// Runs fn in its own task once the browser has a quiet moment (at most `cap`
// ms later), so work that is not needed for what is on screen never adds to
// a long busy stretch. Returns a cancel function.
export function whenIdle(fn, cap = 1000) {
  if (window.requestIdleCallback) {
    const h = requestIdleCallback(() => fn(), { timeout: cap });
    return () => cancelIdleCallback(h);
  }
  const h = setTimeout(fn, 50);
  return () => clearTimeout(h);
}

export default function whenLoaded(fn, cap = 3000) {
  let done = false;
  let timer = 0;
  const stop = () => { done = true; clearTimeout(timer); window.removeEventListener('load', run); };
  function run() { if (!done) { stop(); fn(); } }
  if (document.readyState === 'complete') { run(); return stop; }
  timer = setTimeout(run, cap);
  window.addEventListener('load', run);
  return stop;
}
