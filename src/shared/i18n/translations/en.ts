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