// Runs fn once the page has finished loading, or after `cap` ms at most, so a
// slow outside script (GoatCounter loads async and can hold the load event)
// never holds back the demo video or the signposts. Returns a cancel function.
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
