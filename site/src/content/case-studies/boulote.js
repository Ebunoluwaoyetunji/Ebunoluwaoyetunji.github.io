// Boulote case study: words and frames. Edit freely; the layout lives in src/case/.
// The words come exactly from boulote-draft.md, version 10 (12 Oct 2026), in
// the same shape as fileo.js. Block types are listed in src/case/Blocks.jsx.
//   draft: words that were drafts. Ebun checked them all on 12 Oct 2026
//          (draftsChecked), so they show as plain text, like Fileo's.
//   todo:  something only Ebun can write, shown as "TODO (Ebun): ...".
//   sub:   a group inside "What I designed" (For the professional, the
//          company, the admin), also listed in the guide. Decisions inside a
//          group have level 4.
// Frames: src/content/boulote-screens.js lists every frame and the PNG it
// expects in public/images/boulote/. Until a screen is in, its frame shows
// empty with its label. The first top frame is the homepage frame.
// Turning points: `readAloud`, because these lines are not also in the text
// (Fileo's are). `afterBlock`: the turn sits inside the section, after that
// many blocks. Signposts: Ebun's handwriting under each (src/content/signposts/).

import { F, maps } from '../boulote-screens.js';

export default {
  slug: 'boulote',
  draftsChecked: true, // Ebun checked every draft (12 Oct 2026): they show as plain text
  title: 'Boulote',
  tagline: 'Designing one hiring platform for three different users',
  // On laptops the screen frames run wider than the text column, up to the full content width.
  wideFrames: true,
  visuals: [F.adminAiReview, F.companyProfessionals, F.professionalHome],
  facts: [
    { label: 'Role', value: 'UI/UX designer (freelance). Sole designer across web and mobile.' },
    { label: 'Team', value: "Me, the client, and the client's developer." },
    { label: 'Dates', value: 'Aug to Oct 2025' },
    { label: 'Status', value: 'Live, in testing' },
    { label: 'Tools', value: 'Figma, pen and paper' },
    { label: 'Scope', value: 'More than 300 screens. Three users. Web and mobile.' },
    { label: 'Live link', value: { link: { href: 'https://app.boulote.com/', text: 'app.boulote.com' } } },
    { label: 'Also', value: "I ran Boulote's LinkedIn page for a time and designed its carousels and flyers." },
  ],
  turns: [
    { after: 'question', text: 'The brief said two sides. The product needed three.', readAloud: true, signpost: { file: 'boulote-signpost-1-how-i-worked-it-out.svg', text: 'How I worked it out' } },
    { after: 'designed', afterBlock: 14, text: 'The AI suggests. A person decides.', readAloud: true, signpost: { file: 'boulote-signpost-2-and-if-it-finds-no-one.svg', text: 'And if it finds no one?' } },
    { after: 'designed', text: 'Then it went to the developer.', readAloud: true, signpost: { file: 'boulote-signpost-3-what-came-back.svg', text: 'What came back' } },
  ],
  sections: [
    {
      id: 'goal',
      title: 'The goal',
      blocks: [
        { p: 'Boulote connects companies with skilled professionals. Companies post projects and hire. Professionals build a profile and get invited to work.' },
        { p: "Boulote's own site states the promise in one line: hire verified professionals in Nigeria. The business earns from monthly plans. So it needs two things to be true: companies trust the people they find, and professionals stay active on the platform. That is what the design has to protect." },
      ],
    },
    {
      id: 'question',
      title: 'The question',
      blocks: [
        { p: 'The brief asked for a two-sided hiring experience: companies on one side, professionals on the other. Working through the requirements, I found a third side behind them.' },
        {
          list: [
            'Company: posts projects, hires, pays.',
            'Professional: proves their skill, receives invitations, does the work.',
            'Admin: approves both, reviews every job request, and steps in when something goes wrong.',
          ],
        },
        { p: 'So the question became: how do I make one connected platform feel simple for each user, while it handles everything in between?' },
      ],
    },
    {
      id: 'method',
      title: 'Method',
      blocks: [
        { p: "I started on paper. Before any screen, I mapped the system by hand: the professional's flow, the company's flow, and the empty states and projects flow." },
        { figures: maps },
        { p: 'From the maps I moved to wireframes, then to the final screens and a design system. I designed every flow twice: once for desktop and once for mobile.' },
        { pair: [F.wireframe, F.companyHomeFinal] },
      ],
    },
    {
      id: 'fits',
      title: 'How the product fits together',
      blocks: [
        { p: 'The maps showed me that a job never belongs to one user. It passes between all three. This is the path I designed for.' },
        {
          ol: [
            'A company posts a project. It does not go live at once. It goes to the admin.',
            'The admin sees it under Pending Requests.',
            'The AI shortlists professionals and gives each one a match score.',
            'The admin reviews the shortlist and approves. If the AI finds no one, the admin picks by hand.',
            'The professional gets an invitation and accepts or declines.',
            'Once accepted, the company sees what happens next: the first payment, the kickoff, and how progress will be tracked.',
            'The professional delivers. The company reviews the files and releases the payment.',
            "The project closes with a report and a rating. The rating goes back to the professional's profile.",
          ],
        },
        { p: 'Every decision below sits somewhere on this path.' },
      ],
    },
    {
      id: 'designed',
      title: 'What I designed',
      blocks: [
        { sub: { id: 'for-professional', title: 'For the professional' } },
        {
          decision: {
            level: 4,
            title: 'Checked before they are seen',
            screens: F.skillAssessment,
            what: 'A professional signs up, says what kind of work they do, uploads documents and takes a skill assessment. Then their profile goes under review. The waiting screen lists what is being checked: personal details and experience, quiz results, and documents. Only after approval do they choose a plan and pay.',
            blocks: [{ draft: 'Companies need to trust the people they find. The check happens once, at the door, so every profile a company sees has already passed it.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'A home that says what to do next',
            screen: F.professionalHome,
            what: 'The professional\'s home shows how complete their profile is and the exact next step, for example "Add 2 more skills to reach 100%". It has a get-started checklist, current job invites, and a rating built from three sources: reviews, quizzes and trainings.',
            blocks: [{ draft: 'A new professional has no jobs yet. The home gives them something useful to do on day one, and each step makes them easier to match.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'An invitation they can answer properly',
            screens: [F.jobInvitations, F.invitationAccepted],
            what: 'Each invitation shows the company, the project, the budget, the deadline and how long the work will take. Opening it gives the full details: start date, location, requirements and the date a reply is due. To accept, the professional gives a start date and a short message. To decline, they pick a reason. After accepting, a confirmation lists the next steps.',
            blocks: [{ draft: 'The professional should not need a call or an email to decide. The reason for declining also tells the company and the admin what to do next.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Reasons to come back between jobs',
            screen: F.dailyChallenge,
            what: 'Three things keep a professional active when they have no project. A daily skill challenge that takes a few minutes and can raise their profile rating. A community where they ask and answer questions. And mentorship: they can apply to be a mentee, or be chosen as a mentor.',
            blocks: [{ draft: 'Jobs do not arrive every day. Without these, a professional would have no reason to open the product, and their profile would go stale.', label: 'Why' }],
          },
        },
        { sub: { id: 'for-company', title: 'For the company' } },
        {
          decision: {
            level: 4,
            title: 'Two ways to hire',
            screen: F.companyProfessionals,
            what: 'A company can post a project and let the platform find someone. Or it can search professionals directly, filter by skill, experience, rating and location, open a profile and send an offer.',
            blocks: [{ draft: 'Some companies know exactly who they want. Others only know what they need done. Both should be able to start.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Saying what happens next',
            screen: F.companyInviteAccepted,
            what: 'When a professional accepts, the company does not just see "Accepted". It sees the next four steps in order: the first payment and how it is held, the kickoff, how progress is tracked, and when the final payment is released.',
            blocks: [{ draft: 'This is the moment a company is about to spend money on someone it has not met. Showing the steps removes the guessing.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Progress the company can follow',
            screen: F.trackProgress,
            what: 'After the hire, the project shows as a list of milestones. Each one has a status and a date: completed, in progress or upcoming.',
            blocks: [{ draft: 'The company should know where things stand without asking.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'See the work, then release the money',
            screen: F.approveAndPay,
            what: 'Before paying, the company sees the files the professional delivered, next to a full breakdown: the milestone amount, the platform fee, the processing fee and the total. When the project closes, a report compares the budget and timeline with what really happened.',
            blocks: [{ draft: 'Payment is where trust breaks most easily. Showing the work and the fees on one screen means no surprises on either side.', label: 'Why' }],
          },
        },
        { sub: { id: 'for-admin', title: 'For the admin' } },
        {
          decision: {
            level: 4,
            title: 'A dashboard of decisions',
            screen: F.adminDashboard,
            what: "The admin's home is not a wall of charts. It leads with what needs a decision: payment disputes, job approvals, flagged content. Urgent items are marked.",
            blocks: [{ draft: 'The admin is the only user whose delay blocks the other two. The first screen should tell them what is waiting.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Jobs move through four clear stages',
            screen: F.adminPendingRequest,
            what: 'Job Management has four tabs in the order a job travels: Pending Requests, AI Review, Ongoing Jobs and Completed. Each job card shows the budget, duration, urgency and how long it has waited.',
            blocks: [{ draft: 'The tabs mirror the path of a job. The admin can always tell where a job is and what it needs next.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'The AI shows its working',
            screen: F.adminAiReview,
            what: 'In AI Review, the admin sees the overall match score, how many candidates were found and how long ago it ran. For each shortlisted professional they see years of experience, past projects, success rate, skills and an individual match score.',
            blocks: [{ draft: 'The admin is the one who answers for the match. They should be able to see why the AI picked someone before they approve it.', label: 'Why' }],
          },
        },
        // Turning point 2 sits here (turns, afterBlock: 14).
        {
          decision: {
            level: 4,
            title: 'When the AI finds no one, the admin is not stuck',
            screen: F.noAiMatch,
            what: 'Sometimes no professional fits. The screen says so plainly, "No qualified match", and shows the skill that was missing. The admin can then pick someone by hand, with filters for category, experience and rating. The job ends as "Professional manually selected".',
            blocks: [{ draft: 'A dead end here would leave a paying company waiting with no answer. The fallback keeps the job moving.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Approving people with a checklist',
            screen: F.adminApprovalReview,
            what: 'When a professional applies, the admin sees how long they have waited, a review checklist, their documents and their experience. The admin gives a quality rating, writes a note and decides. Companies go through a similar review.',
            blocks: [{ draft: 'Approval is a judgement call. The checklist and the note make it consistent and leave a record of why.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Everything else the admin runs',
            blocks: [
              { p: 'The admin also manages the parts that keep the platform healthy:' },
              {
                list: [
                  'Quizzes: create, schedule and see which questions people get wrong.',
                  'Mentorship: review applications, assign a mentor and follow each pair.',
                  'Community: review flagged posts and ban users, with a confirm step.',
                  'Messages: send announcements to all users, only professionals or only companies.',
                  'Platform settings: plans and prices, branding and payment gateways.',
                ],
              },
            ],
          },
        },
        { h: 'States, on every list' },
        { p: 'A new company has no projects. A new professional has no jobs. A search can return nothing. I designed the empty, loading and error versions of these screens, about 50 in total.' },
        { h: 'Web and mobile' },
        { p: 'Every flow was designed for desktop and for mobile, for all three users.' },
        { screen: F.onMobile },
      ],
    },
    {
      id: 'engineering',
      title: 'Working with engineering',
      blocks: [
        { h: 'Handoff' },
        { p: "I did not build Boulote. The client's developer did. I handed over the Figma file with notes written on the screens, so the developer could see how each part should behave." },
        { h: 'Pushback' },
        { p: 'The developer came back with questions my file did not answer.' },
        {
          list: [
            'What does a professional see right after sign-up, while their profile is being checked? And what do the other screens look like before they are approved?',
            'What does the dashboard show when the profile is 100% complete?',
            'What does it show when there are no job invites?',
            'The dashboard had both Quick Actions and a Get Started checklist. The developer felt we only needed one.',
          ],
        },
        { p: 'They also pointed out that my empty screens and filled screens did not always match, and that spacing changed from one flow to the next. That was fair.' },
        { p: 'I designed the missing screens and added them to the file. A waiting page says what is being checked. A "Limited Access" page shows a professional who is not approved yet what is unavailable for now and what they can still do. An approved page leads into choosing a plan. And the professional\'s dashboard now has four states: the default one, profile 100% complete, application sent to become a mentee, and chosen as a mentor.' },
        { screen: F.limitedAccess },
        { grid: F.dashboardStates, label: 'Boulote professional dashboard, four states' },
        { p: 'I also fixed the mismatch between the empty and filled screens, and the spacing across flows. It was a misalignment on my end.' },
        { h: 'Trade-off' },
        { p: 'The developer suggested keeping only one of Quick Actions and the Get Started checklist. I kept both, but not for everyone. A company gets Quick Actions only. A professional gets both.' },
        { p: 'The two lists do different jobs. The checklist appears once a professional has started setting up their profile, so they can see how far they have got. Quick Actions are for everyday tasks. A company has no setup of that kind, so one list is enough.' },
        { h: 'After handoff' },
        { p: 'I stayed in touch with the team to make sure the right designs were built. When I reviewed the build, I wrote my feedback in a file and shared it with them.' },
        { h: 'What shipped' },
        { p: 'Boulote is live at app.boulote.com and in testing. The client sent me the link to check the build against my designs.' },
        { draft: 'The public pages follow my designs: the landing page, the choice to join as a company or a professional, log in, and the community page. The paid plans are marked "Coming soon".' },
        { p: 'When I tested the signed-in screens, I found the build was not responsive on mobile. The mobile screens do not follow my mobile designs closely. I reported it to the team, and it is being worked on.' },
        { h: 'Whose ideas' },
        { p: "The feature list came from the client, including AI matching and the rule that an admin approves the AI's pick. My job was to make those features work for three different users." },
      ],
    },
    {
      id: 'result',
      title: 'Result',
      blocks: [
        { p: 'Boulote is live and in testing. The mobile build is still being brought in line with my designs. There is no user feedback yet, so there are no numbers to report.' },
      ],
    },
    {
      id: 'next',
      title: 'What I would do next',
      blocks: [
        { p: 'Design the empty, loading and waiting states together with each screen, not after the developer asks for them. Most of the pushback on this project came from states I had not drawn.' },
        { draft: 'Watch the AI review screen with a real admin. Do they read the match score, or skip straight to the name?' },
        { draft: 'Check how many professionals finish sign-up. Documents, an assessment and a review is a long road before the first job.' },
      ],
    },
  ],
  short: {
    sections: [
      {
        id: 'short-goal',
        title: 'Goal',
        blocks: [
          { p: 'A hiring platform connecting companies with skilled professionals. Its promise is verified professionals, and it earns from monthly plans, so it needs companies that trust the people they find.' },
        ],
      },
      {
        id: 'short-question',
        title: 'The question',
        blocks: [
          { p: 'The brief said two sides. The product needed three: company, professional and admin. How do I make it feel simple for each?' },
        ],
      },
      {
        id: 'short-designed',
        title: 'Three decisions',
        blocks: [
          { decision: { title: 'Professionals are checked before they are seen', screens: F.skillAssessment } },
          {
            decision: {
              title: 'The AI shows its working, and the admin decides',
              screen: F.adminAiReview,
              what: 'When the AI finds no one, the admin picks by hand.',
            },
          },
          { decision: { title: 'See the work, then release the money', screen: F.approveAndPay } },
        ],
      },
      {
        id: 'short-engineering',
        title: 'Engineering',
        blocks: [
          { p: "The client's developer built it. I handed over an annotated Figma file. The developer came back with states I had not designed, like what a professional sees while waiting for approval. I designed them, and I shared feedback on the build. My testing showed the mobile build did not follow my designs yet, and that is being fixed." },
        ],
      },
      {
        id: 'short-result',
        title: 'Result',
        blocks: [
          { p: 'Live and in testing. No user feedback yet.' },
        ],
      },
    ],
  },
};
