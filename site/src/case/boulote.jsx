import CaseStudy from './CaseStudy.jsx';
import boulote from '../content/case-studies/boulote.js';
import { loadSignposts, signpostsOf } from '../content/signposts/index.js';
import { later, start } from '../lib/start.jsx';
import '../styles.css';
import '../lib/paper.js'; // TEMPORARY: background options

// The page is pre-rendered (boulote/index.html): the scripts take over the page; once the
// page has loaded, the Full read's signposts download in the background.
start(<CaseStudy study={boulote} />).then(() => later(() => loadSignposts(signpostsOf(boulote))));
