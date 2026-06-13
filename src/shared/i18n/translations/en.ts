/**
 * English translation dictionary — the canonical key set.
 *
 * Every other language dictionary is typed as `Partial<typeof en>` (via the
 * `TranslationDict` type) so missing keys gracefully fall back to English
 * instead of breaking the build. Keys are dot-namespaced by surface.
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
};

export type TranslationDict = typeof en;
