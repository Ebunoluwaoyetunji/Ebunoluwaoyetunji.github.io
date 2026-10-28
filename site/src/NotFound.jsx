import { useLayoutEffect } from 'react';
import home from './content/home.js';
import look from './content/look.js';
import motion from './content/motion.js';
import TopBar from './components/TopBar.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import useEffectsAllowed from './motion/useEffectsAllowed.js';
import { setRootVars } from './lib/rootVars.js';

// The page GitHub Pages shows for any address that does not exist (404.html).
// It can sit at any depth (/a/b/c), so every link here starts with "/".
// Words written by Claude (22 Oct 2026), for Ebun to check.

const NAV = { ...home, nav: home.nav.map((l) => ({ ...l, href: `/${l.href}` })) };
const CASES = [
  { href: '/fileo/', name: 'Fileo' },
  { href: '/boulote/', name: 'Boulote' },
  { href: '/folowr/', name: 'Folowr' },
  { href: '/sporting-news/', name: 'Sporting News' },
];

export default function NotFound() {
  const effects = useEffectsAllowed();

  useLayoutEffect(setRootVars, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopBar home={NAV} wordSettings={motion.wordSpread} font={look.display} />
      <main id="main" className="not-found wrap">
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__text">This page does not exist, or it has moved.</p>
        <p className="not-found__text"><a href="/">Go to the homepage</a></p>
        <h2 className="facts not-found__label">Case studies</h2>
        <ul className="not-found__list">
          {CASES.map((c) => <li key={c.href}><a href={c.href}>{c.name}</a></li>)}
        </ul>
      </main>
      <SiteFooter effects={effects} base="/" />
    </>
  );
}
