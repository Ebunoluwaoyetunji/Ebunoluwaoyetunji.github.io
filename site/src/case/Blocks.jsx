import { createContext, useContext } from 'react';
import ScreenSlot from '../components/ScreenSlot.jsx';
import Todo from '../components/Todo.jsx';
import Figures from './Figures.jsx';

// One content block of a case study. The block types match the content
// file (src/content/case-studies/*.js):
//   { p } (text, or [text, { link: { href, text } }, ...] for links in a new tab), { h }, { list }, { quote, source }, { stats }, { items },
//   { profiles }, { table }, { decision }, { steps }, { phases },
//   { screen }, { draft }, { goal: { label, text | draft } }, { todo },
//   { usability } (hidden while it is null), { note } (a short line in the small typewriter font),
//   { figures: [{ src, alt, width, height, caption }] } (pictures in their own shape, each opens larger),
//   { pair: [screen, screen] } (two frames side by side, stacked on phones),
//   { grid: [screens], label } (frames two by two on laptops, stacked on phones),
//   { draftList: [{ draft, todo? }] } (a short list of drafts; see DraftLabels below),
//   decision: { title, screen | screens (side by side), what, why, draft, blocks, level (4 inside a group) }
//   { ol: [...] } (a numbered list), { sub: { id, title } } (a group heading inside a section, also in the guide)

function Screen({ screen }) {
  if (screen.hidden) return screen.todo ? <p className="case__todo"><Todo>{screen.todo}</Todo></p> : null;
  return (
    <figure className="case__screen">
      <ScreenSlot screen={screen} lens zoom />
      {screen.caption && <figcaption className="facts case__caption">{screen.caption}</figcaption>}
    </figure>
  );
}

function Profile({ p }) {
  return (
    <article className={`profile${p.primary ? ' profile--primary' : ''}`}>
      <h4 className="profile__name">{p.name}</h4>
      <p className="facts profile__role">{p.role}</p>
      <p className="profile__quote">“{p.quote}”</p>
      {p.pains && <ul className="profile__pains">{p.pains.map((x) => <li key={x}>{x}</li>)}</ul>}
      <p className="profile__implication"><span className="facts case__label">Design implication</span>{p.implication}</p>
    </article>
  );
}

// Drafts: new words for Ebun to check, shown with the "Draft, for Ebun to
// check" label, until a case study's drafts are checked (study.draftsChecked,
// Fileo since 2026-10-11): then they show as plain text. CaseStudy.jsx sets it.
export const DraftLabels = createContext(true);
const DRAFT = 'Draft, for Ebun to check';

// label: an optional small label before the words (e.g. "Why").
export function Draft({ children, label }) {
  const labelled = useContext(DraftLabels);
  return (
    <p className={labelled ? 'draft' : undefined}>
      {labelled && <span className="facts draft__label">{DRAFT}</span>}
      {label && <span className="facts case__label">{label}</span>}
      {children}
    </p>
  );
}

function DraftList({ items }) {
  const labelled = useContext(DraftLabels);
  const list = (
    <ul className={`case__list${labelled ? ' draft__list' : ''}`}>
      {items.map((it) => (
        <li key={it.draft}>{it.draft}{it.todo && <> <Todo>{it.todo}</Todo></>}</li>
      ))}
    </ul>
  );
  return labelled ? <div className="draft"><span className="facts draft__label">{DRAFT}</span>{list}</div> : list;
}

function GoalDraftLabel() {
  return useContext(DraftLabels) ? <p className="facts draft__label">{DRAFT}</p> : null;
}

export default function Block({ block: b }) {
  if ('usability' in b) {
    if (!b.usability) return null;
    return <p className="case__usability">{b.usability.text} <span className="facts">{b.usability.source}</span></p>;
  }
  if (b.goal) {
    return (
      <div className="case__goal">
        <p className="facts case__goal-label">{b.goal.label}</p>
        <p className="case__goal-text">{b.goal.text || b.goal.draft}</p>
        {b.goal.draft && <GoalDraftLabel />}
      </div>
    );
  }
  if (b.todo) return <p className="case__todo"><Todo>{b.todo}</Todo></p>;
  if (b.p) {
    if (!Array.isArray(b.p)) return <p>{b.p}</p>;
    return (
      <p>
        {b.p.map((part, i) => (typeof part === 'string' ? part : (
          <a key={i} href={part.link.href} target="_blank" rel="noopener">{part.link.text}<span className="visually-hidden"> (opens in a new tab)</span></a>
        )))}
      </p>
    );
  }
  if (b.h) return <h3 className="case__h3">{b.h}</h3>;
  if (b.list) return <ul className="case__list">{b.list.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (b.ol) return <ol className="case__list case__ol">{b.ol.map((x) => <li key={x}>{x}</li>)}</ol>;
  // A group inside a section (e.g. "For the company"), listed in the guide too.
  if (b.sub) return <h3 className="case__group" id={b.sub.id}>{b.sub.title}</h3>;
  if (b.quote) {
    return (
      <figure className="case__quote">
        <blockquote><p>{b.quote}</p></blockquote>
        {b.source && <figcaption className="facts">{b.source}</figcaption>}
      </figure>
    );
  }
  if (b.stats) {
    return (
      <ul className="stats">
        {b.stats.map((s) => (
          <li key={s.value} className="stat">
            <span className="stat__value">{s.value}</span>
            <span className="stat__text">{s.text}</span>
            <span className="facts stat__source">{s.source}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (b.items) {
    return (
      <ul className="items">
        {b.items.map((it) => (
          <li key={it.title} className="item">
            <p className="item__title">{it.title}</p>
            <p>{it.text}</p>
          </li>
        ))}
      </ul>
    );
  }
  if (b.profiles) {
    return (
      <div className="profiles">
        {b.profiles.map((p) => <Profile key={p.name} p={p} />)}
      </div>
    );
  }
  if (b.table) {
    return (
      <div className="case__table-wrap">
        <table className="case__table">
          <caption className="facts">{b.table.caption}</caption>
          <thead><tr>{b.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>
            {b.table.rows.map((row) => (
              <tr key={row[0]}>{row.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (b.decision) {
    const d = b.decision;
    return (
      <article className="decision">
        {d.level === 4 ? <h4 className="case__h3">{d.title}</h4> : <h3 className="case__h3">{d.title}</h3>}
        {d.screen && <Screen screen={d.screen} />}
        {d.screens && (
          <div className="decision__screens">
            {d.screens.map((sc) => <Screen key={sc.label || sc.src} screen={sc} />)}
          </div>
        )}
        {d.what && <p>{d.what}</p>}
        {d.why && <p><span className="facts case__label">Why</span>{d.why}</p>}
        {d.draft && <Draft>{d.draft}</Draft>}
        {d.blocks?.map((b, i) => <Block key={i} block={b} />)}
      </article>
    );
  }
  if (b.steps) {
    return (
      <ol className="steps">
        {b.steps.map((s) => (
          <li key={s.title} className="step">
            <p className="item__title">{s.title}</p>
            <p>{s.text}</p>
            {s.note && <p className="facts step__note">{s.note}</p>}
          </li>
        ))}
      </ol>
    );
  }
  if (b.phases) {
    return (
      <ul className="items">
        {b.phases.map((ph) => (
          <li key={ph.name} className="item">
            <p className="facts case__label">{ph.name}</p>
            <p className="item__title">{ph.title}</p>
            <p>{ph.text}</p>
          </li>
        ))}
      </ul>
    );
  }
  if (b.screen) return <Screen screen={b.screen} />;
  if (b.draft) return <Draft label={b.label}>{b.draft}</Draft>;
  if (b.note) return <p className="facts case__note">{b.note}</p>;
  if (b.figures) return <Figures items={b.figures} />;
  // Frames in a grid: two by two on a laptop, one under another on a phone.
  if (b.grid) {
    return (
      <div className="case__grid" role="group" aria-label={b.label}>
        {b.grid.map((sc) => <Screen key={sc.label} screen={sc} />)}
      </div>
    );
  }
  // Two frames side by side on a laptop, one under the other on a phone, each with its caption.
  if (b.pair) {
    return (
      <div className="case__pair">
        {b.pair.map((sc) => <Screen key={sc.label} screen={sc} />)}
      </div>
    );
  }
  if (b.draftList) return <DraftList items={b.draftList} />;
  return null;
}
