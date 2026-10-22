import WordStack from '../motion/WordStack.jsx';
import FooterNotes from '../motion/FooterNotes.jsx';
import home from '../content/home.js';
import look from '../content/look.js';
import motion from '../content/motion.js';

// The black, full-screen footer: four big words with Ebun's handwritten
// notes beside them, then Email and LinkedIn. Shared by every page.
// The CV link is left out until Ebun adds her CV (22 Oct 2026).
// base: '' on the homepage, '/' elsewhere, so #work becomes /#work.
// effects: Spread and the drawing notes (mouse and motion allowed).
export default function SiteFooter({ effects, base = '' }) {
  const words = home.footer.words.map((w) => (w.href.startsWith('#') ? { ...w, href: base + w.href } : w));
  return (
    <footer className="footer">
      <nav className="footer__menu" aria-label="Footer">
        <WordStack words={words} settings={motion.wordSpread} active={effects} font={look.display} />
        <FooterNotes words={words} spread={motion.wordSpread} settings={motion.footerNotes} animate={effects} />
      </nav>
      <ul className="facts footer__small">
        <li><a href={`mailto:${home.email}`}>Email</a></li>
        <li><a href={home.linkedin}>LinkedIn</a></li>
      </ul>
    </footer>
  );
}
