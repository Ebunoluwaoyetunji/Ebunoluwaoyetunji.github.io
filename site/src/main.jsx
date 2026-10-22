import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import App from './App.jsx';
import home from './content/home.js';
import { casePages } from './content/case-studies/index.js';
import { setupFrameTransitions } from './lib/frameTransition.js';
import './styles.css';
import './lib/paper.js'; // TEMPORARY: background options

// Before the first render, so the page change can find its frame.
setupFrameTransitions(casePages, home.projects);

// Render at once (the script blocks the first paint, see index.html), so a
// page change coming back from a case study finds the homepage frames there.
const root = createRoot(document.getElementById('root'));
flushSync(() => root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
));
