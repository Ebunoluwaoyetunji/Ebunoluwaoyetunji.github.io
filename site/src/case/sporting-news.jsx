import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import CaseStudy from './CaseStudy.jsx';
import sportingNews from '../content/case-studies/sporting-news.js';
import '../styles.css';
import '../lib/paper.js'; // TEMPORARY: background options

// Render at once (the script blocks the first paint, see sporting-news/index.html),
// so the page change from the homepage finds the top frame there.
const root = createRoot(document.getElementById('root'));
flushSync(() => root.render(
  <React.StrictMode>
    <CaseStudy study={sportingNews} />
  </React.StrictMode>,
));
