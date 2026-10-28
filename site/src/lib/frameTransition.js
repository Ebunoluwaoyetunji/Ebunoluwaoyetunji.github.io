// The page change between the homepage and a case study: the project's frame
// moves and grows into the case study's top frame, and shrinks back to where
// it came from on the way home. Everything else changes with no effect.
//
// It uses the browser's own page-to-page transitions (styles.css,
// @view-transition, which is switched off with reduced motion). Browsers
// without them simply open the page. There is no other animation.
//
// The browser moves the element named "case-frame" on the old page onto the
// one with that name on the new page. The case study names its top frame in
// styles.css. On the homepage this file names exactly one frame:
//   - when a case study is opened: the frame of the project or gallery label
//     that was clicked (the project frame, its name, "Read the case study",
//     or a gallery label);
//   - when coming back from a case study: the frame it was opened from, or
//     else that project's frame.
// setupFrameTransitions() handles leaving the homepage; revealScript, inlined
// in the homepage's HTML, handles coming back (it must run before the page
// first shows, so the browser's "pagereveal" event is not missed).

const NAME = 'case-frame';
const KEY = 'case-frame-from'; // sessionStorage: which homepage frame opened which case study

const norm = (path) => (path.endsWith('/') ? path : `${path}/`);

// Which homepage frame a link belongs to.
function sourceOf(link) {
  const project = link.closest('.project[data-project]');
  if (project) return { kind: 'project', id: project.dataset.project };
  const card = link.closest('.gallery__card, .gallery__item');
  if (card) return { kind: 'gallery', index: [...card.parentElement.children].indexOf(card) };
  return null;
}

function frameOf(source) {
  if (!source) return null;
  if (source.kind === 'project') return document.querySelector(`.project[data-project="${source.id}"] .project__screen .canvas`);
  return document.querySelectorAll('.gallery__card, .gallery__item')[source.index]?.querySelector('.canvas') || null;
}

function clear() {
  document.querySelectorAll('[data-case-frame]').forEach((el) => {
    el.style.viewTransitionName = '';
    delete el.dataset.caseFrame;
  });
}

function nameFrame(el) {
  clear();
  if (!el) return;
  el.style.viewTransitionName = NAME;
  el.dataset.caseFrame = '';
}

// casePages: the case study paths (content/case-studies/index.js).
// projects: home.projects, to find a project's frame from its case study path.
export function setupFrameTransitions(casePages, projects) {
  const isCase = (url) => url.origin === window.location.origin && casePages.includes(norm(url.pathname));

  // Opening a case study: name the frame that was clicked.
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    const url = new URL(a.href, window.location.href);
    if (!isCase(url)) return;
    const source = sourceOf(a);
    if (!source) return;
    nameFrame(frameOf(source));
    try { sessionStorage.setItem(KEY, JSON.stringify({ path: norm(url.pathname), ...source })); } catch { /* the frame still moves */ }
  }, true);

  // Leaving for a case study without a click (the Forward button): name the
  // frame it was last opened from, or else the project's frame.
  window.addEventListener('pageswap', (e) => {
    if (!e.viewTransition || document.querySelector('[data-case-frame]')) return;
    const to = e.activation?.entry?.url;
    if (!to || !isCase(new URL(to))) return;
    const path = norm(new URL(to).pathname);
    let source = null;
    try { source = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { /* use the project frame */ }
    if (!source || source.path !== path) {
      const project = projects.find((p) => p.href && norm(p.href) === path);
      source = project ? { kind: 'project', id: project.id } : null;
    }
    nameFrame(frameOf(source));
  });

  // Coming back from a case study is handled by revealScript (below), which
  // is written into the homepage's HTML: the browser's "pagereveal" comes
  // before the page's scripts have loaded.
}

// Coming back from a case study: name the frame it came from. Self-contained
// (it runs as a small inline script in the pre-rendered homepage, before
// anything else), so it repeats the few lines it needs from above.
function onReveal(casePages, projects) {
  const norm = (path) => (path.endsWith('/') ? path : `${path}/`);
  const clear = () => document.querySelectorAll('[data-case-frame]').forEach((el) => {
    el.style.viewTransitionName = '';
    delete el.dataset.caseFrame;
  });
  window.addEventListener('pagereveal', (e) => {
    clear();
    if (!e.viewTransition) return;
    const from = window.navigation?.activation?.from?.url;
    if (!from) return;
    const url = new URL(from);
    if (url.origin !== window.location.origin || !casePages.includes(norm(url.pathname))) return;
    const path = norm(url.pathname);
    let source = null;
    try { source = JSON.parse(sessionStorage.getItem('case-frame-from') || 'null'); } catch { /* use the project frame */ }
    if (!source || source.path !== path) {
      const project = projects.find((p) => p.href && norm(p.href) === path);
      source = project ? { kind: 'project', id: project.id } : null;
    }
    let el = null;
    if (source?.kind === 'project') el = document.querySelector(`.project[data-project="${source.id}"] .project__screen .canvas`);
    else if (source) el = document.querySelectorAll('.gallery__card, .gallery__item')[source.index]?.querySelector('.canvas') || null;
    if (el) { el.style.viewTransitionName = 'case-frame'; el.dataset.caseFrame = ''; }
    e.viewTransition.finished.finally(clear);
  });
}

// The inline script for the homepage's <head> (scripts/prerender.mjs).
export const revealScript = (casePages, projects) =>
  `(${onReveal.toString()})(${JSON.stringify(casePages)},${JSON.stringify(projects.map((p) => ({ id: p.id, href: p.href })))});`;
