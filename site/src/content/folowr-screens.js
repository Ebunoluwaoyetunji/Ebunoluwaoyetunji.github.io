// The Folowr frames: every screen place in the case study, with its label and
// the PNG file(s) it expects (names from folowr-draft.md, version 8).
//
// Screens go in public/images/folowr/ as WebP, quality 92, full size, never
// resized (from Ebun's exports, 2x), the same way as Boulote's:
//   <name>.webp      the whole screen (opens full and scrollable from a frame)
//   <name>-top.webp  desktop screens only: the top, cut at the frame's 16:10
//                    shape, shown in the frame.
// Phone screens: the frame shows a phone-shaped part (393 x 852 at 2x),
// centred and as tall as the frame, like Fileo's phones; the frame keeps the
// same wide shape as every other. mobile-home is that shape already;
// mobile-staff shows its top (<name>-top.webp); mobile-client-flag shows its
// bottom (<name>-bottom.webp), where the "Flag this client?" sheet is. The
// whole screen still opens full from the frame.
// Exports from Downloads/Folowr 2 (18 Oct 2026). Three had other names there:
// dashboard.png is web-dashboard-week, Availability.png is availability, and
// "add services.png" is add-service. A frame whose file is not in shows empty. To add one: convert the PNG that
// way and add it to SCREENS with its sizes and alt text.
// Ebun's hand-drawn flows (public/images/folowr/flows/) are figures, not frames.

// How Folowr's frames look (each project sets its own): a pale tint of
// Folowr's violet (#7C3AED) as the mount, the same thinner margin as Boulote
// (the screen fills 92% of the frame width), and a thin light border and soft
// shadow on each screen.
export const FRAME = { tint: '#F3EFFB', mountSize: 0.025, edge: true };

// Each screen: [full width, full height, height shown in the frame, alt text, which part: 'top' (default) or 'bottom'].
const SCREENS = {
  'web-dashboard-week': [2880, 2048, 1800, 'Folowr provider dashboard: the calendar in week view, with Day, Week and Month, page views, bookings and likes above it, two appointments in the week, and a New Booking button.'],
  explore: [2880, 3002, 1800, 'Folowr explore page: a search for services or businesses with a location, showing results for Hair in Lagos with a salon card, its rating, price from, location, opening and a Book link.'],
  'booking-page-select-service': [2880, 2668, 1800, "Folowr client booking page for a beauty business: its rating, likes and followers, then Select Service with four services, each with a photo, price, rating and duration, and a Continue button."],
  availability: [2880, 3222, 1800, 'Folowr availability, redesigned: the time zone, a note that changes show on the booking page as soon as they save, and each day with typed start and end times, Add time block and Copy to all days.'],
  'add-service': [2880, 4888, 1800, 'Folowr Add New Service: basic information, the service visual with a clients preview, date and time rules for buffers and minimum notice, staff assignment, and payment settings with offline payment, online payment marked Coming soon, and the line clients will see about paying.'],
  'mobile-home': [786, 1704, 1704, 'Folowr mobile home for a provider: a welcome with the bookings today, weekly insights for bookings and page views, a week strip, and the day calendar with appointments, above the bottom bar.'],
  'mobile-client-flag': [786, 2544, 1704, "Folowr mobile client profile with contact details, booking history and a payment summary, and a sheet asking Flag this client?, which says the client will be marked as flagged and can be reviewed or removed anytime, with Flag and Go Back.", 'bottom'],
  'mobile-staff': [786, 1768, 1704, 'Folowr mobile Staff screen: a search, an Add button, and a staff member with Edit and Disable.'],
};

const screen = (name) => {
  const s = SCREENS[name];
  if (!s) return null;
  const [width, height, shown, alt, part = 'top'] = s;
  return {
    src: shown < height ? `/images/folowr/${name}-${part}.webp` : `/images/folowr/${name}.webp`,
    width,
    height: shown,
    alt,
    full: { src: `/images/folowr/${name}.webp`, width, height },
  };
};

// A frame: its label, and the PNG name(s) it expects. extra: e.g. a caption.
function frame(label, expects, extra = {}) {
  const names = [].concat(expects);
  const images = names.map(screen);
  const look = { fill: FRAME.tint, mountSize: FRAME.mountSize, edge: FRAME.edge };
  return images.every(Boolean) ? { label, images, expects: names, ...look, ...extra } : { label, expects: names, ...look, ...extra };
}
// Phone screens: up to three in one frame, like Fileo (one at a time to swipe
// on phones). phoneShare matches look.frame.phoneHeight, so each screen is as
// tall as the inside of the frame.
const phones = (label, ...names) => {
  const f = frame(label, names);
  return f.images ? { ...f, layout: 'phones', images: f.images.map((im) => ({ ...im, phoneShare: 0.86 })) } : f;
};

// Version 8 of the draft: eight screens on purpose, each backing up a decision.
export const F = {
  dashboardWeek: frame('Folowr dashboard, week view', 'web-dashboard-week'),
  explore: frame('Folowr explore', 'explore'),
  mobileHome: phones('Folowr mobile home', 'mobile-home'),
  availability: frame('Folowr availability', 'availability'),
  addService: frame('Folowr add service', 'add-service'),
  flagClient: phones('Folowr flag a client', 'mobile-client-flag'),
  // Hidden (no TODO) if booking-page-select-service.png is ever missing.
  clientBooking: SCREENS['booking-page-select-service'] ? frame('Folowr client booking', 'booking-page-select-service') : { label: 'Folowr client booking', hidden: true },
  mobileStaff: phones('Folowr mobile staff, added after the pushback', 'mobile-staff'),
  availabilityAfter: frame('Folowr availability, after testing', 'availability', { caption: 'The redesigned availability screen. Providers type their own times and copy them to the other days.' }),
};

// Ebun's hand-drawn flows, reused from the old folowr.html (photos of her
// notebook). Checked for personal names on 18 Oct 2026: none. Only the black
// bars around them were trimmed off; the handwriting is untouched.
const flow = (name, caption, alt, width, height) => ({ src: `/images/folowr/flows/${name}.webp`, caption, alt, width, height });
export const flows = [
  flow('staff-flow', 'Manage user / staff flow', "Ebun's hand-drawn user flow for managing billing and users: settings, permissions and owners, inviting a contributor, transferring ownership, and billing with payment information, subscriptions and invoices.", 406, 541),
  flow('clients-flow', 'Clients flow', "Ebun's hand-drawn clients user flow: the client list with export and import, a search bar and add client, the client card, and the client profile view with schedule, edit, print and delete.", 406, 541),
  flow('scheduling-flow', 'Scheduling flow', "Ebun's hand-drawn scheduling flow from home: set up your scheduling page by creating appointment types, setting your availability and custom design, then choose a plan, watch the getting started webinar, and edit your scheduling page.", 599, 340),
  flow('availability-flow', 'Availability flow', "Ebun's hand-drawn availability user flow: calendar, rooms and resources, and global scheduling limits, with blocking off time, setting hours of availability, and limits such as start time intervals, minimum notice and time zone.", 339, 450),
];
