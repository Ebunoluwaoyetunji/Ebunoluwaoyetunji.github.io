import { Fragment, useLayoutEffect, useMemo, useState } from 'react';
import home from '../content/home.js';
import look from '../content/look.js';
import motion from '../content/motion.js';
import TopBar from '../components/TopBar.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import ScreenSlot from '../components/ScreenSlot.jsx';
import SpreadHeading from '../motion/SpreadHeading.jsx';
import useEffectsAllowed from '../motion/useEffectsAllowed.js';
import useReducedMotion from '../motion/useReducedMotion.js';
import Todo from '../components/Todo.jsx';
import Block, { DraftLabels } from './Blocks.jsx';
import Guide from './Guide.jsx';
import Signpost from '../motion/Signpost.jsx';
import { setRootVars } from '../lib/rootVars.js';

// A case study page, laid out from its content file in the template order
// (DESIGN.md, "Case study template", updates 10 and 11): the frames first,
// before any text; the name, tagline and facts; the Short read / Full read
// switch; then the sections, with the guide beside them; then the next project.
// A section with nothing in it does not show.
//
// Short read (the default) is the whole story in about 350 words
// (study.short). Full read is the complete case study (study.sections), with
// the turning points. The choice is in the web address (?read=full), so a
// link can open the full read. Switching changes the page in place, at once.
//
// Motion: Spread on the project name, Glass on screens once real ones are in,
// and the guide's line, the only scroll motion. The top frame is where the
// homepage frame lands when the page opens (styles.css, view-transition-name).

const display = { name: 'Italiana', family: look.display, weight: 400 };
const NAV = { ...home, nav: home.nav.map((l) => ({ ...l, href: `/${l.href}` })) };
const WORDS_PER_MINUTE = 200;

// Words a reader reads in a list of sections (not labels, ids or image paths).
function countWords(v, k) {
  if (v == null || ['label', 'src', 'alt', 'id', 'srcSet', 'sizes'].includes(k)) return 0;
  if (typeof v === 'string') return v.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(v)) return v.reduce((t, x) => t + countWords(x), 0);
  if (typeof v === 'object') return Object.entries(v).reduce((t, [key, x]) => t + countWords(x, key), 0);
  return 0;
}
const minutes = (words) => Math.max(1, Math.round(words / WORDS_PER_MINUTE));

// A turning point: a line said large, between two parts of the story. When
// the line is already in the text (Fileo), screen readers skip it and read it
// there; readAloud: the line is only here, so they read it. The handwritten
// signpost under it is read as its words.
function Turn({ turn, still }) {
  return (
    <div className="turn">
      <p className="turn__line" aria-hidden={turn.readAloud ? undefined : 'true'}>{turn.text}</p>
      {turn.signpost && (turn.signpost.todo
        ? <p className="turn__signpost" aria-hidden="true"><Todo>{turn.signpost.todo}</Todo></p>
        : <Signpost signpost={turn.signpost} still={still} />)}
    </div>
  );
}

// A fact's value: plain text, a TODO ({ todo }), text followed by a TODO
// ({ text, todo }), or a link that opens in a new tab ({ link: { href, text } }). Only objects are checked for todo or link:
// every string has a built-in .link() method, so a plain text fact must never
// be read as a link.
function FactValue({ value }) {
  if (value && typeof value === 'object') {
    if (value.todo) return value.text ? <>{value.text} <Todo>{value.todo}</Todo></> : <Todo>{value.todo}</Todo>;
    if (value.link) {
      return (
        <a href={value.link.href} target="_blank" rel="noopener">
          {value.link.text}<span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      );
    }
  }
  return value;
}

const readFromUrl = () => (new URLSearchParams(window.location.search).get('read') === 'full' ? 'full' : 'short');

// The switch between the two versions. Each option is at least 44px tall.
function ReadSwitch({ read, onChange, times, compact = false }) {
  return (
    <div className={`facts read-switch${compact ? ' read-switch--compact' : ''}`} role="group" aria-label="How much to read">
      {[['short', 'Short read'], ['full', 'Full read']].map(([key, label]) => (
        <button key={key} type="button" aria-pressed={read === key} onClick={() => onChange(key)}>
          {label} <span className="read-switch__time">{times[key]} min</span>
        </button>
      ))}
    </div>
  );
}

export default function CaseStudy({ study }) {
  const effects = useEffectsAllowed();
  const still = useReducedMotion();
  // The pre-rendered HTML is the Short read. A link to the Full read
  // (?read=full) switches as soon as the page starts.
  const [read, setRead] = useState('short');
  useLayoutEffect(() => { setRead(readFromUrl()); }, []);
  const times = useMemo(() => ({ short: minutes(countWords(study.short?.sections)), full: minutes(countWords(study.sections)) }), [study]);
  const sections = read === 'short' && study.short ? study.short.sections : study.sections;
  const guideSections = useMemo(() => sections.flatMap(({ id, title, blocks }) => [
    { id, title },
    ...blocks.filter((b) => b.sub).map((b) => ({ id: b.sub.id, title: b.sub.title, sub: true })),
  ]), [sections]);

  // Change the version in place, and keep it in the web address.
  const pick = (next, toArticle = false) => {
    setRead(next);
    const url = new URL(window.location.href);
    if (next === 'full') url.searchParams.set('read', 'full'); else url.searchParams.delete('read');
    url.hash = '';
    window.history.replaceState(null, '', url);
    if (toArticle) requestAnimationFrame(() => document.querySelector('.case__article')?.scrollIntoView());
  };

  // CSS variables (also in the pre-rendered HTML, so frames have their shape
  // when the page changes).
  useLayoutEffect(setRootVars, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopBar home={NAV} wordSettings={motion.wordSpread} font={look.display} />

      <main id="main" className={`case${study.wideFrames ? ' case--wide-frames' : ''}`}>
        {/* Frames first, before any text. The first is where the homepage frame lands. */}
        {/* A frame with no real image yet is hidden; its TODO shows below the others. */}
        <div className={`case__visuals wrap${({ 1: ' case__visuals--one', 3: ' case__visuals--three' })[study.visuals.filter((v) => !v.hidden).length] || ''}`}>
          {study.visuals.filter((v) => !v.hidden).map((v, i) => (
            <figure key={i} className="case__screen">
              <ScreenSlot
                screen={v}
                lens
                eager={i === 0}
                zoom
                sizes={study.visuals.filter((x) => !x.hidden).length === 3 ? '(max-width: 640px) 100vw, 33vw' : '(max-width: 640px) 100vw, 90vw'}
              />
              {v.caption && <figcaption className="facts case__caption">{v.caption}</figcaption>}
            </figure>
          ))}
          {/* "Try the demo": one link, under the demo video, in both reads. */}
          {study.demoLink && (
            <div className="case__demo">
              <p className="case__demo-text">
                <a href={study.demoLink.href} target="_blank" rel="noopener">{study.demoLink.text}<span className="visually-hidden"> (opens in a new tab)</span></a>
                <span className="facts case__demo-note">{study.demoLink.note}</span>
              </p>
              {study.demoLink.qr && (
                <figure className="case__qr">
                  <img src={study.demoLink.qr} width="96" height="96" alt={`QR code for ${study.demoLink.href}`} loading="lazy" />
                  <figcaption className="facts">Scan to open on your phone</figcaption>
                </figure>
              )}
            </div>
          )}
          {study.visuals.filter((v) => v.hidden && v.todo).map((v) => (
            <p key={v.label} className="case__todo case__visuals-todo"><Todo>{`${v.label}: ${v.todo}`}</Todo></p>
          ))}
        </div>

        <header className="case__head wrap">
          <p className="facts case__kicker">Case study</p>
          <SpreadHeading as="h1" id="case-title" lines={[study.title]} font={display} active={!still} settings={motion.caseTitle} />
          <p className="case__tagline">{study.tagline}</p>
        </header>

        <dl className="facts case__facts wrap">
          {study.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd><FactValue value={f.value} /></dd>
            </div>
          ))}
        </dl>

        {study.short && (
          <div className="case__switch wrap">
            <ReadSwitch read={read} onChange={pick} times={times} />
          </div>
        )}

        {/* The sections of the chosen version, with the guide beside them. */}
        <div className="case__article wrap">
          <Guide
            sections={guideSections}
            still={still}
            settings={motion.guide}
            barExtra={study.short ? <ReadSwitch read={read} onChange={pick} times={times} compact /> : null}
            barExtraAfter=".case__switch"
          />
          <div className="case__flow">
            <DraftLabels.Provider value={!study.draftsChecked}>
            {sections.map((section) => {
              const turns = read === 'full' ? (study.turns || []).filter((t) => t.after === section.id) : [];
              const inside = turns.find((t) => t.afterBlock != null);
              const after = turns.find((t) => t.afterBlock == null);
              const blocks = section.blocks.filter((b) => !('usability' in b) || b.usability);
              if (!blocks.length) return null;
              const body = (list) => list.map((block, bi) => <Block key={bi} block={block} />);
              // A turn inside a section splits it: the rest continues under the turn.
              const cut = inside ? Math.min(inside.afterBlock, blocks.length) : blocks.length;
              return (
                <Fragment key={section.id}>
                  <section id={section.id} className="case__section" aria-labelledby={`${section.id}-title`}>
                    <h2 className="section__title" id={`${section.id}-title`}>{section.title}</h2>
                    <div className="case__body">{body(blocks.slice(0, cut))}</div>
                  </section>
                  {inside && <Turn turn={inside} still={still} />}
                  {inside && cut < blocks.length && (
                    <section className="case__section case__section--more" aria-labelledby={`${section.id}-title`}>
                      <div className="case__body">{body(blocks.slice(cut))}</div>
                    </section>
                  )}
                  {after && <Turn turn={after} still={still} />}
                </Fragment>
              );
            })}
            </DraftLabels.Provider>
            {read === 'short' && study.short && (
              <p className="case__more">
                <button type="button" className="case__more-button" onClick={() => pick('full', true)}>
                  Read the full case study <span className="facts">{times.full} min</span>
                </button>
              </p>
            )}
          </div>
        </div>

        {/* The way on: the next project, or back to all the work. */}
        <nav className="case__end wrap" aria-label="More work">
          {study.next && <a className="case__next" href={study.next.href}><span className="facts">Next project</span> {study.next.label}</a>}
          <a className="case__back" href="/#work">Back to all work</a>
        </nav>
      </main>

      <SiteFooter effects={effects} base="/" />
    </>
  );
}
