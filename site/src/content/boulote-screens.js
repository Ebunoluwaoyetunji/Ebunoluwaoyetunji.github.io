// The Boulote frames: every screen place in the case study, with its label and
// the PNG file(s) it expects (names from boulote-draft.md, version 3).
//
// Ebun's exports (Downloads/Boulote 2, 2x, 12 Oct 2026) are in
// public/images/boulote/ as WebP, quality 92, full size, never resized:
//   <name>.webp      the whole screen (opens full and scrollable from a frame)
//   <name>-top.webp  the top of it, cut at the frame's shape (16:10; phones
//                    at a phone's shape), shown in the frame: fitted to the
//                    frame width, never squashed or stretched.
// A frame whose files are not in yet shows empty with its label. To add one:
// convert the PNG the same way and add it to SCREENS.
// The hand-drawn maps (public/images/boulote/maps/) are figures, not frames.

// How Boulote's frames look (each project sets its own; Fileo's mint is in
// fileo-screens.js): a soft blue-grey (#EEF2F6, toned down from #E0EEF8 on
// 12 Oct 2026; Boulote's blue is #0070C4) as the mount, a
// thinner margin (mountSize 0.025: the screen fills 92% of the frame width,
// same frame shape), and a thin light border and soft shadow on each screen.
export const FRAME = { tint: '#EEF2F6', mountSize: 0.025, edge: true };

// Each screen: [full width, full height, top height, alt text].
const SCREENS = {
  'admin-ai-review': [2880, 3168, 1800, 'Boulote admin, Job Management, AI Review tab: a senior fullstack developer job from TechcorpInc. marked Ready for review, with a 94% average AI match score, 3 professionals found and high urgency, above the AI shortlisted professionals, each with years of experience, projects, success rate, AI match and skills.'],
  'admin-approval-review': [2880, 6038, 1800, 'Boulote admin, Application Review: a professional waiting 4 days for review, with Approve and Reject buttons, a review checklist, their contact details and a professional summary.'],
  'admin-dashboard': [2880, 2854, 1800, 'Boulote Admin Dashboard: totals for professionals, companies, revenue, disputes, jobs posted and quizzes, then notifications marked Urgent or Pending, such as a payment dispute and a new job approval, and recent system activity.'],
  'admin-pending-request': [2880, 2342, 1800, 'Boulote admin, Job Management, Pending Requests tab: job cards with the budget, duration, time submitted and urgency, the skills needed, and View Details and Start AI Shortlisting buttons.'],
  'approve-and-pay': [2880, 3730, 1800, 'Boulote company, Approve payment Request for E-commerce Website Development: the project, the professional and the amount, then the deliverables the professional submitted, with View and Download links.'],
  'company-search-results': [2880, 4134, 1800, 'Boulote company, All professionals: a search, filters for skills, experience, rating and location, and professional cards with their rating, projects completed and recent projects.'],
  'daily-challenge-result': [2880, 2658, 1800, 'Boulote professional, daily challenge result: 8 out of 10, better than 75% of professionals, a 4 day streak with a rating boost, a badge unlocked, and the impact on their profile rating.'],
  'invite-accepted': [2880, 2320, 1800, 'Boulote professional, Invitation Accepted: the acceptance has been sent to the company, with the next steps and their dates, and buttons to go to the dashboard or view all invitations.'],
  'job-invitation': [2880, 2208, 1800, 'Boulote professional, My Jobs, Invitations tab: invitations from TechcorpInc. for E-commerce Website Development, each with the budget, deadline and duration, and Accept Invitation, Decline and View Details buttons.'],
  'no-ai-match': [2800, 2470, 1750, 'Boulote admin, Job Management: a job card marked No AI match, with the AI status No qualified match, the skills required, and a Manual select from Database button.'],
  'professional-home': [2880, 2656, 1800, 'Boulote professional home: a welcome, profile completion at 65% with Add 2 more skills to reach 100%, job invites, quick actions, community highlights, mentorship with Apply to be a mentee, and an empty recent activity.'],
  'professional-jobs-ongoing': [2880, 2320, 1800, 'Boulote professional, My Jobs, Ongoing tab: ongoing projects with their progress, due date and next step, and Submit Work, Chat With Company and Update Progress buttons.'],
  'skill-assessment': [2880, 2254, 1800, 'Boulote skill assessment, question 4 of 6: a sample question with four answers, a Skip button, and a note that the assessment raises visibility to companies.'],
  'skill-assessment-result': [2880, 2294, 1800, 'Boulote skill assessment result: Great Job, You scored 7/10, with Go To Subscription and View Dashboard buttons.'],
  'track-progress': [2880, 3452, 1800, 'Boulote company, project tracking for E-commerce Website Development: progress at 25%, milestones marked Completed with their dates, and the project details with quick actions.'],
  wireframe: [2880, 3202, 1800, 'Wireframe of the Boulote company home: a welcome line, a search for professionals, the subscription status, notifications from the admin and recommended professionals.'],
  'mobile-professional-job-invitations': [786, 2422, 1704, "Boulote on a phone, the professional's My Jobs: an invitation with the budget, deadline and duration, and Accept Invitation, Decline and View Details buttons."],
  'mobile-company-home': [786, 2072, 1704, 'Boulote on a phone, the company home before any hiring: hired professionals, active projects, total spent and reviews all at zero, and Welcome to your Dashboard.'],
  'professional-home-complete': [2880, 2656, 1800, 'Boulote professional dashboard with the profile 100% complete: the profile is now 2.4x more visible to mentors and recruiters, with job invites, quick actions, community highlights, Apply to be a mentee and the ratings from reviews, quizzes and trainings.'],
  'professional-home-mentee-sent': [2880, 3092, 1800, "Boulote professional dashboard after applying to become a mentee: a confirmation over the dashboard says the application has been sent successfully, is under review, and they will be notified when paired with a mentor."],
  'professional-home-mentor': [2880, 3092, 1800, 'Boulote professional dashboard after being chosen as a mentor: a banner says they have been made a mentor and matched with a mentee, above profile completion, job invites, recent activity, the get-started checklist and quick actions.'],
  'profile-under-review': [2880, 2148, 1800, 'Boulote Limited Access page: the account is pending verification. It lists what is currently unavailable, such as browsing and applying for jobs, and what the professional can do now, such as updating their profile, with a Check Status button.'],
  'company-home': [2880, 2940, 1800, 'The final Boulote company home: a welcome, counts for hired professionals, active projects, reviews given and total spent, notifications from the admin, recommended professionals, a box to suggest assessment questions, quick actions and the subscription status.'],
  'company-invite-accepted': [2880, 4506, 1800, 'Boulote company, Invitation Accepted: the professional has accepted and is ready to start, with their rating, the project terms, their contact details, What Happens Next in four steps, and the project timeline.'],
  'mobile-admin-dashboard': [786, 4654, 1704, 'Boulote on a phone, the Admin Dashboard: totals for professionals, companies registered, active jobs and jobs pending AI review.'],
};

const screen = (name) => {
  const s = SCREENS[name];
  if (!s) return null;
  const [width, height, top, alt] = s;
  return {
    src: `/images/boulote/${name}-top.webp`,
    width,
    height: top,
    alt,
    full: { src: `/images/boulote/${name}.webp`, width, height },
  };
};

// A frame: its label, and the PNG name(s) it expects (up to three, side by side).
// extra: e.g. a caption shown under the frame.
function frame(label, expects, extra = {}) {
  const names = [].concat(expects);
  const images = names.map(screen);
  const look = { fill: FRAME.tint, mountSize: FRAME.mountSize, edge: FRAME.edge };
  return images.every(Boolean) ? { label, images, expects: names, ...look, ...extra } : { label, expects: names, ...look, ...extra };
}
// Phone screens: three in one frame, like Fileo (one at a time to swipe on phones).
const phones = (label, ...names) => {
  const f = frame(label, names);
  return f.images ? { ...f, layout: 'phones', images: f.images.map((im) => ({ ...im, phoneShare: 1 })) } : f;
};

export const F = {
  adminAiReview: frame('Boulote admin AI review', 'admin-ai-review'),
  companyProfessionals: frame('Boulote company professionals', 'company-search-results'),
  professionalHome: frame('Boulote professional home', 'professional-home'),
  wireframe: frame('Boulote wireframe, company home', 'wireframe', { caption: 'Wireframe of the company home.' }),
  companyHomeFinal: frame('Boulote company home, final', 'company-home', { caption: 'The final screen.' }),
  // Two desktop screens: each gets its own frame, so each fits the frame width.
  skillAssessment: [frame('Boulote skill assessment', 'skill-assessment'), frame('Boulote skill assessment, result', 'skill-assessment-result')],
  jobInvitations: frame('Boulote job invitations', 'job-invitation'),
  invitationAccepted: frame('Boulote invitation accepted', 'invite-accepted'),
  dailyChallenge: frame('Boulote daily challenge', 'daily-challenge-result'),
  companyInviteAccepted: frame('Boulote company, invite accepted', 'company-invite-accepted'),
  trackProgress: frame('Boulote track progress', 'track-progress'),
  approveAndPay: frame('Boulote approve and pay', 'approve-and-pay'),
  adminDashboard: frame('Boulote admin dashboard', 'admin-dashboard'),
  adminPendingRequest: frame('Boulote admin pending request', 'admin-pending-request'),
  noAiMatch: frame('Boulote no AI match', 'no-ai-match'),
  adminApprovalReview: frame('Boulote admin approval review', 'admin-approval-review'),
  onMobile: phones('Boulote on mobile', 'mobile-professional-job-invitations', 'mobile-company-home', 'mobile-admin-dashboard'),
  limitedAccess: frame('Boulote limited access, before approval', 'profile-under-review'),
  // The professional's dashboard in four states, shown as a grid. (The first
  // professional-home-mentee-sent.png was a copy of professional-home.png by
  // mistake; Ebun re-exported it on 12 Oct 2026.)
  dashboardStates: [
    frame('Boulote professional dashboard, default', 'professional-home'),
    frame('Boulote professional dashboard, profile 100% complete', 'professional-home-complete'),
    frame('Boulote professional dashboard, application sent to become a mentee', 'professional-home-mentee-sent'),
    frame('Boulote professional dashboard, chosen as a mentor', 'professional-home-mentor'),
  ],
  // Homepage gallery only.
  professionalJobsOngoing: frame('Boulote professional ongoing jobs', 'professional-jobs-ongoing'),
};

// Ebun's three hand-drawn maps, reused from the old page (photos of her
// notebook), cropped close to the page (2026-10-11): no taskbar, and the
// printed name at the foot of the professional-flow page cropped off. Shown
// in their own shape with a caption each, not in the wide frame.
const map = (name, caption, alt, width, height) => ({ src: `/images/boulote/maps/${name}.webp`, caption, alt, width, height });
export const maps = [
  map('professional-flow', 'Professional flow', "Ebun's hand-drawn map of the professional flow: landing page, sign up, choose professional, onboarding, assessment, payment, dashboard, community and mentorship, apply and accept offers, ratings and payment.", 1710, 2000),
  map('company-flow', 'Company flow', "Ebun's hand-drawn map of the company flow: the navigation bar, and what the company sees on its home dashboard after logging in.", 1370, 2000),
  map('empty-states-projects-flow', 'Empty states and projects flow', "Ebun's hand-drawn map of empty states and the projects flow: what shows when there are no projects or no professionals yet, then the projects tab, the overview of ongoing, pending and completed projects, and posting a new project.", 1125, 1375),
];
