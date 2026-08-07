/**
 * English translation dictionary — the canonical key set.
 *
 * Every other language dictionary is typed as `DeepPartial<typeof en>` so
 * missing keys gracefully fall back to English instead of breaking the build.
 * Keys are dot-namespaced by surface.
 */
export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading…',
    all: 'All',
    required: 'Required',
    language: 'Language',
    contactUs: 'Contact Us',
    getInTouch: 'Get in Touch',
    learnMore: 'Learn More',
  },

  language: {
    label: 'Language',
    select: 'Select language',
    switcher: 'Display language',
    description: 'Choose the language for content across the platform.',
    saved: 'Language preference updated',
    en: 'English',
    am: 'Amharic',
    om: 'Afaan Oromo',
  },

  settings: {
    title: 'Settings',
    languageSection: 'Language & Region',
    languageHint:
      'Content (scenarios, articles and resources) will be shown in your selected language.',
  },

  content: {
    language: 'Content Language',
    languageRequired: 'Please select a language',
    languageHint:
      'Select the language this content is written in. It will only be shown to users viewing that language.',
    filterByLanguage: 'Filter by language',
    allLanguages: 'All languages',
    languageColumn: 'Language',
  },

  scenario: {
    create: 'New Scenario Protocol',
    edit: 'Edit Scenario',
    title: 'Title',
    description: 'Description',
    saveCreate: 'Initialize Protocol',
    saveUpdate: 'Update Protocol',
    createdSuccess: 'Scenario created successfully',
    updatedSuccess: 'Scenario updated successfully',
    saveError: 'Failed to save scenario',
  },

  blog: {
    create: 'Draft New Article',
    edit: 'Edit Article',
    createdSuccess: 'Blog post created successfully',
    saveError: 'Failed to create blog post',
  },

  resource: {
    create: 'New Resource',
    edit: 'Edit Resource',
    createdSuccess: 'Resource created successfully',
    saveError: 'Failed to save resource',
  },

  nav: {
    about: 'About',
    features: 'Features',
    crowdsourcing: 'Crowdsourcing',
    faq: 'FAQ',
    login: 'Login',
    theme: 'Theme',
    language: 'Language',
    startGame: 'Start the Game',
    startGameShort: 'Start Game',
  },

  footer: {
    tagline:
      'Empowering minds through gamified digital literacy. Building a more truthful digital space.',
    pages: 'Pages',
    legal: 'Legal',
    aboutUs: 'About Us',
    blogResources: 'Blog & Resources',
    faq: 'FAQ',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookies: 'Cookies Policy',
    rights: '© 2026 Horizon Truth. All rights reserved.',
  },

  landing: {
    slide1Badge: 'Community Verified Content',
    slide1Title: 'Defending Truth in the Digital Age',
    slide1Subtitle: 'Together Against Misinformation',
    slide1Desc:
      'Horizon Truth equips you with interactive, real-world simulations to detect fake news, analyze sources, and outsmart digital deception through engaging gamified experiences.',
    slide1Cta: 'Start Your Training',
    slide2Badge: 'Crowdsourced Transparency',
    slide2Title: 'Power of Collective Intelligence',
    slide2Subtitle: 'Community-Driven Verification',
    slide2Desc:
      'Join a growing network of digital defenders reporting, reviewing, and validating suspicious content. Together, we create a safer and more trustworthy information ecosystem.',
    slide2Cta: 'View Community Reports',
    slide3Badge: 'Skill Up & Earn Rewards',
    slide3Title: 'Learn. Play. Protect.',
    slide3Subtitle: 'Gamified Digital Literacy',
    slide3Desc:
      'Sharpen your critical thinking skills through interactive challenges, quizzes, and scenario-based missions designed to make media literacy engaging and rewarding.',
    slide3Cta: 'Begin the Journey',
    playAsGuest: 'Play as Guest',

    featuresEyebrow: 'Interactive Learning',
    featuresTitle: 'Master Digital Literacy',
    featuresTitleHighlight: 'Through Play',
    featuresDesc:
      'Our gamified platform transforms complex media literacy concepts into engaging challenges. Learn to spot deepfakes, verify sources, and understand viral mechanics in a safe, simulated environment.',
    feature1Title: 'Real Scenarios',
    feature1Desc: 'Face actual misinformation cases reconstructed for learning.',
    feature2Title: 'Instant Feedback',
    feature2Desc: 'Understand why content is misleading as you play.',
    feature3Title: 'Skill Progression',
    feature3Desc: "Level up your 'Truth-Seeker' rank as you master new skills.",
    feature4Title: 'Earn Rewards',
    feature4Desc: 'Get recognized for your growth with badges and points.',

    crowdEyebrow: 'Collective Intelligence',
    crowdTitle: 'Together Against Deception',
    crowdDesc:
      'Harness the power of thousands. Our community-driven reporting system allows every user to be a guardian of the digital truth.',
    crowd1Title: 'Report Suspicious Content',
    crowd1Desc:
      'Find something fishy? Flag it instantly for community review with our simple reporting tools.',
    crowd2Title: 'Community Verification',
    crowd2Desc:
      "Join the 'Truth Nodes'—users who vote and provide evidence to verify or debunk reported content.",
    crowd3Title: 'Consensus Credibility',
    crowd3Desc:
      'Our algorithm calculates a credibility score based on community consensus and expert verification.',

    missionEyebrow: 'Our North Star',
    missionTitle: 'Why Horizon',
    missionTitleHighlight: 'Truth Matters',
    missionDesc:
      'In an era where information can be weaponized, truth is our most valuable asset. We believe that empowering citizens with critical thinking is more effective than any censorship.',
    mission1Title: 'Radical Transparency',
    mission1Desc:
      'Every verification is backed by community consensus and open data.',
    mission2Title: 'Empowerment First',
    mission2Desc:
      "We don't tell you what to believe; we give you the tools to decide.",
    confidenceScore: 'User Confidence Score',

    partnersEyebrow: 'Trusted Ecosystem',
    partnersTitle: 'Our Foundational Partners',
    partnersDesc:
      'Collaborating with leading institutions to build digital resilience across the nation.',
    partner1Title: 'Jimma University',
    partner1Desc: 'Academic curriculum integration & research.',
    partner2Title: 'Ministry of Peace',
    partner2Desc: 'National youth ambassador programs.',
    partner3Title: 'Sheger City',
    partner3Desc: 'Community-driven digital literacy workshops.',

    statActiveUsers: 'Active Users',
    statReportsDebunked: 'Reports Debunked',
    statVerifiers: 'Community Verifiers',
    statAccuracy: 'Accuracy Rate',

    faqEyebrow: 'Help Center',
    faqTitle: 'Expert',
    faqTitleHighlight: 'Answers',
    faqDesc:
      'Quick guide to understanding how Horizon Truth protects the digital frontier.',
    faqButton: 'Full Knowledge Base',
    faq1Q: 'What is Horizon Truth?',
    faq1A:
      'A gamified digital literacy platform designed to combat misinformation through interactive learning and community verification.',
    faq2Q: 'How does the game work?',
    faq2A:
      'You engage in simulated real-world misinformation challenges, learning to spot fake news through quizzes and critical exercises.',
    faq3Q: 'Is my data secure?',
    faq3A:
      'Absolutely. We use industry-standard encryption and collect minimal data necessary for your learning progress.',
    faq4Q: 'How can I contribute?',
    faq4A:
      'By reporting suspicious content you find online and participating in community verification votes.',

    newsletterTitle: 'Stay Ahead of Deception',
    newsletterDesc:
      'Join our community of digital defenders. Subscribe to get the latest insights on media literacy, platform updates, and verified news straight to your inbox.',
    newsletterPlaceholder: 'Enter your email address',
    newsletterSubscribe: 'Subscribe Now',
    newsletterSubscribing: 'Subscribing...',
    newsletterSuccessTitle: 'Welcome to the Frontline',
    newsletterSuccessDesc:
      'Your subscription is confirmed. You are now part of a global network of digital defenders. Watch your inbox for high-priority updates.',
    newsletterAnother: 'Subscribe another email',
    newsletterDisclaimer:
      'By subscribing, you agree to our Privacy Policy. No spam, just truth.',
    newsletterSuccessToast:
      'Newsletter Subscription Successful! You will receive an email reservation notification.',
    newsletterErrorToast: 'Failed to subscribe. Please try again.',
  },

  about: {
    heroTitle: 'About',
    heroHighlight: 'Horizon Truth',
    heroDesc:
      "We're on a mission to combat misinformation through education, technology, and community engagement.",
    ourStory: 'Our Story',
    meetTeam: 'Meet Our Team',

    genesisEyebrow: 'Our Genesis',
    storyTitle: 'How Horizon',
    storyTitleHighlight: 'Truth Began.',
    storyP1:
      'Horizon Truth was founded in 2023 by a team of digital literacy advocates, educators, and technology experts who recognized the growing threat of misinformation in our increasingly connected world.',
    storyP2:
      "What started as a university research project quickly evolved into a comprehensive platform dedicated to helping individuals, especially youth, develop the critical thinking skills needed to navigate today's complex information landscape.",
    journeyTitle: 'The Journey',
    journey1Title: 'Research Phase',
    journey1Date: 'Jan 2023 - April 2023',
    journey1Desc:
      'Conducted extensive research on misinformation patterns and digital literacy gaps.',
    journey2Title: 'Platform Development',
    journey2Date: 'May 2023 - Sept 2023',
    journey2Desc:
      'Built the initial version of our gamified learning platform and community tools.',
    journey3Title: 'Launch & Growth',
    journey3Date: 'Oct 2023 - Present',
    journey3Desc:
      'Launched publicly and continuously expanded our resources based on feedback.',

    missionTitle: 'Our Mission',
    missionDesc:
      'To empower individuals with the critical thinking skills and digital literacy needed to identify, analyze, and combat misinformation in all its forms, creating a more informed and resilient society.',
    visionTitle: 'Our Vision',
    visionDesc:
      'We envision a world where individuals are equipped to navigate the digital landscape responsibly, where truth prevails over falsehood, and where communities collaboratively foster information integrity.',

    valuesEyebrow: 'Our North Star',
    valuesTitle: 'Intrinsic',
    valuesTitleHighlight: 'Values.',
    value1Title: 'Integrity',
    value1Desc:
      'We practice what we preach, ensuring our content is accurate and transparent.',
    value2Title: 'Innovation',
    value2Desc:
      'We continuously develop new approaches to make digital literacy engaging.',
    value3Title: 'Collaboration',
    value3Desc:
      'We believe combating misinformation requires collective effort.',
    value4Title: 'Education',
    value4Desc:
      'We prioritize empowering people with knowledge over simply debunking.',

    ctaTitle: 'Ready to Join',
    ctaTitleHighlight: 'the Fight?',
    ctaDesc:
      'Sign up now and start your journey towards becoming a misinformation warrior today.',
    ctaStartPlaying: 'Start Playing',
  },

  contact: {
    heroTitle: 'Connect With',
    heroSubtitle: 'The Truth',
    heroDesc:
      "Have questions? We're here to help you navigate the digital landscape.",
    infoTitle: 'Contact Information',
    emailUs: 'Email Us',
    callUs: 'Call Us',
    visitUs: 'Visit Us',
    visitLine1: 'Bole Road, Addis Ababa',
    visitLine2: 'Ethiopia',
    businessHours: 'Business Hours',
    weekdays: 'Monday - Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    closed: 'Closed',
    successTitle: 'Transmission Received',
    successDesc:
      'Our operatives have secured your transmission. We will review the data and respond via your provided channel within the next briefing cycle.',
    sendNew: 'Send New Message',
    formTitle: 'Send a Message',
    formDesc: 'Initialize a direct communication vector with our team.',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Comms Email',
    subject: 'Subject Vector',
    message: 'Message Payload',
    messagePlaceholder: 'Enter your message transmission...',
    subjectPlaceholder: 'Technical Support / Partnership',
    send: 'Send Message',
    sending: 'Transmitting...',
    successToast: 'Thank you! Your message has been sent successfully.',
    errorToast: 'Failed to send message. Please try again.',
  },

  faq: {
    title: 'Frequently Asked',
    titleHighlight: 'Questions',
    desc: 'Find answers to common questions about Horizon Truth and how to make the most of our platform.',
    searchPlaceholder: 'Search FAQs...',
    categories: 'Categories',
    catGeneral: 'General',
    catAccount: 'Account & Access',
    catGame: 'Game & Learning',
    catVerification: 'Content Verification',
    catTechnical: 'Technical Support',
    catPrivacy: 'Privacy & Security',
    stillQuestions: 'Still have questions?',
    stillDesc:
      "Can't find what you're looking for? Our support team is here to help you.",
    contactSupport: 'Contact Support',
    searchResultsFor: 'Search Results for',
    questionsSuffix: 'Questions',
    questionsFound: 'questions found',
    noResults: 'No results found',
    noResultsDesc:
      'Try using different keywords or selecting a different category.',
    clearFilters: 'Clear all filters',
    stillNeedHelp: 'Still need help?',
    stillNeedHelpDesc:
      'Our experts are available to clarify any doubts about our platform.',
    emailSupport: 'Email Support',
  },

  auth: {
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to continue your mission.',
    loginBadge: 'Next-Gen Trust Protocol',
    loginDashboard: 'Access your decentralized verification dashboard',
    registerTitle: 'Create Account',
    registerSubtitle: 'Join the fight against misinformation.',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    emailOrUsername: 'Email or Username',
    emailOrUsernamePlaceholder: 'Enter your email or username',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signingIn: 'Signing in...',
    authenticating: 'Authenticating...',
    forgot: 'Forgot?',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    createOne: 'Create One',
    welcomeToast: 'Welcome back!',
    authFailedToast: 'Authentication failed',
    loginFailed: 'Login failed. Please check your credentials.',
  },

  moderation: {
    title: 'Moderation',
    subtitle: 'Queue health, trends, and the work waiting for an owner.',
    queue: 'Moderation queue',
    dashboard: 'Moderation dashboard',
    appeals: 'Appeals',
    analytics: 'Moderation analytics',
    audit: 'Moderation audit',
    settings: 'Moderation settings',

    // Overview cards
    pendingReports: 'Pending reports',
    awaitingReview: 'Awaiting review',
    escalated: 'Escalated',
    flaggedContent: 'Flagged content',
    suspendedUsers: 'Suspended users',
    activeModerators: 'Active moderators',
    resolvedToday: 'Resolved today',
    averageResolution: 'Average resolution',

    // Case
    caseNumber: 'Case number',
    reportedContent: 'Reported content',
    reportDetails: 'Report details',
    history: 'History',
    reporter: 'Reporter',
    reportedUser: 'Reported user',
    anonymous: 'Anonymous',
    owner: 'Owner',
    unassigned: 'Unassigned',
    evidence: 'Evidence',
    outcome: 'Outcome',
    severity: 'Severity',
    status: 'Status',

    // Actions
    claimCase: 'Claim case',
    startReview: 'Start review',
    applyFlags: 'Apply flags',
    hideContent: 'Hide content',
    deleteContent: 'Delete content',
    restoreContent: 'Restore content',
    escalate: 'Escalate',
    uphold: 'Uphold and close',
    dismiss: 'Dismiss as unfounded',
    reopen: 'Reopen case',
    merge: 'Merge duplicates',

    // User moderation
    riskScore: 'Risk score',
    violationRecord: 'Violation record',
    issueWarning: 'Issue a warning',
    suspendUser: 'Suspend temporarily',
    banUser: 'Ban permanently',
    liftSanctions: 'Lift sanctions',
    sanctionHistory: 'Sanction history',

    // Notes and reasons
    moderatorNotes: 'Moderator notes',
    addNote: 'Add note',
    notesPrivate: 'Private to the moderation team.',
    reason: 'Reason',
    reasonRequired: 'A reason is required — this is a permanent record.',
    internalNotes: 'Internal notes (optional)',
    confirm: 'Confirm',
    cancel: 'Cancel',

    // Appeals
    appealNumber: 'Appeal number',
    appealReason: 'Why the user is appealing',
    upholdAppeal: 'Uphold appeal',
    rejectAppeal: 'Reject appeal',
    appealResponse: 'Your response to the user',

    // Empty and error states
    emptyQueue: 'The queue is empty — nothing to moderate.',
    noMatches: 'No cases match this view.',
    loadFailed: 'The moderation dashboard could not be loaded.',
  },
};

export type TranslationDict = typeof en;
