// Fileo case study words and images. Edit freely. Layout lives in the components.
// Only the "What I designed" block exists so far (prototype).
// Text is taken from the existing case study at /fileo/. Em dashes were
// removed and some long sentences split. No new facts were added.

export default {
  slug: 'fileo',
  title: 'Fileo',

  designed: [
    {
      heading: 'The review screen leads with savings, not the tax bill',
      body: [
        'Before anything is submitted to the revenue service, the user sees a complete, plain-language summary of their return. They must actively approve it. Nothing is submitted without their confirmation.',
        'An earlier version led with only the deductions saved. A design review identified this as potentially misleading. Users might mistake the savings figure for the amount they owed. Leading with only the tax bill would trigger anxiety and potential abandonment. The side-by-side layout shows both numbers at once, with the savings giving the bill context.',
      ],
      screen: {
        src: '/images/fileo/review-390.webp',
        srcSet: '/images/fileo/review-390.webp 390w, /images/fileo/review-780.webp 780w',
        sizes: '(min-width: 700px) 400px, 100vw',
        width: 390,
        height: 955,
        alt: 'Fileo review screen titled Review your tax return. A dark card shows estimated tax savings of 420,000 naira beside estimated tax due of 180,000 naira. Below are rows for income summary and tax calculation, filing information for tax year 2025 in Lagos State, and two full-width buttons: Approve and submit, and I want to make a change.',
      },
      caption: 'Fileo review screen.',
      notes: [
        {
          marks: 'fileo/review-card-marks.svg',
          words: 'fileo/review-card-words.svg',
          sentence: 'Both numbers get equal weight, so the bill comes with context.',
        },
        {
          marks: 'fileo/review-approve-marks.svg',
          words: 'fileo/review-approve-words.svg',
          sentence: 'Nothing is filed until the user approves it.',
        },
        {
          marks: 'fileo/review-change-marks.svg',
          words: 'fileo/review-change-words.svg',
          sentence: 'As big as Approve, but quieter in style.',
        },
      ],
    },
  ],
};
