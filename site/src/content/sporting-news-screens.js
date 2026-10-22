// The Sporting News frames: every screen place in the case study, with its
// label and the PNG file it expects (names from sporting-news-draft.md,
// version 3). Five screens, on purpose; the public site is a link, not a screen.
//
// Screens go in public/images/sporting-news/ as WebP, quality 92, full size,
// never resized (from Ebun's exports, 2x), the same way as Boulote's:
//   <name>.webp      the whole screen (opens full and scrollable from a frame)
//   <name>-top.webp  the top of it, cut at the frame's 16:10 shape, shown in the frame.
// All five are in, from Downloads/Sporting News 2 (21 Oct 2026; that folder unchanged).

// How Sporting News frames look (each project sets its own): a soft neutral
// grey-green as the mount, the same thinner margin as Boulote (the screen
// fills 92% of the frame width), and a thin light border and soft shadow on
// each screen.
export const FRAME = { tint: '#EEF1EE', mountSize: 0.025, edge: true };

// Each screen: [full width, full height, height shown in the frame, alt text].
const SCREENS = {
  'admin-tip-details': [2880, 2278, 1800, 'Sporting News admin, tip details for a Weekend VIP Tip, Perm 3: published, with its seller, the totals, and a table of its predictions with the match, market, odds, status, purchases and revenue, and an Add prediction button.'],
  'admin-user-details': [2880, 2622, 1800, "Sporting News admin, user details: a user's information, their seller level, tips posted and total sales with Change seller level, their buyer activity, and Edit user, Suspend and Delete Account buttons."],
  'admin-transaction-details': [2880, 2478, 1800, 'Sporting News admin, Transactions with a transaction open beside the list: its status and date, the buyer, the prediction bought, the payment method and reference, and a summary with the platform fee and what the seller earns, with Download Receipt.'],
  'admin-post-tip': [2880, 4944, 1800, 'Sporting News admin, Create a new listing: the tip design upload, assigning the tip to a seller, the game information, tip details, a price set by the platform, publication status, and a summary before Publish Tip.'],
  'admin-dashboard': [2880, 3646, 1800, 'Sporting News admin Dashboard: totals for tips posted, revenue, predictions and sales, charts of predictions against sales and of revenue, top predictions by sales, high and low sales predictions, recent activity and quick actions.'],
};

const screen = (name) => {
  const s = SCREENS[name];
  if (!s) return null;
  const [width, height, shown, alt] = s;
  return {
    src: shown < height ? `/images/sporting-news/${name}-top.webp` : `/images/sporting-news/${name}.webp`,
    width,
    height: shown,
    alt,
    full: { src: `/images/sporting-news/${name}.webp`, width, height },
  };
};

// A frame: its label, and the PNG name it expects. Every frame is the same wide shape.
function frame(label, expects, extra = {}) {
  const names = [].concat(expects);
  const images = names.map(screen);
  const look = { fill: FRAME.tint, mountSize: FRAME.mountSize, edge: FRAME.edge };
  return images.every(Boolean) ? { label, images, expects: names, ...look, ...extra } : { label, expects: names, ...look, ...extra };
}

export const F = {
  tipDetails: frame('Sporting News tip details', 'admin-tip-details'),
  userDetails: frame('Sporting News user details', 'admin-user-details'),
  transactionDetails: frame('Sporting News transaction details', 'admin-transaction-details'),
  postTip: frame('Sporting News post a tip', 'admin-post-tip'),
  dashboard: frame('Sporting News dashboard', 'admin-dashboard'),
};
