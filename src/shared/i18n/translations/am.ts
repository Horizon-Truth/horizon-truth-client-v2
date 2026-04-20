import type { DeepPartial } from '../types';
import type { TranslationDict } from './en';

/**
 * Amharic (አማርኛ) translations. Partial — any missing key falls back to English.
 */
export const am: DeepPartial<TranslationDict> = {
  common: {
    save: 'አስቀምጥ',
    cancel: 'ሰርዝ',
    create: 'ፍጠር',
    edit: 'አስተካክል',
    delete: 'ሰርዝ',
    search: 'ፈልግ',
    filter: 'አጣራ',
    loading: 'በመጫን ላይ…',
    all: 'ሁሉም',
    required: 'ያስፈልጋል',
    language: 'ቋንቋ',
    contactUs: 'ያግኙን',
    getInTouch: 'ያግኙን',
    learnMore: 'ተጨማሪ ይወቁ',
  },

  language: {
    label: 'ቋንቋ',
    select: 'ቋንቋ ይምረጡ',
    switcher: 'የማሳያ ቋንቋ',
    description: 'በመድረኩ ላይ ላለው ይዘት ቋንቋ ይምረጡ።',
    saved: 'የቋንቋ ምርጫ ተዘምኗል',
    en: 'እንግሊዝኛ',
    am: 'አማርኛ',
    om: 'ኦሮምኛ',
  },

  settings: {
    title: 'ቅንብሮች',
    languageSection: 'ቋንቋ እና አካባቢ',
    languageHint: 'ይዘቶች (ሁኔታዎች፣ ጽሁፎች እና መርጃዎች) በመረጡት ቋንቋ ይታያሉ።',
  },

  content: {
    language: 'የይዘት ቋንቋ',
    languageRequired: 'እባክዎ ቋንቋ ይምረጡ',
    languageHint:
      'ይህ ይዘት የተጻፈበትን ቋንቋ ይምረጡ። ያንን ቋንቋ ለሚመለከቱ ተጠቃሚዎች ብቻ ይታያል።',
    filterByLanguage: 'በቋንቋ አጣራ',
    allLanguages: 'ሁሉም ቋንቋዎች',
    languageColumn: 'ቋንቋ',
  },

  scenario: {
    create: 'አዲስ ሁኔታ',
    edit: 'ሁኔታ አስተካክል',
    title: 'ርዕስ',
    description: 'መግለጫ',
    saveCreate: 'ሁኔታ ጀምር',
    saveUpdate: 'ሁኔታ አዘምን',
    createdSuccess: 'ሁኔታ በተሳካ ሁኔታ ተፈጥሯል',
    updatedSuccess: 'ሁኔታ በተሳካ ሁኔታ ተዘምኗል',
    saveError: 'ሁኔታ ማስቀመጥ አልተሳካም',
  },

  blog: {
    create: 'አዲስ ጽሁፍ',
    edit: 'ጽሁፍ አስተካክል',
    createdSuccess: 'ጽሁፍ በተሳካ ሁኔታ ተፈጥሯል',
    saveError: 'ጽሁፍ መፍጠር አልተሳካም',
  },

  resource: {
    create: 'አዲስ መርጃ',
    edit: 'መርጃ አስተካክል',