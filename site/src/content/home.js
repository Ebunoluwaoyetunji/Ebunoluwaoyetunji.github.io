// Every word and image on the homepage. Edit freely; layout lives in the
// components. Anything set to `{ todo: '...' }` shows on the page as
// "TODO (Ebun): ...".
//
// Sources: the Fileo, Boulote and Folowr case studies and the current
// homepage. Em dashes were removed and some long sentences split. The
// experience dates and roles are the ones Ebun gave on 2026-10-09.
//
// ADDING A REAL SCREEN (project or gallery):
//   1. Put the image file in site/public/images/ (for example
//      site/public/images/fileo/dashboard.png). PNG, JPG or WebP.
//   2. In the screen's entry below, set src to its path from /images,
//      for example src: '/images/fileo/dashboard.png'.
//   3. Write alt: one sentence on what the screen shows.
//   4. Optional: width and height in px, so the page does not jump while it loads.
// Up to three phone screens from the same flow can share one frame. Instead
// of src and alt, give a list:
//   images: [
//     { src: '/images/fileo/step-1.png', alt: '...' },
//     { src: '/images/fileo/step-2.png', alt: '...' },
//   ],
// Every frame is the same wide canvas. Phone screens sit centred in it;
// desktop screens fit its width. Nothing is cropped or stretched.
// Project screens get Glass by themselves. The gallery picks them up by itself.

import S, { fileoFrame } from './fileo-screens.js';
import { F as B } from './boulote-screens.js';
import { F as FL } from './folowr-screens.js';
import { F as SN } from './sporting-news-screens.js';

const email = 'oyetunjiebunoluwa90@gmail.com';
const linkedin = 'https://www.linkedin.com/in/ebunoluwaoyetunji/';

export default {
  name: 'Ebunoluwa Oyetunji',
  role: 'Product designer', // shown after the name in the top bar
  email,
  linkedin,
  // To add the CV: put the file at site/public/cv.pdf, then replace this line
  // with: cv: { href: '/cv.pdf' },
  cv: { todo: 'CV file' },

  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
  ],

  // The hero is only the heading (and the butterfly).
  hero: {
    lines: ['Good design is', 'clear thinking', 'made visible.'],
  },

  // Selected work, in this order.
  projects: [
    {
      id: 'fileo',
      name: 'Fileo',
      href: '/fileo/',
      line: 'An AI-native tax filing service for Nigerian freelancers and remote workers.',
      role: 'Product designer, solo. Research, strategy, design.',
      year: '2026',
      status: 'Personal project',
      highlights: [
        'Conversational onboarding, one question at a time.',
        'The user reviews and approves the return before anything is submitted.',
        'A hard gate on unresolved flagged transactions.',
      ],
      // The same frame as the first one on the Fileo case study, so the page change is seamless.
      screen: fileoFrame('Fileo onboarding, home and review screens', S.onboarding1, S.homeInProgress, S.reviewSummary),
      // Gentle Glass on the real screens. (Pen notes stay off; if they come
      // back on this frame, Glass must go, or the notes would not line up.)
      // Pen notes for the new Fileo screen. They need redrawing for it. Add
      // entries like { marks: 'fileo/x-marks.svg', words: 'fileo/x-words.svg',
      // sentence: '...' } and set pen.showNotes to true in motion.js.
      notes: [],
    },
    {
      id: 'boulote',
      name: 'Boulote',
      href: '/boulote/',
      line: 'A professional networking and hiring platform connecting companies with skilled professionals for jobs and projects.',
      role: 'UI/UX Designer (Freelance). Sole designer across web and mobile.',
      year: 'Aug to Oct 2025',
      status: 'Live, in testing',
      highlights: [
        'Three connected experiences, each built around what that user actually needs to do.',
        'I mapped the ecosystem by hand before designing a single screen.',
        'Clear statuses and updates, so users always understand what happens next.',
      ],
      screen: B.adminAiReview, // the same frame as the top of the Boulote case study
    },
    {
      id: 'sporting-news',
      name: 'Sporting News admin',
      href: '/sporting-news/',
      line: 'Taking a print sports magazine online, with an admin dashboard to run the business behind it.',
      role: 'UI/UX Designer (Contract).',
      year: 'Aug 2025 to present',
      status: 'Live',
      highlights: [
        'The magazine had no back office. I designed one.',
        'Tips and predictions in one place.',
        'Money you can see but not change.',
      ],
      screen: SN.dashboard, // the same frame as the top of the Sporting News case study
    },
    {
      id: 'folowr',
      name: 'Folowr',
      href: '/folowr/',
      line: 'A scheduling and client-management platform for service businesses: coaches, salons, consultants.',
      role: 'UI/UX Designer (Sole Designer).',
      year: 'Aug 2025 to present',
      status: 'Live',
      highlights: [
        'Scheduling sits at the centre of the provider experience.',
        'The booking flow trims client effort down to just what is necessary.',
        'I designed around the different jobs of providers, staff and clients, not one generic dashboard.',
      ],
      screen: FL.dashboardWeek, // the same frame as the top of the Folowr case study
    },
  ],

  // Gallery wall: 8 frames in one row. Each is an empty frame until it gets a
  // src (or images). The wall label under each frame shows `what`, the
  // project and the year, and links to the case study.
  gallery: {
    title: 'Gallery',
    items: [
      { project: 'Fileo', year: '2026', what: 'Review screen', href: '/fileo/', ...fileoFrame('Fileo review screen tabs', S.reviewSummary, S.reviewCalculation, S.reviewDocuments) },
      { project: 'Fileo', year: '2026', what: 'Home in three states', href: '/fileo/', ...fileoFrame('Fileo home in three states', S.homeNotStarted, S.homeInProgress, S.homeCompleted) },
      { project: 'Boulote', year: '2025', what: 'Ongoing jobs', href: '/boulote/', ...B.professionalJobsOngoing },
      { project: 'Fileo', year: '2026', what: 'Onboarding', href: '/fileo/', ...fileoFrame('Fileo onboarding screens', S.onboarding1, S.onboarding2, S.onboarding3) },
      { project: 'Folowr', year: '2025', what: 'Dashboard with metrics and a weekly calendar', href: '/folowr/', ...FL.dashboardWeek },
      { project: 'Boulote', year: '2025', what: 'AI review, admin', href: '/boulote/', ...B.adminAiReview },
      { project: 'Fileo', year: '2026', what: 'Review, before and after', href: '/fileo/', ...fileoFrame('Fileo review screen, before and after', S.reviewBeforeAfter) },
      { project: 'Fileo', year: '2026', what: 'Home, before and after', href: '/fileo/', ...fileoFrame('Fileo home, before and after', S.homeBeforeAfter) },
      { project: 'Folowr', year: '2025', what: 'Client booking page', href: '/folowr/', ...FL.clientBooking },
      { project: 'Boulote', year: '2025', what: 'Professionals, company view', href: '/boulote/', ...B.companyProfessionals },
      { project: 'Sporting News admin', year: '2025', what: 'Transaction details', href: '/sporting-news/', ...SN.transactionDetails },
    ],
  },

  // Journey: stops along the line, in this order. Dates and roles are the ones
  // Ebun gave on 2026-10-09. "One line on the work" comes from the case
  // studies and the current homepage.
  journey: {
    title: 'Journey',
    stops: [
      { date: '2018 to 2024', role: 'B.Tech Food Science and Technology, FUTA', line: 'Where I started.' },
      { date: '2022', role: 'Started learning design.' },
      { date: 'Dec 2024 to Feb 2026', role: 'UI/UX Designer, Nexapay', line: 'KYC and account upgrade flow.' },
      { date: 'Aug to Oct 2025', role: 'UI/UX Designer (Freelance), Boulote', line: 'Sole designer across web and mobile.' },
      { date: 'Aug 2025 to present', role: 'UI/UX Designer', line: 'Sporting News admin and Folowr.' },
      { date: '2026', role: 'Fileo, personal project', line: 'An AI-native tax filing service for Nigerian freelancers and remote workers.' },
      { date: 'Now', line: "I'm currently open to remote roles where design is taken seriously and the work actually ships." },
    ],
  },

  // About, from the current homepage.
  about: {
    then: [
      "I'm a self-taught UI/UX designer based in Lagos, Nigeria. My background is in Food Science and Technology. That sounds unrelated, but it gave me something useful: a habit of working from evidence.",
      "In that degree, you don't guess. You design an experiment, collect data, analyse it, and draw conclusions. I do the same thing before I design a screen. I graduated with a 4.30 CGPA.",
    ],
    now: [
      "Over the past two years I've worked on live products in fintech, scheduling, luxury branding, and AI-powered talent platforms. Each one taught me something different about how people interact with digital products. And how often the real problem isn't the one you were originally briefed on.",
    ],
  },

  // Footer: four big words, then a small row.
  footer: {
    // Each note: its file in src/content/footer-notes/, which side of the word
    // it sits on, its tilt in degrees, and how far above (minus) or below
    // (plus) the word's middle it sits, as a share of the word size.
    words: [
      { label: 'Work', href: '#work', note: { file: 'work.svg', side: 'left', angle: -6, dy: -0.3 } },
      { label: 'Gallery', href: '#gallery', note: { file: 'gallery.svg', side: 'right', angle: -4, dy: -0.26 } },
      { label: 'About', href: '#about', note: { file: 'about.svg', side: 'left', angle: 4, dy: 0.08 } },
      { label: 'Contact', href: `mailto:${email}`, note: { file: 'contact.svg', side: 'right', angle: 3, dy: 0.28 } },
    ],
  },
};
