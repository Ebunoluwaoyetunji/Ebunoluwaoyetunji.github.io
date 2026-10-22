// Every speed and strength setting for the site, in one file.
//
// "Follow", "settle" and "lag" are how much of the remaining distance is
// covered each frame (0 to 1): higher is snappier, lower is softer.

const spread = {
  radius: 2.3, // how far either side of the cursor letters react, in font sizes
  distance: 0.16, // how far letters move at most, as a share of the font size
  rise: 0.07, // how quickly the gap opens beside the cursor (lower = sharper gap)
  follow: 0.2, // how quickly letters move apart
  settle: 0.07, // how quickly letters return when the mouse leaves the line
  copies: 3, // faded copies trailing each letter
  copyLag: [0.11, 0.065, 0.04], // how slowly each copy catches up (lower = longer trail)
  copyOpacity: 0.4, // opacity of the strongest copy while moving
  copyBlur: 0.012, // softness of copies, as a share of the font size
  copyColour: 'accent', // 'accent' or 'text'
};

export default {
  // A. Spread, sentence version: the hero line.
  // As big as it can go while the whole sentence fits in one laptop screen,
  // leaving a little room above the first line for the butterfly.
  // touchHold: on touch screens, seconds the letters stay parted after the finger lifts.
  heroSpread: { ...spread, maxScreenShare: 0.7, maxFontSize: 320, touchHold: 0.4 },

  // A. Spread, on a case study's project name (one word, so a smaller share of the screen).
  caseTitle: { ...spread, maxScreenShare: 0.3, maxFontSize: 280, touchHold: 0.4 },

  // A. Spread, word version: the four footer words.
  wordSpread: {
    gap: 0.09, // extra space between letters when open, as a share of the font size
    openTime: 0.45, // seconds to ease open
    closeTime: 0.55, // seconds to ease closed
    glow: 0.35, // strength of the soft vermilion glow behind the open word (0 to 1)
    glowSize: 0.12, // glow softness, as a share of the font size
    maxScreenShare: 0.17, // each word's height as a share of the window height
    maxFontSize: 190, // px
  },


  // C. Pen notes (Fileo screen only). Speeds in screen px per second, pauses in seconds.
  pen: {
    showNotes: false, // off until the new Fileo screen is in and the notes are redrawn for it
    markSpeed: 750, // circles, arrows, underlines
    wordSpeed: 950, // handwriting
    shortestStroke: 0.1, // no stroke is quicker than this
    longestStroke: 0.9, // no stroke is slower than this
    pauseBetweenMarks: 0.12, // pen lifts between strokes of a mark
    pauseBetweenLetters: 0.015,
    pauseBeforeWords: 0.22, // after the mark, before writing
    pauseBetweenNotes: 0.4,
    sentenceFade: 0.35, // typed sentence fades in after its note is drawn
    minStrokeWidth: 1.5, // screen px. Thinner strokes are thickened to this when a screen is shown small.
    heroDelay: 0.5, // only used if notes are on a screen that draws on page load
    scrollStart: 'top 65%', // notes start drawing when the screen's top reaches 65% down the window
  },

  // F. Butterfly in the hero.
  butterfly: {
    option: 2, // which drawing: 1, 2 or 3 (Ebun picked 2 on 2026-10-10)
    size: 0.4, // height, as a share of the heading's font size (about one letter)
    gap: 0, // space between its feet and the top of the letter, in butterfly sizes
    speed: 200, // px per second in flight
    minFlight: 1.8, // seconds, the shortest flight
    maxFlight: 3.0, // seconds, the longest flight (long journeys go a little faster)
    flyInDelay: 0.9, // seconds after the heading appears before it flies in
    lift: 0.9, // how high its flight arcs, in butterfly sizes
    restFlap: 3.6, // seconds for one slow open and close of the wings while resting
    flyFlap: 0.55, // seconds for one wingbeat in flight
    near: 1.7, // the mouse can come this close (in butterfly sizes) before it lifts off
    cooldown: 0.9, // seconds after landing before it can be disturbed again
    partLift: 0.03, // lifts off if the letter under it moves more than this (share of the font size)
    maxCover: 0.12, // a resting spot is skipped if the butterfly would hide more than this share of another letter
    // Letters it may rest on, in the heading. It lands on the first one first.
    spots: [
      { word: 'design', letter: 'd' },
      { word: 'Good', letter: 'G' },
      { word: 'Good', letter: 'd' },
      { word: 'is', letter: 'i' },
      { word: 'clear', letter: 'l' },
      { word: 'thinking', letter: 'h' },
      { word: 'thinking', letter: 'k' },
      { word: 'made', letter: 'd' },
      { word: 'visible.', letter: 'b' },
      { word: 'visible.', letter: 'l' },
    ],
  },

  // G. Footer notes: Ebun's handwriting beside the four footer words.
  footerNotes: {
    scale: 0.24, // note size: screen px per scanned px, for every 100px of footer word size
    clearance: 0.12, // gap between a note and its word when the word is fully open, as a share of the word size
    speed: 680, // pen speed, screen px per second
    shortestStroke: 0.05, // seconds
    longestStroke: 0.7, // seconds
    pauseStroke: 0.035, // pen lifts between strokes
    pauseNote: 0.4, // short pause between notes
    startWhenVisible: 0.35, // share of the footer on screen before the notes start drawing
  },

  // G2. Signposts: Ebun's handwriting under the case study turning points
  // (src/content/signposts/, drawn by src/motion/Signpost.jsx).
  signposts: {
    size: 0.022, // rem per traced px: one-line signposts come out about two lines of body text tall
    speed: 680, // pen speed, screen px per second (as the footer notes)
    shortestStroke: 0.05, // seconds
    longestStroke: 0.7, // seconds
    pauseStroke: 0.035, // pen lifts between strokes
    startWhenVisible: 0.8, // share of the signpost on screen before it starts drawing
  },

  // H. Hero piano: each heading letter plays one note as the mouse passes over
  // it, once the visitor turns sound on. Recorded Steinway notes in
  // public/sounds/piano/ (made by scripts/make-piano-notes.mjs).
  piano: {
    notes: ['C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5'], // a 5-note scale (C D E G A), low to high
    lineStart: [2, 1, 0], // the note each heading line starts on (top line a little higher)
    volume: 0.55, // overall loudness, 0 to 1
    runVolume: 0.7, // loudness of notes in a quick sweep, as a share of a single note
    runGap: 0.09, // seconds: notes closer together than this count as a quick sweep
    runSpacing: 0.018, // seconds between letters a fast sweep jumped over
    maxSkipped: 4, // most jumped-over letters filled in at once
    humanise: 0.12, // small random change in loudness per note, like a real hand
    fade: 0.08, // seconds to fade a note that is struck again or cut short
    maxNotes: 10, // most notes ringing at once
    slideStart: 10, // touch: px a finger must move sideways before a slide plays (less is a tap; up/down is a scroll)
  },

  // J. The guide on case study pages (src/case/Guide.jsx): the pen line in
  // the margin that draws as you read.
  guide: {
    penAt: 0.35, // where you are reading: this share of the window height from the top
    wideFrom: 900, // px: from this width the guide sits in the margin; below it, a bar at the top
    wobble: 3, // px, the hand-drawn wobble of the line
    tail: 28, // px the line runs on past the last dot
  },

  // D. Gallery wall: the page holds while the wall slides sideways.
  gallery: {
    scrollLength: 2.6, // extra scrolling to get past the wall, in window heights
    height: 0.46, // height of every frame, as a share of the window height
    gap: 0.07, // space between frames, as a share of the window width
    dwell: 0, // 0 = a steady walk; up to 0.6 = each frame pauses in the middle
    smooth: 0.2, // how closely the wall follows the scroll (lower = smoother, more lag)
  },

  // E. Journey: the vermilion line draws itself as the page scrolls.
  journey: {
    penAt: 0.62, // the line is drawn down to this point in the window (0 = top, 1 = bottom)
    wobble: 22, // px the line bends between stops (0 = straight)
    strokeWidth: 2.2, // px
    oneSideBelow: 760, // px: narrower than this, all stops sit on one side of the line
    phoneLineX: 10, // px from the left edge for the line when stops sit on one side
  },
};
