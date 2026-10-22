import { useLayoutEffect } from 'react';
import home from './content/home.js';
import look from './content/look.js';
import motion from './content/motion.js';
import SpreadHeading from './motion/SpreadHeading.jsx';
import Gallery from './motion/Gallery.jsx';
import Journey from './motion/Journey.jsx';
import useReducedMotion from './motion/useReducedMotion.js';
import Butterfly from './motion/Butterfly.jsx';
import HeroPiano from './motion/HeroPiano.jsx';
import FpsMeter from './motion/FpsMeter.jsx';
import useEffectsAllowed from './motion/useEffectsAllowed.js';
import ProjectBlock from './components/ProjectBlock.jsx';
import TopBar from './components/TopBar.jsx';
import SiteFooter from './components/SiteFooter.jsx';

const display = { name: 'Italiana', family: look.display, weight: 400 };

export default function App() {
  // Spread and Glass need a mouse and motion allowed. Off on touch screens
  // and with reduced motion.
  const effects = useEffectsAllowed();
  // The Journey line draws with the scroll everywhere, except with reduced motion.
  // The hero Spread too: with a mouse, or with a finger on touch screens.
  const still = useReducedMotion();
  const butterflyMode = still ? 'still' : effects ? 'full' : 'touch';
  const showFps = new URLSearchParams(window.location.search).has('fps');

  // Before the first paint, so frames have their shape when the page changes.
  useLayoutEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--accent', look.accent);
    root.setProperty('--display', look.display);
    root.setProperty('--facts', look.facts);
    root.setProperty('--body', look.body);
    root.setProperty('--footer-note-ink', look.footerNoteInk);
    // Frames (look.js) and the Journey line width (motion.js).
    const [fw, fh] = look.frame.aspect.split('/').map(Number);
    root.setProperty('--frame-aspect', look.frame.aspect);
    root.setProperty('--frame-ratio', String(fw / fh));
    root.setProperty('--frame-edge', look.frame.edge);
    root.setProperty('--frame-mount', look.frame.mount);
    root.setProperty('--frame-mount-size', String(look.frame.mountSize));
    root.setProperty('--frame-screen-gap', String(look.frame.screenGap));
    root.setProperty('--journey-stroke', `${motion.journey.strokeWidth}px`);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <TopBar home={home} wordSettings={motion.wordSpread} font={look.display} />

      <main id="main">
        {/* 2. Hero: the heading, left aligned and as big as fits. */}
        <section className="hero" aria-labelledby="hero-line">
          <SpreadHeading as="h1" id="hero-line" lines={home.hero.lines} font={display} active={!still} settings={motion.heroSpread} />
          <Butterfly headingId="hero-line" font={display} option={motion.butterfly.option} settings={motion.butterfly} mode={butterflyMode} />
          <HeroPiano headingId="hero-line" settings={motion.piano} />
        </section>

        {/* 3. Selected work */}
        <section className="section wrap" id="work" aria-labelledby="work-title">
          <h2 className="section__title" id="work-title">Selected work</h2>
          <div className="projects">
            {home.projects.map((p) => <ProjectBlock key={p.id} project={p} effects={effects} />)}
          </div>
        </section>

        {/* 4. Gallery, full screen */}
        <Gallery id="gallery" title={home.gallery.title} items={home.gallery.items} settings={motion.gallery} />

        {/* 5. Journey */}
        <section className="section wrap" id="journey" aria-labelledby="journey-title">
          <h2 className="section__title" id="journey-title">{home.journey.title}</h2>
          <Journey stops={home.journey.stops} settings={motion.journey} still={still} />
        </section>

        {/* 6. About */}
        <section className="section wrap" id="about" aria-labelledby="about-title">
          <h2 className="section__title" id="about-title">About</h2>
          <div className="about">
            <div className="about__block">
              <h3 className="facts about__label">Then</h3>
              {home.about.then.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="about__block">
              <h3 className="facts about__label">Now</h3>
              {home.about.now.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer: a black, full-screen section */}
      <SiteFooter effects={effects} />

      {showFps && <FpsMeter />}
    </>
  );
}
