import CaseStudy from './CaseStudy.jsx';
import boulote from '../content/case-studies/boulote.js';
import { loadSignposts, signpostsOf } from '../content/signposts/index.js';
import { later, start } from '../lib/start.jsx';
import '../styles.css';
import '../lib/paper.js'; // TEMPORARY: background options

// The page is pre-rendered (boulote/index.html): the scripts take over the page; once the
// page has loaded, the Full read's signposts and GSAP (which draws them) download quietly.
start(<CaseStudy study={boulote} />).then(() => later(() => {
  // Both optional: if a download fails or the visitor leaves, nothing breaks.
  loadSignposts(signpostsOf(boulote)).catch(() => {});
  import('gsap').catch(() => {}); // ready before the first signpost comes into view, so it draws at once
}));
