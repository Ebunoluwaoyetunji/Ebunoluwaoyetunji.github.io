import { lazy, Suspense } from 'react';
import ScreenSlot, { imagesOf } from './ScreenSlot.jsx';
import { Text, isTodo } from './Todo.jsx';
import motion from '../content/motion.js';

// The pen notes (and GSAP, which draws them) download only when they are switched on.
const AnnotatedScreen = lazy(() => import('./AnnotatedScreen.jsx'));

// One project in Selected work: facts and highlights beside its framed screen.
// All four frames are the same wide canvas (see ScreenSlot).
// - With pen notes (Fileo), one screen, and notes switched on in motion.js,
//   the notes draw on it.
// - Otherwise screens get the lens magnifier (unless the project sets lens: false).
export default function ProjectBlock({ project: p, effects }) {
  const screen = p.screen;
  const images = imagesOf(screen);
  const withNotes = images.length === 1 && p.notes?.length > 0 && motion.pen.showNotes;

  return (
    <article className={`project${withNotes ? ' project--notes' : ''}`} aria-labelledby={`${p.id}-name`} data-project={p.id}>
      <div className="project__info">
        <h3 className="project__name" id={`${p.id}-name`}>
          {p.href ? <a href={p.href}>{p.name}</a> : p.name}
        </h3>
        <p className="project__line"><Text value={p.line} /></p>

        <dl className="facts project__facts">
          <div><dt>Role</dt><dd><Text value={p.role} /></dd></div>
          <div><dt>Year</dt><dd><Text value={p.year} /></dd></div>
          <div>
            <dt>Status</dt>
            <dd>{isTodo(p.status) ? <Text value={p.status} /> : <span className="status">{p.status}</span>}</dd>
          </div>
        </dl>

        <ul className="project__highlights">
          {p.highlights.map((h, i) => <li key={i}><Text value={h} /></li>)}
        </ul>

        <p className="project__more">
          {p.href ? <a href={p.href}>Read the {p.name} case study</a> : <Text value={p.caseStudy} />}
        </p>
      </div>

      <div className="project__screen">
        {withNotes ? (
          <Suspense fallback={<ScreenSlot screen={screen} />}>
            <AnnotatedScreen screen={images[0]} notes={p.notes} trigger="scroll" tools={false} framed />
          </Suspense>
        ) : p.href ? (
          // The frame opens the case study too. Keyboard and screen reader users
          // have the name and "Read the case study" links, so it is not a tab stop.
          <a className="project__frame-link" href={p.href} tabIndex={-1} aria-hidden="true">
            <ScreenSlot screen={screen} lens={p.lens !== false} />
          </a>
        ) : (
          <ScreenSlot screen={screen} lens={p.lens !== false} />
        )}
      </div>
    </article>
  );
}
