import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import CaseStudy from './CaseStudy.jsx';
import folowr from '../content/case-studies/folowr.js';
import '../styles.css';
import '../lib/paper.js'; // TEMPORARY: background options

// Render at once (the script blocks the first paint, see folowr/index.html),
// so the page change from the homepage finds the top frame there.
const root = createRoot(document.getElementById('root'));
flushSync(() => root.render(
  <React.StrictMode>
    <CaseStudy study={folowr} />
  </React.StrictMode>,
));
