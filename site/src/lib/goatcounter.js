// Visit counts with GoatCounter (ebunportfolio.goatcounter.com). No cookies, so
// no cookie banner. Plain JavaScript with no imports: used by
// scripts/prerender.mjs (the new pages) and scripts/assemble-site.mjs (the old
// pages that stay), so the dev server never counts anything.
//
// - Each page counts as its own path, without the query, so the Short read
//   and the Full read (?read=full) are the same page.
// - Clicks on these links count as events (named below): the Fileo demo,
//   Email, LinkedIn and the three live sites.
// - The script loads async and nothing waits for it. If it is blocked (an ad
//   blocker), the click listener does nothing and the page works the same.
// - GoatCounter skips localhost by itself, so local checks are never counted.

export const GOATCOUNTER = 'https://ebunportfolio.goatcounter.com/count';
export const COUNT_JS = 'https://gc.zgo.at/count.js';

// Self-contained: it runs as an inline script, before GoatCounter loads.
function countClicks() {
  // Count the path only, never the query: /fileo/?read=full counts as /fileo/.
  window.goatcounter = Object.assign(window.goatcounter || {}, { path: () => location.pathname });
  const EVENTS = {
    'fileo-app.expo.app': 'Try the demo (Fileo)',
    'linkedin.com': 'LinkedIn',
    'folowr.app': 'folowr.app',
    'app.boulote.com': 'app.boulote.com',
    'sportingnews.ng': 'sportingnews.ng',
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || !window.goatcounter || !window.goatcounter.count) return;
    const name = a.protocol === 'mailto:' ? 'Email' : EVENTS[a.hostname.replace(/^www\./, '')];
    if (name) window.goatcounter.count({ path: name, title: `Clicked on ${location.pathname}`, event: true });
  }, true);
}

// The tags for a page's <head>: the settings and click listener first, so they
// are in place whenever the async script arrives.
export const goatcounterTags = () =>
  `<script>(${countClicks.toString()})();</script><script data-goatcounter="${GOATCOUNTER}" async src="${COUNT_JS}"></script>`;
