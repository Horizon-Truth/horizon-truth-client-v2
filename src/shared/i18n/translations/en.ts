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
