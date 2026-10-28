import CaseStudy from './CaseStudy.jsx';
import folowr from '../content/case-studies/folowr.js';
import { loadSignposts, signpostsOf } from '../content/signposts/index.js';
import { later, start } from '../lib/start.jsx';
import '../styles.css';
import '../lib/paper.js'; // TEMPORARY: background options

// The page is pre-rendered (folowr/index.html): the scripts take over the page; once the
// page has loaded, the Full read's signposts and GSAP (which draws them) download quietly.
start(<CaseStudy study={folowr} />).then(() => later(() => {
  // Both optional: if a download fails or the visitor leaves, nothing breaks.
  loadSignposts(signpostsOf(folowr)).catch(() => {});
  import('gsap').catch(() => {}); // ready before the first signpost comes into view, so it draws at once
}));
