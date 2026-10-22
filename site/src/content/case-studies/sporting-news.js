// Sporting News case study: words and frames. Edit freely; the layout lives in src/case/.
// The words come exactly from sporting-news-draft.md, version 3 (21 Oct 2026),
// in the same shape as folowr.js. Block types are listed in src/case/Blocks.jsx.
//   draft: words Ebun has not checked yet, shown as "Draft, for Ebun to check".
//   todo:  something only Ebun can write, shown as "TODO (Ebun): ...".
// Frames: src/content/sporting-news-screens.js lists every frame and the PNG
// it expects in public/images/sporting-news/. Until a screen is in, its frame
// shows empty with its label. The first top frame is the homepage frame.
// Turning points: `readAloud`, because these lines are not also in the text.
// `afterBlock`: the turn sits inside the section, after that many blocks.
// Signposts: Ebun's handwriting under each (src/content/signposts/).
// The last section is "What I learned", not "What I would do next".

import { F } from '../sporting-news-screens.js';

export default {
  slug: 'sporting-news',
  title: 'Sporting News',
  tagline: 'Turning a print magazine into a platform the team can run',
  // On laptops the screen frames run wider than the text column, up to the full content width.
  wideFrames: true,
  // The dashboard leads (Ebun, 21 Oct 2026); top frame 1 is the homepage frame.
  visuals: [F.dashboard, F.tipDetails, F.transactionDetails],
  facts: [
    { label: 'Role', value: 'Product designer, focused on the admin interface.' },
    { label: 'Team', value: 'Me, my boss, and the developers.' },
    { label: 'Dates', value: 'Aug 2025 to present' },
    { label: 'Status', value: 'Live. The public site and the admin dashboard are both live.' },
    { label: 'Live link', value: { link: { href: 'https://sportingnews.ng/', text: 'sportingnews.ng' } } },
    { label: 'Tools', value: 'Figma' },
    { label: 'Scope', value: 'The admin dashboard: dashboard, tips and predictions, users, transactions, adverts, and reports. I also designed the public site.' },
  ],
  turns: [
    { after: 'question', text: 'The magazine had no back office. I had to design one.', readAloud: true, signpost: { file: 'sporting-news-signpost-1-where-i-started.svg', text: 'where I started' } },
    { after: 'designed', afterBlock: 2, text: 'Every action has to earn its place.', readAloud: true, signpost: { file: 'sporting-news-signpost-2-and-if-its-wrong.svg', text: "and if it's wrong?" } },
    { after: 'designed', text: 'Then it went to the developer.', readAloud: true, signpost: { file: 'sporting-news-signpost-3-what-changed.svg', text: 'what changed' } },
  ],
  sections: [
    {
      id: 'goal',
      title: 'The goal',
      blocks: [
        { p: 'Sporting News is a traditional sports publication. It prints a magazine with sports news, forecasts and betting tips.' },
        { p: 'The business wanted to move online. It wanted to bring its print readers to a digital platform and earn in new ways: subscriptions, advertising, and selling sports predictions.' },
        { p: 'My job was the product design, mainly the admin interface the team uses to manage content, users, transactions and everything else.' },
      ],
    },
    {
      id: 'question',
      title: 'The question',
      blocks: [
        { p: 'The challenge was turning a print business into a digital product.' },
        { p: 'In the magazine, advertisers paid for space, and predictors paid to have their tips published. Buyers reached sellers by phone call, SMS or WhatsApp.' },
        { p: 'Online, all of that needed a home. How do people find predictions? How are payments handled? How does the business stay in control of the platform? And what is free, to bring visitors in, and what is paid, to bring money in?' },
      ],
    },
    {
      id: 'method',
      title: 'Method',
      blocks: [
        { p: 'I started by breaking the business requirements down into the main parts of the product. I looked at what each user needed to do, and what the admins needed to manage behind the scenes.' },
        { p: 'For the admin, I mapped the main areas and worked to keep them simple, so admins would not face too many options at once.' },
        { p: 'Then I worked out how the parts depend on each other. Fixtures hold the game information. Tips and predictions are built on that information. Transactions record the money that changes hands when someone buys.' },
      ],
    },
    {
      id: 'designed',
      title: 'What I designed',
      blocks: [
        {
          decision: {
            title: 'One clear job for each section',
            what: 'The admin has six areas: Dashboard, Tips and Predictions, Users, Transactions, Advertisements, and Reports. Each one does one job. Managing content happens in Tips and Predictions. Money is tracked in Transactions. Watching performance happens in the Dashboard and Reports.',
            why: 'I kept running the platform apart from watching how it performs. Every section has a clear purpose, and every action in it supports a real admin need.',
          },
        },
        {
          decision: {
            title: 'Tips and predictions in one place',
            screen: F.tipDetails,
            what: 'A tip is a package, such as "Weekend VIP Tip, Perm 3". Its predictions sit inside it: the match, the market, the odds, the status, how many people bought it and the revenue. The admin opens a tip, sees all its predictions on one page, and adds or edits them there.',
            why: 'My first design had tips and predictions on separate pages. My boss suggested combining them, because they belong together and it keeps the menu short. I applied the same idea to other related menu items.',
          },
        },
        // Turning point 2 sits here (turns, afterBlock: 2).
        {
          decision: {
            title: 'Posting a tip',
            screen: F.postTip,
            what: 'Posting a tip is one form in sections: the tip artwork, the seller it belongs to, the game, the tip details, the price and when to publish. A summary at the end shows everything before the admin publishes. The full prediction only shows to buyers after they pay. The price is set by the platform, not typed in.',
            why: 'A wrong tip or a wrong price costs buyers money and the platform trust. Sections and a summary make mistakes easier to catch before anything goes live.',
          },
        },
        {
          decision: {
            title: 'One account, buyer or seller or both',
            screen: F.userDetails,
            what: "User Management is about three things: finding a user, seeing their information, and managing their account. A user can be a buyer, a seller, or both. A seller's page also shows their seller level, the tips they have posted and their total sales. The admin can change a seller's level, or suspend or delete an account, and each of those asks to confirm.",
            why: 'In real life, the same person often buys tips and sells them. Treating buyers and sellers as two separate systems would have split one person into two accounts.',
          },
        },
        {
          decision: {
            title: 'Money you can see but not change',
            screen: F.transactionDetails,
            what: 'Transactions is one view of all the money on the platform. Each one opens to the full detail: the buyer, the tip, the payment method, the reference, the platform fee and what the seller earns. The admin can download the record.',
            why: 'I kept the main action as viewing, with a download. I left out editing and deleting on purpose. Changing a financial record needs clear business rules, and those did not exist yet.',
          },
        },
        {
          decision: {
            title: 'Reports that add something',
            screen: F.dashboard,
            what: 'The Dashboard gives a quick overview: tips posted, predictions, sales and revenue. Reports go deeper, with subscription performance next to revenue and sales from tips and predictions.',
            why: 'Reports should give deeper insight without repeating what the Dashboard already shows.',
          },
        },
        { h: 'The public site' },
        { p: "I also designed the public site. It keeps the magazine's familiar format: fixture tables, pools, betting and lotto tips. Free tips bring visitors in. Paid tips show a preview and a price." },
        { p: ['See it live: ', { link: { href: 'https://sportingnews.ng/', text: 'sportingnews.ng' } }, '. The admin dashboard is private, so it is shown here in screens.'] },
      ],
    },
    {
      id: 'engineering',
      title: 'Working with engineering',
      blocks: [
        { h: 'Requirements that kept moving' },
        { p: 'Some requirements only became clear as the designs developed. So I did not design every possible feature at once. I worked out what the first version needed, and marked the places that still needed an answer.' },
        { p: 'Fixtures are one example. Would the game data be typed in by hand, or come from an outside API? That changes what an admin should be able to do, so I asked for an answer before finishing the design.' },
        { h: 'Pushback' },
        { p: 'I designed a side panel for editing a prediction, so the admin could edit it next to the list. The developer said he could not build it, or that it would take too long.' },
        { h: 'Trade-off' },
        { p: 'I agreed to a pop-up form instead, as long as it did the same job. The live dashboard uses the pop-up.' },
        { h: 'Handoff' },
        { p: 'I sent the developer the Figma file and the prototype link, so he could see how the product works. During development, I stayed involved and checked what was being built against my designs.' },
        { h: 'What shipped' },
        { p: 'The admin dashboard is live and used by the Sporting News team.' },
      ],
    },
    {
      id: 'result',
      title: 'Result',
      blocks: [
        { p: 'The public site is live at sportingnews.ng, and the admin dashboard is live and used by the Sporting News team.' },
      ],
    },
    {
      id: 'learned',
      title: 'What I learned',
      blocks: [
        { p: 'Sporting News taught me to think past single screens, about how a product works as a system: the business model, user roles, content, financial records, and how the admin areas connect.' },
        { p: 'It also taught me to ask the right questions early, especially when business rules or technical decisions change what the user can do.' },
      ],
    },
  ],
  short: {
    sections: [
      {
        id: 'short-goal',
        title: 'Goal',
        blocks: [
          { p: 'A print sports magazine moving online, to earn from subscriptions, adverts and selling predictions. I designed the admin interface the team runs it with.' },
        ],
      },
      {
        id: 'short-question',
        title: 'The question',
        blocks: [
          { p: 'In print, buyers reached sellers by phone and WhatsApp. Online, all of it needed a home the business controls.' },
        ],
      },
      {
        id: 'short-designed',
        title: 'Three decisions',
        blocks: [
          { decision: { title: 'Tips and predictions in one place', screen: F.tipDetails } },
          { decision: { title: 'One account, buyer or seller or both', screen: F.userDetails } },
          { decision: { title: 'Money you can see but not change', screen: F.transactionDetails } },
        ],
      },
      {
        id: 'short-engineering',
        title: 'Engineering',
        blocks: [
          { p: 'I handed over the Figma file and a prototype, and checked the build as it was made. Requirements kept moving, so I designed for the first version and asked questions early. The developer could not build my side panel, so we agreed on a pop-up form.' },
        ],
      },
      {
        id: 'short-result',
        title: 'Result',
        blocks: [
          { p: 'The public site and the admin dashboard are both live.' },
        ],
      },
    ],
  },
};
