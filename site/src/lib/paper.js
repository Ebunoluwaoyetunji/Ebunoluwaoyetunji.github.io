// TEMPORARY: page background options, to compare until Ebun picks one.
// ?paper=warm (default), ?paper=stone, ?paper=mist, ?paper=white (the old pure white).
// When she picks: set --paper in styles.css, delete this file and its imports
// (main.jsx, case/fileo.jsx).
const tones = {
  warm: '#F8F6F1', // warm paper, just off white
  stone: '#F2F0EA', // a little deeper and warmer
  mist: '#F3F5F2', // cool, a touch of Fileo green
  white: '#FFFFFF',
};

const pick = new URLSearchParams(location.search).get('paper');
if (tones[pick]) document.documentElement.style.setProperty('--paper', tones[pick]);
