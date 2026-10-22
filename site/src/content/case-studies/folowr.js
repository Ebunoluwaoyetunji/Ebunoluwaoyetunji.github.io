// Folowr case study: words and frames. Edit freely; the layout lives in src/case/.
// The words come exactly from folowr-draft.md, version 8, in
// the same shape as boulote.js. Block types are listed in src/case/Blocks.jsx.
//   draft: words Claude wrote from old-page facts. Ebun has checked them all
//          (draftsChecked), so they show as plain text, like Boulote's.
//   todo:  something only Ebun can write, shown as "TODO (Ebun): ...".
//   sub:   a group inside "What I designed" (For the provider, For the client),
//          also listed in the guide. Decisions inside a group have level 4.
// Frames: src/content/folowr-screens.js lists every frame and the PNG it
// expects in public/images/folowr/ (all eight are in). The first top frame is the homepage frame.
// Turning points: `readAloud`, because these lines are not also in the text.
// `afterBlock`: the turn sits inside the section, after that many blocks.
// Signposts: Ebun's handwriting under each (src/content/signposts/).

import { F, flows } from '../folowr-screens.js';

export default {
  slug: 'folowr',
  title: 'Folowr',
  tagline: 'Designing scheduling around the calendar, not the menu',
  // On laptops the screen frames run wider than the text column, up to the full content width.
  wideFrames: true,
  draftsChecked: true, // Ebun checked every draft (22 Oct 2026): they show as plain text
  visuals: [F.dashboardWeek, F.explore, F.mobileHome],
  facts: [
    { label: 'Role', value: 'UI/UX designer, sole designer.' },
    { label: 'Team', value: 'Me, and the developers.' },
    { label: 'Dates', value: 'Aug 2025 to present' },
    { label: 'Status', value: 'Live' },
    { label: 'Tools', value: 'Figma, FigJam, pen and paper' },
    { label: 'Scope', value: 'Web app for businesses, a mobile app, a public booking page for clients, an explore page to find businesses, and the marketing site.' },
    { label: 'Live link', value: { link: { href: 'https://folowr.app/', text: 'folowr.app' } } },
    { label: 'Also', value: 'I designed the app store screenshots, a flyer and a pamphlet for the launch.' },
  ],
  turns: [
    { after: 'question', text: 'Scheduling first. Everything else follows.', readAloud: true, signpost: { file: 'folowr-signpost-1-how-i-mapped-it.svg', text: 'How I mapped it?' } },
    { after: 'designed', afterBlock: 5, text: 'Flag first. Block last.', readAloud: true, signpost: { file: 'folowr-signpost-2-and-if-they-come-back.svg', text: 'And if they come back.' } },
    { after: 'designed', text: 'Then it went to the developers.', readAloud: true, signpost: { file: 'folowr-signpost-3-what-they-asked-for.svg', text: 'What they asked for' } },
  ],
  sections: [
    {
      id: 'goal',
      title: 'The goal',
      blocks: [
        { p: 'Folowr helps service businesses run their appointments: bookings, clients, staff and availability in one place. Clients book through a page the business shares.' },
        { p: 'The company built Folowr for artisans and service businesses, as a product it can sell to clients. It earns from monthly plans, one for individuals and one for teams.' },
        { draft: 'So a provider has to get set up and take a first booking quickly, or they will not stay to pay.' },
      ],
    },
    {
      id: 'question',
      title: 'The question',
      blocks: [
        { p: 'The brief was to design a scheduling platform that helps providers manage appointments and makes booking easy for clients. Acuity Scheduling was the reference I was given.' },
        { p: 'Three people use the same system for different jobs:' },
        {
          list: [
            'The provider sets up services, hours and rules, and runs the day.',
            'Staff see the appointments assigned to them.',
            'The client finds a business and books, without an account getting in the way.',
          ],
        },
        { p: 'So the question was: how do I give each of them what they need, without building three products?' },
      ],
    },
    {
      id: 'method',
      title: 'Method',
      blocks: [
        { p: 'I did not run user research on this project. I used Acuity to understand how scheduling mechanics work, then mapped the main flows by hand: scheduling, clients, availability, and staff. Then I moved them into FigJam.' },
        { figures: flows },
        { p: 'Before the screens, I wrote the rules down. The file has a design system, a navigation plan and a layout guide. Some of those rules shaped everything after:' },
        {
          list: [
            'The admin sidebar has seven items at most: Dashboard, Calendar, Bookings, Clients, Services, Availability, Settings.',
            'Settings is grouped, not one long list: Business, Team, Integrations, Notifications, Billing, Security.',
            'Empty states have one action only.',
            'Pages load with skeletons, not spinners.',
            'On mobile, the booking button stays fixed at the bottom.',
          ],
        },
      ],
    },
    {
      id: 'found',
      title: 'What I found',
      blocks: [
        { draft: 'Mapping the flows showed me three things.' },
        {
          draftList: [
            { draft: 'Availability is the piece everything depends on. Without it, a service cannot be booked.' },
            { draft: 'A new provider has nothing on day one. No services, no hours, no clients. The first screens have to get them set up, not show them an empty dashboard.' },
            { draft: 'Clients come in two ways. Some get a link from the business. Others are looking for a business to book. The booking flow had to work for both.' },
          ],
        },
      ],
    },
    {
      id: 'designed',
      title: 'What I designed',
      blocks: [
        { sub: { id: 'for-provider', title: 'For the provider' } },
        {
          decision: {
            level: 4,
            title: 'The calendar is home',
            screen: F.dashboardWeek,
            what: 'The dashboard opens on the calendar, in week view by default, with day and month views one click away. Above it sit a few numbers: page views, bookings and likes. Clicking an appointment opens its details, where the provider can reschedule or cancel.',
            blocks: [{ draft: 'The calendar is what a provider checks most, many times a day. Putting it first means no extra clicks for the most common job.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Availability decides what clients see',
            screen: F.availability,
            what: 'A provider sets weekly hours and the time zone. Changes show on the booking page as soon as they save. If a service has no availability, it does not appear on the booking page, and the settings say why.',
            blocks: [
              { draft: 'A client should never pick a service and then find no times. Hiding it is better than a dead end.', label: 'Why' },
              { p: 'This screen changed after testing. See "Working with engineering".' },
            ],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Rules on each service',
            screen: F.addService,
            what: 'Each service has its own rules: a buffer before and after, a minimum notice time, which staff can take it, and how it is paid for. Offline payment is supported, cash or bank transfer, and the screen shows the exact line the client will see about paying.',
            blocks: [
              { p: 'Online card payment is marked "Coming soon". It moved to phase 2, after the MVP.' },
              { draft: 'Many service businesses here are paid in cash or by transfer. Supporting that from the start, and telling the client clearly, avoids a surprise at the appointment.', label: 'Why' },
            ],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Flag before you block',
            screen: F.flagClient,
            what: 'A provider can flag a client, with a note, for example "Missed 2 consecutive appointments without notice". The flag shows on that client\'s bookings. Blocking is a separate, stronger step, and the block screen suggests flagging instead.',
            blocks: [{ draft: 'Blocking a client cannot be undone and loses a customer. Most problems only need a warning that the whole team can see.', label: 'Why' }],
          },
        },
        // Turning point 2 sits here (turns, afterBlock: 5).
        { sub: { id: 'for-client', title: 'For the client' } },
        {
          decision: {
            level: 4,
            title: 'Booking in a few short steps',
            screen: F.clientBooking,
            what: "The client opens the business's booking page, picks a service, picks staff if the business allows it, picks a date and time, adds their details, and gets a confirmation with a summary and how payment works.",
            blocks: [{ draft: 'Every extra step is a chance for the client to leave. The page asks only for what the booking needs.', label: 'Why' }],
          },
        },
        {
          decision: {
            level: 4,
            title: 'Finding a business',
            screen: F.explore,
            what: "Clients can also search for a business by service and location, browse by category, and open a provider's page to book.",
            why: 'This came from the stakeholders. They wanted clients to be able to search for services and providers, not only arrive through a link.',
            blocks: [{ draft: "It also turns each business's booking page into something clients can discover." }],
          },
        },
      ],
    },
    {
      id: 'engineering',
      title: 'Working with engineering',
      blocks: [
        { h: 'Handoff' },
        { p: "The developers built Folowr. I handed over the design files and a prototype link, and I stayed in touch with them through development and testing." },
        { h: 'Pushback from stakeholders' },
        { p: 'As the product took shape, the stakeholders asked for more:' },
        {
          list: [
            'Chat and messages in the mobile app.',
            'A way for clients to search for services and providers.',
            "One view that combines a provider's own bookings with the bookings they make with other providers.",
            'A screen for staff to accept an assignment.',
            'New names for some pages and listings.',
          ],
        },
        { h: 'Pushback from the developers' },
        { p: 'Going through the web app, a developer found the mobile design did not match it in several places:' },
        {
          list: [
            'On mobile, the only way to create a booking was during registration.',
            'Services had no search button.',
            '"Integrations" sat in the More menu, with nothing designed inside it.',
            'There was no screen to show staff.',
          ],
        },
        { p: 'I designed the missing pieces: messages with an empty state, the explore page, and on mobile the staff screens, the Integrations page and new booking.' },
        { screen: F.mobileStaff },
        { h: 'Trade-off' },
        { p: 'Online card payment did not make the first release. It was agreed to move it to phase 2, after the MVP. The service screen still shows it, marked "Coming soon", so providers know it is on the way. Offline payment, cash or bank transfer, shipped first.' },
        { h: 'Testing' },
        { p: "During testing, we found the time buttons on the availability screen clashed with each other. I redesigned the screen. Providers can now type in their own times instead of picking from fixed buttons, and copy one day's hours to all the other days." },
        { screen: F.availabilityAfter },
        { h: 'What shipped' },
        { p: 'Folowr is live at folowr.app.' },
        { p: 'The app was built the way I designed it. A lot changed along the way, but my designs still led. The one exception is the landing page. The developer did not use my fonts and styling there, so the live landing page does not match my design.' },
      ],
    },
    {
      id: 'result',
      title: 'Result',
      blocks: [
        { p: "Folowr is live. I don't have usage numbers to share yet." },
      ],
    },
    {
      id: 'next',
      title: 'What I would do next',
      blocks: [
        { draft: 'Watch real providers set up their first service and hours. Where do they stop?' },
        { draft: 'Watch whether providers use flags, or go straight to blocking.' },
      ],
    },
  ],
  short: {
    sections: [
      {
        id: 'short-goal',
        title: 'Goal',
        blocks: [
          { p: 'A scheduling platform for service businesses. The company built it for artisans and service businesses, to sell as a product.' },
          { draft: 'It earns from monthly plans, so a provider has to get set up and take a first booking quickly.' },
        ],
      },
      {
        id: 'short-question',
        title: 'The question',
        blocks: [
          { p: 'Providers, staff and clients use the same system for different jobs. How do I serve each without building three products?' },
        ],
      },
      {
        id: 'short-designed',
        title: 'Three decisions',
        blocks: [
          { decision: { title: 'The calendar is home', screen: F.dashboardWeek } },
          { decision: { title: 'Availability decides what clients see', screen: F.availability } },
          { decision: { title: 'Flag before you block', screen: F.flagClient } },
        ],
      },
      {
        id: 'short-engineering',
        title: 'Engineering',
        blocks: [
          { p: "The developers built it from my files and prototype. Stakeholders added chat, search and staff assignments along the way. Testing found the availability time buttons clashing, so I redesigned that screen. Online payment moved to phase 2." },
        ],
      },
      {
        id: 'short-result',
        title: 'Result',
        blocks: [
          { p: 'Live at folowr.app, built to my designs. Only the landing page moved away from them.' },
        ],
      },
    ],
  },
};
