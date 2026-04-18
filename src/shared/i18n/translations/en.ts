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