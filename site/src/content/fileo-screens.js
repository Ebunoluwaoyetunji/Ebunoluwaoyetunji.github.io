// The real Fileo screens: crops of Ebun's LinkedIn images (Fileo's marketing
// folder), cut from the original PNGs down to the phone and its shadow, plus
// two app captures put in the same brand frame (select-platforms,
// income-summary). Where the faint "O" reached into a crop, only the
// background and shadow were painted flat; the phone and screen are untouched.
// Files: public/images/fileo/app/<name>.webp at full size (WebP quality 92).
// One size only, so a laptop always loads the full-size file.
//
// Videos: public/videos/fileo/<name>.mp4 (H.264, cropped the same way), with
// a poster. All data in the images and videos is made up.
//
// fileoFrame() makes a frame of up to three of these on the brand background
// (#ECF2EE), the phones all the same height (about 86% of the inside of the
// frame). On small screens it shows one phone at a time, to swipe.

export const FILEO_FILL = '#ECF2EE';

// Single-phone crops are 562 x 1089 with the phone 943px tall (87%);
// the before and after crops are 1077 x 1116 with two 891px phones (80%).
const phone = (name, alt) => ({ src: `/images/fileo/app/${name}.webp`, width: 562, height: 1089, phoneShare: 943 / 1089, alt });
// split: on phones, each half (one phone) is its own slide.
const pair = (name, alt) => ({ src: `/images/fileo/app/${name}.webp`, width: 1077, height: 1116, phoneShare: 891 / 1116, split: true, alt });
const video = (name, width, height, phoneShare, description) => ({
  video: `/videos/fileo/${name}.mp4`,
  poster: `/videos/fileo/${name}-poster.webp`,
  width,
  height,
  phoneShare,
  description,
});

const S = {
  onboarding1: phone('onboarding-1', 'Fileo onboarding, screen 1: "File Your Taxes Without the Stress", with a Create Account button.'),
  onboarding2: phone('onboarding-2', 'Fileo onboarding, screen 2: "File in Four Simple Steps".'),
  onboarding3: phone('onboarding-3', 'Fileo onboarding, screen 3: "Your Data Is Safe".'),
  homeInProgress: phone('home-in-progress', 'Fileo Home with a return in progress: step 3 of 5, "Add your deductions", estimated tax of 669,248 naira, and a Helpful to know row.'),
  homeNotStarted: phone('home-not-started', 'Fileo Home before filing starts: "Start your 2025 return", 5 steps, due 31 March 2026, with a Start filing button.'),
  homeCompleted: phone('home-completed', 'Fileo Home after filing: "You\'re done for 2025", submitted 12 February 2026, with a View receipt button and the 2024 return under Past years.'),
  homeBeforeAfter: pair('home-before-after', 'Fileo Home before and after the redesign: the old Home with quick stats and recent activity, next to the new Home with the next-step filing card.'),
  reviewSummary: phone('review-summary', 'Fileo return review, Summary tab: tax due of 669,248 naira, deductions saved 115,392 naira, taxable income, effective rate and income sources, with Approve and submit.'),
  reviewCalculation: phone('review-calculation', 'Fileo return review, Calculation tab: the working from total income through reliefs and taxable income to the tax band and tax due.'),
  reviewDocuments: phone('review-documents', 'Fileo return review, Documents tab: the uploaded statements and receipts, each with a green check.'),
  reviewTaxBands: phone('review-tax-bands', 'Fileo\'s "How tax bands work" sheet: the 2025 tax bands from 7% to 24%, with the user\'s band marked and their breakdown below.'),
  reviewBeforeAfter: pair('review-before-after', 'Fileo\'s review screen before and after: the first version, one long screen with savings and tax side by side, next to the new Summary tab.'),
  selectPlatforms: phone('select-platforms', 'Fileo filing step: "Select all the platforms you received payments from", with Upwork and Paystack chosen from grids of platforms.'),
  incomeSummary: phone('income-summary', 'Fileo filing step: "Review your income", with the amounts read from the Paystack and Upwork statements for the user to confirm.'),
  // Rendered from Fileo's web build with a made-up backend (no real account):
  // two flagged items, each only a date, an amount and a reference code.
  flaggedTransactions: phone('flagged-transactions', 'Fileo filing step: "Review your income", Flagged Transactions marked "Needs your review". A 60,000 naira payment on the Paystack statement and a 150,000 naira transfer on the Guaranty Trust Bank statement, each shown only as a date, amount and reference code, with the question "Is this income?" and answers from Income to Other, not income. The Complete transaction review button stays disabled.'),
  // The phone in the demo is 1396px tall in a 1638px crop.
  demo: video('fileo-demo', 884, 1638, 1396 / 1638, 'A 19 second screen recording of Fileo with made-up data: the splash screen, onboarding, Home, the income summary, the return review, and the confirmation.'),
  reviewTabs: video('review-tabs', 562, 1088, 943 / 1088, 'A screen recording of Fileo\'s return review: it switches from the Summary tab to the Calculation tab, scrolls through the working, then shows the Documents tab and returns to Summary.'),
};

// A frame of up to three of these, side by side, on the brand background.
export const fileoFrame = (label, ...images) => ({ label, images, fill: FILEO_FILL, layout: 'phones' });

export default S;
