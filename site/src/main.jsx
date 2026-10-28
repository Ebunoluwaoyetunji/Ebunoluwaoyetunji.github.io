import App from './App.jsx';
import home from './content/home.js';
import { casePages } from './content/case-studies/index.js';
import { setupFrameTransitions } from './lib/frameTransition.js';
import { start } from './lib/start.jsx';
import './styles.css';
import './lib/paper.js'; // TEMPORARY: background options

// Opening a case study names the clicked frame, so it grows into the case
// study's top frame. (Coming back is handled by an inline script in the
// pre-rendered page: src/lib/frameTransition.js, revealScript.)
setupFrameTransitions(casePages, home.projects);

start(<App />);
