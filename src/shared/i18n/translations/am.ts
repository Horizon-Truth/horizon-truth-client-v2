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
    createdSuccess: 'መርጃ በተሳካ ሁኔታ ተፈጥሯል',
    saveError: 'መርጃ ማስቀመጥ አልተሳካም',
  },

  nav: {
    about: 'ስለ እኛ',
    features: 'ባህሪያት',
    crowdsourcing: 'የማህበረሰብ ተሳትፎ',
    faq: 'ተደጋጋሚ ጥያቄዎች',
    login: 'ግባ',
    theme: 'ገጽታ',
    language: 'ቋንቋ',
    startGame: 'ጨዋታውን ጀምር',
    startGameShort: 'ጀምር',
  },

  footer: {
    tagline:
      'በጨዋታ መልክ ባለው ዲጂታል እውቀት አእምሮን ማብቃት። ይበልጥ እውነተኛ የሆነ ዲጂታል ምህዳር መገንባት።',
    pages: 'ገጾች',
    legal: 'ሕጋዊ',
    aboutUs: 'ስለ እኛ',
    blogResources: 'ብሎግ እና መርጃዎች',
    faq: 'ተደጋጋሚ ጥያቄዎች',
    contact: 'አግኙን',
    privacy: 'የግላዊነት ፖሊሲ',
    terms: 'የአገልግሎት ውል',
    cookies: 'የኩኪ ፖሊሲ',
    rights: '© 2026 Horizon Truth። መብቱ በሕግ የተጠበቀ ነው።',
  },

  landing: {
    slide1Badge: 'በማህበረሰብ የተረጋገጠ ይዘት',
    slide1Title: 'በዲጂታል ዘመን እውነትን መከላከል',
    slide1Subtitle: 'በጋራ ሐሰተኛ መረጃን እንታገል',
    slide1Desc:
      'Horizon Truth ሐሰተኛ ዜናን ለመለየት፣ ምንጮችን ለመተንተን እና ዲጂታል ማታለልን ለማሸነፍ በሚያስደስት የጨዋታ ተሞክሮ መስተጋብራዊ የገሃዱ ዓለም ማስመሰያዎችን ያስታጥቅዎታል።',
    slide1Cta: 'ስልጠናዎን ይጀምሩ',
    slide2Badge: 'በማህበረሰብ የተደገፈ ግልጽነት',
    slide2Title: 'የጋራ ብልህነት ኃይል',
    slide2Subtitle: 'በማህበረሰብ የሚመራ ማረጋገጫ',
    slide2Desc:
      'አጠራጣሪ ይዘትን በማሳወቅ፣ በመገምገም እና በማረጋገጥ እያደገ ካለው የዲጂታል ተከላካዮች መረብ ጋር ይቀላቀሉ። በጋራ ይበልጥ ደህንነቱ የተጠበቀ እና አስተማማኝ የመረጃ ስነ-ምህዳር እንፈጥራለን።',