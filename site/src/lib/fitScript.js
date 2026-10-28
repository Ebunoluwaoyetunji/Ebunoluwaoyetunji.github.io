// A small inline script, written into every pre-rendered page right after the
// page's HTML (scripts/prerender.mjs). It sizes the big headings
// (BigHeading.jsx) before the first paint, the same way BigHeading does, so
// they show at their real size before the page's scripts load: once at once
// (with whatever font is ready), and again when Italiana arrives.
// BigHeading takes over when the scripts run.
function fitBigHeadings() {
  const fit = () => {
    document.querySelectorAll('.big[data-fit-share]').forEach((el) => {
      el.style.fontSize = '100px';
      let widest = 0;
      el.querySelectorAll('.big__line').forEach((l) => { widest = Math.max(widest, l.scrollWidth); });
      if (!widest) return;
      const byWidth = ((100 * el.clientWidth) / widest) * 0.985;
      const byHeight = (100 * window.innerHeight * Number(el.dataset.fitShare || 1)) / el.scrollHeight;
      const max = Number(el.dataset.fitMax) || Infinity;
      el.style.fontSize = `${Math.floor(Math.min(byWidth, byHeight, max))}px`;
    });
  };
  fit();
  if (document.fonts) document.fonts.load('400 100px Italiana').then(fit, () => {});
}

export const fitScript = () => `(${fitBigHeadings.toString()})();`;
