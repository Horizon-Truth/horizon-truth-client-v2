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