// Fileo case study: words and screens. Edit freely; the layout lives in src/case/.
// The text is Ebun's. Changes from the old page: em dashes became commas,
// colons or full stops; ticks and crosses became Yes and No.
//
// Round 3 (2026-10-10): Fileo is in build. All 19 proposed cuts accepted.
// Block types (see src/case/Blocks.jsx):
//   p, h, list, quote, stats, items, profiles, table, decision, steps, phases,
//   screen, goal, usability (hidden while null),
//   draft: words Ebun has checked (2026-10-11), shown as plain text,
//   note:  a short line in the small typewriter font,
//   todo:  something only Ebun can write, shown as "TODO (Ebun): ...".
// `short` is the short read (the default view): the whole story in about
// 350 words, drafted from Ebun's words only. `sections` is the full read.
// `turns` are the turning points (full read only), `next` the next project.
//
// Screens: no old Fileo images in the new site. Each screen is an empty frame
// with a label until the new screens arrive, e.g. { src, alt } or
// { images: [{ src, alt }, ...] }. The first visual is where the homepage
// frame lands, so it shows the same label (later, the same image).

import S, { fileoFrame } from '../fileo-screens.js';

export default {
  slug: 'fileo',
  draftsChecked: true, // Ebun checked every draft (2026-10-11): they show as plain text
  title: 'Fileo',
  tagline: 'Designing an AI-native tax filing service for Nigerian freelancers',
  // The first frame is the same as the homepage Fileo frame, so the page change is seamless.
  visuals: [
    fileoFrame('Fileo onboarding, home and review screens', S.onboarding1, S.homeInProgress, S.reviewSummary),
    { ...fileoFrame('Fileo demo', S.demo), caption: 'Fileo demo. A 19 second screen recording with made-up data.' },
  ],
  // "Try the demo", under the demo video at the top (both the short and the full read).
  demoLink: {
    href: 'https://fileo-app.expo.app/',
    text: 'Try the demo',
    note: 'Early test build. Best on a phone. Sign-up is real, so use any email you like.',
    qr: '/images/fileo/demo-qr.svg',
  },
  facts: [
    { label: 'Role', value: 'Product designer: research, strategy, design, and directing the build' },
    { label: 'Team', value: 'Solo' },
    { label: 'Status', value: 'Personal project, in build, 2026' },
    { label: 'Area', value: 'AI-native service, fintech, Nigeria' },
    { label: 'Tools', value: 'Figma, Claude Code, React Native, desk research, one user conversation' },
  ],
  turns: [
    { after: 'question', text: 'I did not start with wireframes. I started with answers.', signpost: { file: 'signpost-1-how-i-found-out.svg', text: 'How I found out' } },
    {
      after: 'found',
      text: 'Fileo does not need to convince them. It needs to remove the obstacles in their way.',
      signpost: { file: 'signpost-2-so-i-built-this.svg', text: 'So I built this' },
    },
    { after: 'designed', text: 'Fileo does the work, the user makes the final call.', signpost: { file: 'signpost-3-what-happened-next.svg', text: 'What happened next?' } },
  ],
  next: { label: 'Boulote', href: '/boulote/' },
  sections: [
    {
      id: 'goal',
      title: 'The goal',
      blocks: [
        {
          goal: {
            label: 'Personal project',
            draft: 'My own goal: a service that files annual tax returns on behalf of Nigerian freelancers and remote workers, because no product in the market did. The design supports it by building trust at every step: Fileo does the work, the user makes the final call.',
          },
        },
        {
          p: 'Fileo is an AI-native tax filing service that handles annual personal income tax returns on behalf of Nigerian freelancers and remote workers. The user answers simple questions, uploads their documents, and approves a summary. Fileo does everything else, including filing directly with the relevant state revenue service.',
        },
        { h: 'The context' },
        {
          p: 'In January 2026, Nigeria\'s Finance Act amendments came into full effect, making it mandatory for every taxable individual, including freelancers, remote workers, and people with side incomes, to file an annual personal income tax return. This was not new legislation, but enforcement had never been applied to this group before. For millions of Nigerians who had earned through platforms like Payoneer, Wise, Grey, and Stripe, this was the first time they were formally required to interact with the tax system.',
        },
        {
          p: 'The deadline for filing was March 31, 2026. On that day, the government portals crashed under the volume of users attempting to comply. Thousands were left stranded. Officials confirmed that penalties would still apply despite the system failure. By May 2026, when this project began, a large percentage of the target population had not filed, penalties were accumulating at ₦50,000 per month after the first month, and no solution existed in the market that actually handled the filing process on behalf of users.',
        },
        {
          stats: [
            { value: '123.9M', text: 'Nigerians issued a NIN, all now formally in the tax net', source: 'NIN Enrolment Data, Oct 2025' },
            {
              value: '₦50,000',
              text: 'Penalty added every month after the first month of non-compliance',
              source: 'Nigeria Tax Administration Act, 2025',
            },
            { value: '0', text: 'Products in the Nigerian market that file on your behalf, as of May 2026', source: 'Competitive audit, May 2026' },
          ],
        },
        { h: 'My role' },
        {
          p: 'I was the sole designer on this project, responsible for every stage from initial research through to the final design system. I identified the problem space, conducted desk research, spoke with a potential user to validate assumptions, defined the user personas, mapped the information architecture, designed all six onboarding screens, the income collection flow, the review and edge case flows, Home, and the incomplete filing state. I also built the brand identity system and wrote the copy across all surfaces.',
        },
        {
          draft: 'Fileo started as a design project. I am now building it into a working mobile app. I design the screens and direct the build, and Claude Code writes the code.',
        },
        { h: 'The YC connection' },
        {
          p: 'This project was directly inspired by Y Combinator\'s Summer 2026 Request for Startups, which identified AI-Native Service Companies as a priority investment area.',
        },
        {
          p: 'Fileo sits directly in this category. The AI processes documents, calculates obligations, and prepares the return. A CITN-certified tax professional reviews it. The user approves and the service files. This is a human-in-the-loop AI service, exactly what YC described.',
        },
      ],
    },
    {
      id: 'question',
      title: 'The question',
      blocks: [
        {
          quote: 'Nigerian freelancers and remote workers with irregular, multi-source income are now legally required to file annual tax returns, but they lack the knowledge, documentation, and financial means to do it alone. What was once an ignored obligation is now actively enforced, leaving a large population confused, anxious, and exposed to compounding penalties.',
          source: 'Fileo problem statement',
        },
      ],
    },
    {
      id: 'method',
      title: 'Method',
      blocks: [
        {
          p: 'Before designing a single screen, I needed to understand the actual state of tax compliance in Nigeria, who was affected, what they did and didn\'t know, and why existing solutions were failing them.',
        },
        { h: 'Research questions' },
        {
          p: 'I started by writing down what I did not know. This is a discipline I apply deliberately: separating what I know from what I am assuming from what I need to find out. For this project, the four questions that needed verified answers before I could design anything were:',
        },
        {
          list: [
            'How does the Nigerian tax system actually see foreign income? What is visible to the NRS and what is not?',
            'Were Nigerian freelancers paying tax before the 2026 reforms, and if so, to which country?',
            'What is the current awareness level among Nigerian freelancers about the new requirements?',
            'Is the assumption that "paying tax to my client\'s country covers my Nigerian obligation" a common misconception, and is it actually wrong?',
          ],
        },
        { p: 'These questions shaped my entire research approach. I did not start with wireframes. I started with answers.' },
        {
          draft: 'I answered these through desk research. I read news coverage of the new tax rules, and I followed what people were posting about them on Instagram. The figures on this page come from the sources named beside them.',
        },
        { h: 'Speaking to a potential user' },
        {
          p: 'Beyond desk research, I conducted a conversation with a potential user: a Nigerian professional with a salaried job and income from multiple sources.',
        },
        { h: 'Competitive audit' },
        {
          p: 'I audited every existing solution in the Nigerian tax compliance space before designing anything. The findings were consistent: every product currently available either requires the user to do the hard work themselves, or is not yet live.',
        },
        {
          table: {
            caption: 'Existing solutions in Nigerian tax compliance, May 2026',
            head: ['Product', 'What it is', 'Files for you', 'Human review'],
            rows: [
              ['Rev360 / TaxPro Max', 'Government portal (NRS)', 'No', 'No'],
              ['Taash', 'AI tax tracking tool', 'No', 'No'],
              ['Human accountant', 'Individual tax consultants', 'Yes', 'Yes'],
              ['Fileo', 'AI-native filing service', 'Yes', 'Yes'],
            ],
          },
        },
        {
          p: 'The gap is specific and unoccupied: a service that is AI-powered, uses certified human review, files on the user\'s behalf, and is actually available. Taash validates that the market exists. People are signing up for a waiting list. But Taash stops at estimation. Fileo starts where Taash ends.',
        },
      ],
    },
    {
      id: 'found',
      title: 'What I found',
      blocks: [
        { h: 'Key research findings' },
        {
          items: [
            {
              title: 'Foreign income linked to a Nigerian BVN is already visible to the NRS',
              text: 'Payoneer, Wise, Grey, and similar platforms linked to BVN accounts are not hidden from authorities. The grey area that freelancers operated in no longer exists. This was not widely known.',
            },
            {
              title: 'Most freelancers operated in a genuine grey area, not deliberate evasion',
              text: 'The tax status of income earned remotely from foreign companies was legally ambiguous before 2026. Freelancers were not hiding. They were operating in a system that had no clear rules for their situation. That system has now changed.',
            },
            {
              title: 'The "I pay tax to my client\'s country" belief is both common and wrong',
              text: 'Many Nigerian remote workers believe that withholding tax deducted by a foreign client satisfies their Nigerian tax obligation. Under the 2026 reforms, Nigerian residents must self-declare all global income regardless of where tax was already deducted.',
            },
            {
              title: 'The portal crash on March 31 created a large population of motivated but stranded users',
              text: 'Thousands of people who wanted to comply were unable to. They are now accumulating penalties for a failure that was partly the government\'s. This group, frustrated, already behind and actively looking for help, is one of the most commercially viable user segments for Fileo.',
            },
            {
              title: 'Tax compliance is becoming a gateway to financial services',
              text: 'Fintechs including Paystack and Flutterwave are integrating Tax ID verification into their onboarding. Non-compliance will soon block access to loans, government contracts, and visa applications. The stakes extend far beyond avoiding a fine.',
            },
            {
              title: 'Even people below the ₦800,000 threshold must still file a nil return',
              text: 'The most common assumption among low earners is that "I don\'t earn enough to pay tax, so I don\'t need to do anything." This is factually incorrect. Filing is mandatory even when the tax owed is zero. Failing to file still incurs penalties.',
            },
          ],
        },
        { h: 'What the user conversation added' },
        { p: 'This conversation produced three specific product insights that directly shaped the design:' },
        {
          items: [
            {
              title: 'Tax education is needed before the product.',
              text: 'The user wanted to understand the difference between income tax and VAT before they trusted any service touching their finances. The fear was not just "will you make a mistake". It was "I don\'t even understand what you\'re doing with my money."',
            },
            {
              title: 'Record keeping is essential for trust.',
              text: 'Nigerian users are sceptical of digital services that do not provide a permanent, accessible record of what happened. The user specifically asked whether they could come back and see their previous filings. This became a core feature of Home.',
            },
            {
              title: 'Undescribed bank transactions are a real problem.',
              text: 'The user flagged that Nigerian bank statements frequently contain transactions with no description: just an amount, a date, and a reference code. Since Fileo\'s income detection relies on reading bank statements, this edge case needed a deliberate design solution rather than an error state.',
            },
          ],
        },
        { h: 'Five user profiles' },
        {
          p: 'I identified five distinct user mindsets in the target population. Each has a different relationship with the problem, a different emotional state, and different design implications. Documenting all five was important, but designing for all five equally would have produced a product that served nobody well.',
        },
        {
          draft: 'The five profiles came from two places: my desk research, and freelancers I know personally. I grouped what I read and heard into five mindsets.',
        },
        {
          profiles: [
            {
              name: 'The Aware but Paralysed',
              role: 'Primary user: remote worker',
              primary: true,
              quote: 'I know I should file. I just don\'t know how, and I\'m scared I\'ll do it wrong.',
              pains: ['Fears making a mistake', 'Doesn\'t trust service providers', 'Multiple income sources', 'Messy financial records'],
              implication: 'Every screen must reduce anxiety. Trust signals must be explicit and specific, not generic. The user must be able to review everything before it is submitted.',
            },
            {
              name: 'The Disengaged Low Earner',
              role: 'Secondary user: local freelancer',
              quote: 'I barely make anything. Why would they come for me?',
              implication: 'This user won\'t come to Fileo directly. The go-to-market strategy, fintech platform partnerships, is the design solution for reaching them.',
            },
            {
              name: 'The False Compliant',
              role: 'Secondary user: salaried plus side income',
              quote: 'My employer handles my PAYE. I\'m covered.',
              implication: 'Must be handled with care. The discovery that they are non-compliant must feel like help, not accusation. Needs combined filing for employment and side income.',
            },
            {
              name: 'The Failed Complier',
              role: 'Secondary user: already behind',
              quote: 'I tried. The portal crashed. Now I\'m being penalised for their system failing.',
              implication: 'The retroactive filing path must acknowledge the system\'s failure, not the user\'s. Penalty mitigation guidance and proof of attempt are specific features for this user.',
            },
            {
              name: 'The Willing but Lost',
              role: 'Secondary user: jargon barrier',
              quote: 'I\'ve read everything I could find. Every answer creates three new questions.',
              implication: 'Every piece of copy must be written in plain language. No tax term should appear without an immediate plain-English explanation. The product must never assume prior knowledge.',
            },
          ],
        },
        { note: 'The quotes are real. They come from my conversation with a potential user.' },
        { h: 'Why the primary user determines every design decision' },
        {
          p: 'Fileo serves all five user profiles. But it is primarily designed for the Aware but Paralysed user: the remote worker who knows they need to comply but is blocked by anxiety, complexity, and distrust. This decision was not arbitrary. It was strategic for three reasons.',
        },
        {
          p: 'First, this user is the most motivated. They already believe the problem is real. Fileo does not need to convince them. It needs to remove the obstacles in their way. Second, designing for the most anxious and distrustful user produces a product rigorous enough for everyone else. The trust signals, the review step, the plain language: these serve all five users, but they are only built if the most demanding user is the primary target. Third, this user represents the largest commercially viable segment. They are willing to pay for a solution and they are actively looking for one.',
        },
      ],
    },
    {
      id: 'designed',
      title: 'What I designed',
      blocks: [
        { p: 'Every significant design decision in Fileo was made in response to a specific user insight or research finding.' },
        {
          decision: {
            title: 'One task per screen',
            what: 'Each screen asks for one thing. Creating the account is one short form. After that, every screen has one task: confirm the code, check identity, pick platforms, add income, add deductions. In the filing flow, a progress bar shows where you are.',
            why: 'Research identified two primary drop-off points in the user journey: onboarding (if it is too long or uses jargon) and the document upload stage (if it is too complex). A potential user confirmed this directly. The form approach was rejected because it presents the full complexity of the task at once. The conversational approach breaks it into small, answerable steps. The cognitive load is distributed across time rather than concentrated in a single moment.',
            screen: fileoFrame('Fileo onboarding screens', S.onboarding1, S.onboarding2, S.onboarding3),
          },
        },
        {
          decision: {
            title: 'User reviews and approves the return before submission',
            what: 'Before anything is submitted to the revenue service, the user sees a complete, plain-language summary of their return: income declared, deductions applied, tax calculated, state revenue service identified. They must actively approve it. Nothing is submitted without their confirmation.',
            why: 'User research identified "what if the service makes a mistake with my numbers" as the primary trust barrier for the Aware but Paralysed user. The principle "Fileo does the work, the user makes the final call" directly addresses this fear. Removing this step would simplify the flow but destroy the trust it took six screens to build. A commitment gate modal was added before the final submission to make the action feel deliberate, not accidental.',
          },
        },
        {
          decision: {
            title: 'Platform-first income collection with grouped document uploads',
            what: 'Instead of asking "what was your income last year?", which would require the user to calculate and remember, Fileo asks "which platforms did you receive payments through?" The user selects from a visual grid of platforms they recognise. Fileo then asks for the specific documents relevant to those platforms only, grouped clearly by platform with step-by-step instructions for how to download each statement.',
            why: 'Research showed that Nigerian freelancers receive income through multiple platforms simultaneously: Payoneer, Grey, Wise, brand deals, YouTube AdSense, direct bank transfer. Asking for "income records" is too abstract. Breaking it into "which platforms?" and then "upload the statement from that platform" is concrete and achievable. The grouped upload approach was chosen over a month-by-month approach after identifying that twelve months of questions would be too long, even though month-by-month is more natural for memory recall.',
            screen: fileoFrame('Fileo income sources screens', S.selectPlatforms, S.incomeSummary),
          },
        },
        {
          decision: {
            title: 'A hard gate on unresolved flagged transactions',
            what: 'When Fileo detects a bank transaction with no description, it flags it and asks the user to categorise it. The user cannot proceed to deductions or review until every flagged transaction has a category. The button reads \'Complete transaction review\'. It stays greyed out until every flagged item has an answer. Once all flags are resolved, the button activates and a confirmation message appears.',
            why: 'A potential user identified this as a specific real-world problem: Nigerian bank statements regularly contain transactions with no description, just an amount, a date, and a reference number. Allowing the user to skip unresolved transactions would produce an inaccurate return and expose them to the exact penalties Fileo is meant to prevent. The gate is firm but the language is warm: framed as "we need your help to get this right" rather than as an error or a block.',
            screen: fileoFrame('Fileo flagged transactions screen', S.flaggedTransactions),
          },
        },
        {
          decision: {
            title: 'The review screen shows one thing at a time',
            screens: [fileoFrame('Review screen, first version', S.reviewBeforeAfter), fileoFrame('Review screen with tabs', S.reviewTabs)],
            blocks: [
              {
                draft: 'The review summary is split into three tabs: Summary, Calculation and Documents. The user sees the Summary first. They open the other tabs only when they want the detail behind it. The screen still shows how much they saved.',
              },
              {
                draft: 'The first version put everything on one screen. A card at the top showed savings and tax owed side by side. Below it sat the income breakdown, the tax calculation, the filing details and the review note. Testers found it confusing. I changed it so users see what they want to see, one thing at a time, and can still check everything before they approve.',
                label: 'Why',
              },
            ],
          },
        },
        {
          decision: {
            title: 'A tax education section on the landing page with an interactive calculator',
            what: 'Before asking anyone to create an account, the landing page includes a section that explains the difference between income tax and VAT in plain language, shows how Nigerian tax bands work visually, and provides an interactive calculator where the user can enter their income and deductions to see their estimated tax owed, before committing to anything. The section opens with the headline: "Fileo is not taking your money. The government was always going to."',
            why: 'A potential user stated directly: "Nigerians are not always educated on how tax works. They need to see that Fileo is not just taking their money. They need to understand the process." The calculator serves a dual purpose: it educates the user and it converts them. The moment someone enters their income and sees their estimated tax, the problem becomes real and personal. Combined with the deduction fields, which reduce the number, the user experiences Fileo\'s value before they have created an account.',
            screen: fileoFrame('How tax bands work', S.reviewTaxBands),
          },
        },
        {
          decision: {
            title: 'Save progress and return, designed as a first-class feature',
            what: 'After identity verification, users can save their progress and return later. When they return, they see a dedicated incomplete filing dashboard, not the main Home, that shows their progress bar, exactly where they stopped, what documents they still need to gather, and step-by-step instructions for how to obtain each missing document. A deadline countdown with the compounding penalty amount creates urgency without being alarmist.',
            why: 'Filing a tax return requires documents that not everyone has immediately available: bank statements, Payoneer annual reports, rent receipts. A user who starts the process at 11pm without their documents ready should not face an abandoned session or a restart. Saving progress is standard product behaviour but the returning state, the incomplete filing dashboard, was deliberately designed as a full screen because the user\'s needs when returning are different from their needs when starting fresh. They need orientation, not a fresh introduction.',
            screen: fileoFrame('Fileo home with a return in progress', S.homeInProgress),
          },
        },
        {
          decision: {
            title: 'Fintech platform partnerships as the primary go-to-market',
            what: 'Fileo\'s primary distribution strategy is not paid advertising or organic social media. It is integration with the fintech platforms, Grey, Payoneer, Geegpay and Raenest, that Nigerian freelancers already use to receive payments. The government\'s Tax ID implementation, announced May 18, 2026, requires fintechs to verify tax compliance before serving users. This creates a natural, contextual entry point: the moment a freelancer sees "you need to be tax compliant to continue" inside their payment platform is the moment of highest motivation for Fileo.',
            why: 'The Disengaged Low Earner, who does not believe the law applies to them, will not discover Fileo through a search or an ad. They will discover it when their payment platform enforces compliance. The partnership model also creates trust transfer: if Grey or Geegpay recommends Fileo, the user inherits some of that platform\'s existing trust. This is a more efficient and more credible acquisition path than any paid channel.',
          },
        },
        { h: 'How the product fits together' },
        { p: 'Fileo\'s product is structured into four areas, each with a distinct purpose and user state:' },
        {
          list: [
            'Public area: landing page, tax explainer and calculator, pricing, and trust/FAQ. Accessible to all unauthenticated users. Purpose: convert a curious visitor into a person who creates an account.',
            'Onboarding: six-step flow covering account creation, identity verification, welcome screen, income source selection, document upload, and deductions discovery. Purpose: collect everything Fileo needs to prepare an accurate return.',
            'Filing flow: income summary with flagged transaction resolution, deductions, review and approval, commitment gate, and confirmation. Purpose: present the prepared return to the user, get approval, and file.',
            'Signed-in app: Home, File, Documents and Profile.',
          ],
        },
        { h: 'The first-time user' },
        {
          p: 'The primary journey from entry to filed return. This flow includes two key decision points: a trust gate on the landing page (where a sceptical user may read the FAQ and tax explainer before proceeding) and a flagged transactions gate in the income summary (where unresolved transactions block progression).',
        },
        { h: 'The retroactive filer' },
        {
          p: 'A user who missed the March 31 deadline arrives at Fileo having already accumulated penalties. The landing page includes retroactive filing pricing. After account creation and verification, this user sees a penalty summary, showing their current exposure clearly, before proceeding through the same income and deductions flow as a standard filer. Their return includes a late filing note and penalty mitigation guidance, and they receive documented proof that they have now filed, which serves as evidence of good faith compliance.',
        },
        { h: 'Key screens' },
        { h: 'The landing page' },
        {
          p: 'The hero headline reads: "We file your taxes. You do nothing." This was chosen over more qualified alternatives because the primary anxiety of the target user is complexity. The headline\'s job is to tell them that complexity has been removed. The trust section uses specific, verifiable claims rather than general assurances: bank-level encryption, CITN-certified professionals, NRS compliance. The pricing section shows three tiers, Basic, Freelancer, and Retroactive, with transparent pricing and a comparison note showing the typical cost of a human accountant.',
        },
        { h: 'Home' },
        { screen: fileoFrame('Fileo home in three states', S.homeNotStarted, S.homeInProgress, S.homeCompleted) },
        {
          p: 'Home answers one question first: where does my return stand? It has three states. Before you start, it shows one card to start the 2025 return, with the deadline. In progress, it shows the step you are on, your estimated tax so far, and one button to continue. After filing, it says you are done for the year. Below that sit a short \'Helpful to know\' row and your past returns.',
        },
      ],
    },
    {
      id: 'engineering',
      title: 'Working with engineering',
      blocks: [
        { draft: 'Fileo has no engineering team. I direct the build myself. These are the limits I hit and the calls I made.' },
        { h: 'Handoff' },
        {
          draft: 'There is no separate developer on Fileo. I design the screens in Figma, then write build instructions for Claude Code, which writes the code in React Native. I check every build on a real Android phone before moving on.',
        },
        {
          draft: 'I designed the main flows in Figma: onboarding, sign-in, home, the filing flow, and the File and Documents tabs. For some later screens, such as the Profile tab, I gave Claude Code reference screens and directed the design in the build.',
        },
        { h: 'Pushback' },
        {
          draft: 'Real identity checks could not be built yet. Fileo needs to confirm a user\'s BVN and NIN. The verification providers I looked at need a company email address to open an account. Fileo is a personal project with no company domain, so I could not get access.',
        },
        { draft: 'iOS is also on hold. The app is Android first.' },
        { h: 'Trade-off' },
        {
          draft: 'I chose Dojah over Smile ID, because it has a self-serve test environment and follows Nigeria\'s data protection rules. I asked Dojah whether they could make an exception on the company email. They could not. Real identity checks have to wait until Fileo has a work email.',
        },
        { draft: 'I have not decided yet whether to set up a work email or start with a different provider.' },
        { draft: 'Until then, the app stores only masked versions of a user\'s BVN and NIN, never the full numbers.' },
        {
          draft: 'I also postponed three account features. Change password, forgot password and email editing exist as screens, but they are not connected yet.',
        },
        { h: 'After handoff' },
        { draft: 'Four people have tested the demo so far. Here is what they found and what I changed.' },
        {
          draftList: [
            {
              draft: 'The review summary was confusing. It showed everything at once. I rebuilt it with three tabs. The user now sees the main summary first, and opens a tab only when they want the detail.',
            },
            { draft: 'The email field accepted addresses in the wrong format. It now checks the format before the user can continue.' },
            { draft: 'The one-time code did not line up properly inside its input boxes. This is a build problem, and I am fixing it now.' },
            { draft: 'The illustration in the second onboarding animation did not feel clean. I reworked it in the design. The build does not have the new version yet.' },
            {
              draft: 'One tester asked to preview a document after uploading it. That is planned. For now, the Documents tab lists everything the user has uploaded.',
            },
            { draft: 'Testers reached the \'are you sure?\' step before submitting, and they loved it.' },
          ],
        },
        {
          draft: 'One gap is still open. Right now the app itself can mark a user as identity verified. Before real verification goes live, that status must be set by the server, not the app.',
        },
        { h: 'What shipped' },
        {
          draft: 'The full interface is built from the designs. Sign-up and sign-in work with real accounts, including one-time codes sent by email. User profiles are protected by access rules. Identity verification is not live yet.',
        },
        { draft: 'Reading documents with AI is not connected yet. It still needs an AI service to be integrated.' },
      ],
    },
    {
      id: 'result',
      title: 'Result',
      blocks: [
        {
          draft: 'Fileo is in build. It is a working Android app, not a finished product. The interface is built from my designs, and sign-up and sign-in are real. Identity verification is not live yet, and no real tax returns have been filed through it. Four people have tested the demo, and their feedback has already changed the design.',
        },
        { usability: null },
      ],
    },
    {
      id: 'next',
      title: 'What I would test next',
      blocks: [
        { h: 'What remains unvalidated' },
        { draft: 'Three core assumptions still need validation before Fileo handles real users:' },
        {
          items: [
            {
              title: 'Users will trust an AI-prepared return reviewed by a professional they have never met.',
              text: 'This assumption underlies the entire product. It has not been tested. Competitor behaviour, Taash\'s waiting list, suggests people are interested in AI tax tools, but interest in a tool is different from trust in a service that files on your behalf.',
            },
            {
              title: 'Nigerian fintech platforms will partner with Fileo.',
              text: 'The go-to-market strategy depends on integration with Grey, Geegpay, Raenest, and similar platforms. This is not guaranteed. The alternative, direct acquisition through paid channels or organic content, is more expensive and less contextually relevant.',
            },
            {
              title: 'The AI can accurately extract income from messy Nigerian bank statements.',
              text: 'The technical feasibility of the core AI layer (reading PDFs, identifying income transactions, handling undescribed entries, converting foreign currencies) has not been validated. This is the most significant technical risk in the product.',
            },
          ],
        },
        { h: 'What I would do differently' },
        {
          items: [
            {
              title: 'More user conversations before finalising the flows.',
              text: 'The research for this project was primarily desk-based with one user conversation. A stronger research phase would include five to eight conversations with actual Nigerian freelancers covering a range of income levels, platforms, and levels of tax awareness. Some of the assumptions I made about user behaviour, particularly around the deductions screen and the document upload flow, are reasonable but unvalidated.',
            },
          ],
        },
        {
          items: [
            {
              title: 'Pricing research.',
              text: 'The ₦15,000 starting price for basic filing and ₦25,000 for the freelancer plan were set based on positioning against human accountants (₦50,000 to ₦150,000) and reasonable estimation. The right pricing for a new service in this market requires actual willingness-to-pay research: asking real users the maximum they would pay before choosing not to use the service.',
            },
          ],
        },
      ],
    },
  ],
  short: {
    sections: [
      {
        id: 'short-goal',
        title: 'The goal',
        blocks: [
          {
            draft: 'Fileo is an AI-native tax filing service for Nigerian freelancers and remote workers. The user answers simple questions, uploads their documents, and approves a summary. Fileo does everything else, including filing directly with the relevant state revenue service. Fileo started as a design project. I am now building it into a working mobile app.',
          },
        ],
      },
      {
        id: 'short-problem',
        title: 'The problem',
        blocks: [
          {
            draft: 'Nigerian freelancers and remote workers with irregular, multi-source income are now legally required to file annual tax returns, but they lack the knowledge, documentation, and financial means to do it alone. The deadline for filing was March 31, 2026. On that day, the government portals crashed under the volume of users attempting to comply.',
          },
        ],
      },
      {
        id: 'short-method',
        title: 'How I found out',
        blocks: [
          {
            draft: 'I started by writing down what I did not know. I conducted desk research, spoke with a potential user to validate assumptions, and audited every existing solution in the Nigerian tax compliance space. Every product available either required the user to do the hard work themselves, or was not yet live.',
          },
          { draft: 'The five user profiles came from desk research and from freelancers I know.' },
        ],
      },
      {
        id: 'short-designed',
        title: 'Three key decisions',
        blocks: [
          {
            decision: {
              title: 'One task per screen',
              screen: fileoFrame('Fileo onboarding screens', S.onboarding1, S.onboarding2, S.onboarding3),
              draft: 'Each screen asks for one thing. Creating the account is one short form. After that, every screen has one task: confirm the code, check identity, pick platforms, add income, add deductions. In the filing flow, a progress bar shows where you are.',
            },
          },
          {
            decision: {
              title: 'A hard gate on unresolved flagged transactions',
              screen: fileoFrame('Fileo flagged transactions screen', S.flaggedTransactions),
              draft: 'When Fileo detects a bank transaction with no description, it flags it and asks the user to categorise it. The user cannot proceed until every flagged transaction has a category.',
            },
          },
          {
            decision: {
              title: 'User reviews and approves the return before submission',
              screen: fileoFrame('Review screen with tabs', S.reviewSummary, S.reviewCalculation, S.reviewDocuments),
              draft: 'Before anything is submitted, the user sees a complete, plain-language summary of their return. They must actively approve it. Nothing is submitted without their confirmation.',
            },
          },
        ],
      },
      {
        id: 'short-engineering',
        title: 'The engineering trade-off',
        blocks: [
          {
            draft: 'Real identity checks could not be built yet. The verification providers I looked at need a company email address to open an account. I chose Dojah over Smile ID, because it has a self-serve test environment and follows Nigeria\'s data protection rules. Until then, the app stores only masked versions of a user\'s BVN and NIN, never the full numbers.',
          },
        ],
      },
      {
        id: 'short-result',
        title: 'The result',
        blocks: [
          {
            draft: 'Fileo is being built as a working Android app. Sign-up and sign-in are real. Four people have tested the demo, and their feedback changed the design. No real returns have been filed yet.',
          },
        ],
      },
    ],
  },
};
