import type { DeepPartial } from '../types';
import type { TranslationDict } from './en';

/**
 * Afaan Oromo translations. Partial — any missing key falls back to English.
 */
export const om: DeepPartial<TranslationDict> = {
  common: {
    save: 'Olkaa’i',
    cancel: 'Haqi',
    create: 'Uumi',
    edit: 'Gulaali',
    delete: 'Haqi',
    search: 'Barbaadi',
    filter: 'Calali',
    loading: 'Fe’aa jira…',
    all: 'Hunda',
    required: 'Barbaachisaa',
    language: 'Afaan',
  },

  language: {
    label: 'Afaan',
    select: 'Afaan filadhu',
    switcher: 'Afaan agarsiisaa',
    description: 'Afaan qabiyyee marsariitii irraa filadhu.',
    saved: 'Filannoon afaanii haaromfameera',
    en: 'Ingiliffa',
    am: 'Amaariffa',
    om: 'Afaan Oromoo',
  },

  settings: {
    title: 'Qindaa’ina',
    languageSection: 'Afaanii fi Naannoo',
    languageHint:
      'Qabiyyeen (haalawwan, barreeffamootaa fi qabeenyawwan) afaan filattetiin agarsiifama.',
  },

  content: {
    language: 'Afaan Qabiyyee',
    languageRequired: 'Maaloo afaan filadhu',
    languageHint:
      'Afaan qabiyyeen kun ittiin barreeffame filadhu. Fayyadamtoota afaan sana ilaalan qofaaf agarsiifama.',
    filterByLanguage: 'Afaaniin calali',
    allLanguages: 'Afaanota hunda',
    languageColumn: 'Afaan',
  },

  scenario: {
    create: 'Haala Haaraa',
    edit: 'Haala Gulaali',
    title: 'Mata-duree',
    description: 'Ibsa',
    saveCreate: 'Haala Jalqabi',
    saveUpdate: 'Haala Haaromsi',
    createdSuccess: 'Haalli milkaa’inaan uumame',
    updatedSuccess: 'Haalli milkaa’inaan haaromfame',
    saveError: 'Haala olkaa’uun hin milkoofne',
  },

  blog: {
    create: 'Barreeffama Haaraa',
    edit: 'Barreeffama Gulaali',
    createdSuccess: 'Barreeffamni milkaa’inaan uumame',
    saveError: 'Barreeffama uumuun hin milkoofne',
  },

  resource: {
    create: 'Qabeenya Haaraa',
    edit: 'Qabeenya Gulaali',
    createdSuccess: 'Qabeenyi milkaa’inaan uumame',
    saveError: 'Qabeenya olkaa’uun hin milkoofne',
  },
};
