import CaseStudy from './CaseStudy.jsx';
import sportingNews from '../content/case-studies/sporting-news.js';
import { loadSignposts, signpostsOf } from '../content/signposts/index.js';
import { later, start } from '../lib/start.jsx';
import '../styles.css';
import '../lib/paper.js'; // TEMPORARY: background options

// The page is pre-rendered (sporting-news/index.html): the scripts take over the page; once the
// page has loaded, the Full read's signposts download in the background.
start(<CaseStudy study={sportingNews} />).then(() => later(() => loadSignposts(signpostsOf(sportingNews))));
