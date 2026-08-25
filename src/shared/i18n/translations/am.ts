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
    dataRetention: 'የውሂብ ማስቀመጫ ፖሊሲ',
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
    slide2Cta: 'የማህበረሰብ ሪፖርቶችን ይመልከቱ',
    slide3Badge: 'ክህሎት ያሳድጉ እና ሽልማት ያግኙ',
    slide3Title: 'ተማር። ተጫወት። ጠብቅ።',
    slide3Subtitle: 'በጨዋታ መልክ ያለ ዲጂታል እውቀት',
    slide3Desc:
      'የመገናኛ ብዙኃን እውቀትን አሳታፊ እና ጠቃሚ ለማድረግ በተዘጋጁ መስተጋብራዊ ፈተናዎች፣ ጥያቄዎች እና ሁኔታ-ተኮር ተልዕኮዎች የሂሳዊ አስተሳሰብ ክህሎትዎን ያሳድጉ።',
    slide3Cta: 'ጉዞውን ይጀምሩ',
    playAsGuest: 'እንደ እንግዳ ይጫወቱ',

    featuresEyebrow: 'መስተጋብራዊ ትምህርት',
    featuresTitle: 'ዲጂታል እውቀትን ይቆጣጠሩ',
    featuresTitleHighlight: 'በጨዋታ',
    featuresDesc:
      'የእኛ የጨዋታ መድረክ ውስብስብ የመገናኛ ብዙኃን እውቀት ሀሳቦችን ወደ አሳታፊ ፈተናዎች ይለውጣል። ዲፕፌክን መለየት፣ ምንጮችን ማረጋገጥ እና የቫይራል ስልቶችን በደህንነቱ በተጠበቀ አካባቢ መረዳት ይማሩ።',
    feature1Title: 'እውነተኛ ሁኔታዎች',
    feature1Desc: 'ለትምህርት የተዘጋጁ ትክክለኛ የሐሰተኛ መረጃ ጉዳዮችን ይጋፈጡ።',
    feature2Title: 'ፈጣን ግብረመልስ',
    feature2Desc: 'ይዘት ለምን አሳሳች እንደሆነ እየተጫወቱ ይረዱ።',
    feature3Title: 'የክህሎት እድገት',
    feature3Desc: 'አዳዲስ ክህሎቶችን ሲቆጣጠሩ የ‘እውነት-ፈላጊ’ ደረጃዎን ያሳድጉ።',
    feature4Title: 'ሽልማት ያግኙ',
    feature4Desc: 'በባጆች እና ነጥቦች ለእድገትዎ እውቅና ያግኙ።',

    crowdEyebrow: 'የጋራ ብልህነት',
    crowdTitle: 'በጋራ ማታለልን እንታገል',
    crowdDesc:
      'የብዙ ሺዎችን ኃይል ይጠቀሙ። በማህበረሰብ የሚመራ የእኛ የሪፖርት ስርዓት እያንዳንዱ ተጠቃሚ የዲጂታል እውነት ጠባቂ እንዲሆን ያስችለዋል።',
    crowd1Title: 'አጠራጣሪ ይዘትን ሪፖርት ያድርጉ',
    crowd1Desc:
      'አጠራጣሪ ነገር አግኝተዋል? በቀላል የሪፖርት መሣሪያዎቻችን ለማህበረሰብ ግምገማ ወዲያውኑ ምልክት ያድርጉበት።',
    crowd2Title: 'የማህበረሰብ ማረጋገጫ',
    crowd2Desc:
      'ሪፖርት የተደረገ ይዘትን ለማረጋገጥ ወይም ለማስተባበል ድምጽ የሚሰጡ እና ማስረጃ የሚያቀርቡ ‘የእውነት ኖዶች’ ተጠቃሚዎችን ይቀላቀሉ።',
    crowd3Title: 'የስምምነት ታማኝነት',
    crowd3Desc:
      'የእኛ አልጎሪዝም በማህበረሰብ ስምምነት እና በባለሙያ ማረጋገጫ ላይ ተመስርቶ የታማኝነት ነጥብ ያሰላል።',

    missionEyebrow: 'የእኛ መሪ ኮከብ',
    missionTitle: 'Horizon Truth',
    missionTitleHighlight: 'ለምን አስፈላጊ ነው',
    missionDesc:
      'መረጃ መሣሪያ ሊሆን በሚችልበት ዘመን፣ እውነት እጅግ ውድ ሀብታችን ነው። ዜጎችን በሂሳዊ አስተሳሰብ ማብቃት ከማንኛውም ሳንሱር የበለጠ ውጤታማ እንደሆነ እናምናለን።',
    mission1Title: 'ጥልቅ ግልጽነት',
    mission1Desc: 'እያንዳንዱ ማረጋገጫ በማህበረሰብ ስምምነት እና በክፍት መረጃ የተደገፈ ነው።',
    mission2Title: 'ማብቃት ቅድሚያ',
    mission2Desc:
      'ምን ማመን እንዳለብዎ አንነግርዎትም፤ ለመወሰን የሚያስፈልጉዎትን መሣሪያዎች እንሰጥዎታለን።',
    confidenceScore: 'የተጠቃሚ የመተማመን ነጥብ',

    partnersEyebrow: 'የታመነ ስነ-ምህዳር',
    partnersTitle: 'መሰረታዊ አጋሮቻችን',
    partnersDesc:
      'በመላ ሀገሪቱ ዲጂታል ጥንካሬን ለመገንባት ከመሪ ተቋማት ጋር በመተባበር።',
    partner1Title: 'ጅማ ዩኒቨርሲቲ',
    partner1Desc: 'የትምህርት ስርዓተ-ትምህርት ውህደት እና ምርምር።',
    partner2Title: 'የሰላም ሚኒስቴር',
    partner2Desc: 'ብሔራዊ የወጣቶች አምባሳደር ፕሮግራሞች።',
    partner3Title: 'ሸገር ከተማ',
    partner3Desc: 'በማህበረሰብ የሚመሩ የዲጂታል እውቀት ስልጠናዎች።',

    statActiveUsers: 'ንቁ ተጠቃሚዎች',
    statReportsDebunked: 'የተስተባበሉ ሪፖርቶች',
    statVerifiers: 'የማህበረሰብ አረጋጋጮች',
    statAccuracy: 'የትክክለኛነት መጠን',

    faqEyebrow: 'የእገዛ ማዕከል',
    faqTitle: 'የባለሙያ',
    faqTitleHighlight: 'መልሶች',
    faqDesc:
      'Horizon Truth የዲጂታል ድንበሩን እንዴት እንደሚጠብቅ ለመረዳት ፈጣን መመሪያ።',
    faqButton: 'ሙሉ የእውቀት ቋት',
    faq1Q: 'Horizon Truth ምንድን ነው?',
    faq1A:
      'በመስተጋብራዊ ትምህርት እና በማህበረሰብ ማረጋገጫ ሐሰተኛ መረጃን ለመታገል የተዘጋጀ በጨዋታ መልክ ያለ የዲጂታል እውቀት መድረክ።',
    faq2Q: 'ጨዋታው እንዴት ይሰራል?',
    faq2A:
      'በማስመሰል በተዘጋጁ የገሃዱ ዓለም የሐሰተኛ መረጃ ፈተናዎች ይሳተፋሉ፣ በጥያቄዎች እና በሂሳዊ ልምምዶች ሐሰተኛ ዜናን መለየት ይማራሉ።',
    faq3Q: 'ውሂቤ ደህንነቱ የተጠበቀ ነው?',
    faq3A:
      'በፍጹም። የኢንዱስትሪ ደረጃ ምስጠራን እንጠቀማለን እና ለትምህርት እድገትዎ የሚያስፈልገውን ዝቅተኛ ውሂብ ብቻ እንሰበስባለን።',
    faq4Q: 'እንዴት ማበርከት እችላለሁ?',
    faq4A:
      'በመስመር ላይ የሚያገኙትን አጠራጣሪ ይዘት ሪፖርት በማድረግ እና በማህበረሰብ ማረጋገጫ ድምጾች በመሳተፍ።',

    newsletterTitle: 'ከማታለል ቀድመው ይራመዱ',
    newsletterDesc:
      'የእኛን የዲጂታል ተከላካዮች ማህበረሰብ ይቀላቀሉ። የመገናኛ ብዙኃን እውቀት ግንዛቤዎችን፣ የመድረክ ዝመናዎችን እና የተረጋገጡ ዜናዎችን በቀጥታ ወደ ኢሜይልዎ ለማግኘት ይመዝገቡ።',
    newsletterPlaceholder: 'የኢሜይል አድራሻዎን ያስገቡ',
    newsletterSubscribe: 'አሁን ይመዝገቡ',
    newsletterSubscribing: 'በመመዝገብ ላይ...',
    newsletterSuccessTitle: 'ወደ ግንባር ቀደም እንኳን ደህና መጡ',
    newsletterSuccessDesc:
      'ምዝገባዎ ተረጋግጧል። አሁን የዓለም አቀፍ የዲጂታል ተከላካዮች መረብ አካል ነዎት። ለከፍተኛ ቅድሚያ ዝመናዎች ኢሜይልዎን ይከታተሉ።',
    newsletterAnother: 'ሌላ ኢሜይል ይመዝግቡ',
    newsletterDisclaimer:
      'በመመዝገብ የግላዊነት ፖሊሲያችንን ይስማማሉ። ስፓም የለም፣ እውነት ብቻ።',
    newsletterSuccessToast:
      'የዜና መልዕክት ምዝገባ ተሳክቷል! የኢሜይል ማረጋገጫ ማስታወቂያ ይደርስዎታል።',
    newsletterErrorToast: 'መመዝገብ አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
    fundedBy: 'የተደገፈ / የሚደግፈው',
    unicefAttribution: 'ዩኒሴፍ',
  },

  about: {
    heroTitle: 'ስለ',
    heroHighlight: 'Horizon Truth',
    heroDesc:
      'በትምህርት፣ በቴክኖሎጂ እና በማህበረሰብ ተሳትፎ ሐሰተኛ መረጃን ለመታገል በተልዕኮ ላይ ነን።',
    ourStory: 'ታሪካችን',
    meetTeam: 'ቡድናችንን ይተዋወቁ',

    genesisEyebrow: 'መነሻችን',
    storyTitle: 'Horizon Truth',
    storyTitleHighlight: 'እንዴት ተጀመረ።',
    storyP1:
      'Horizon Truth በ2023 ዓ.ም በተያያዘ ዓለማችን ውስጥ እያደገ ያለውን የሐሰተኛ መረጃ ስጋት በተገነዘቡ የዲጂታል እውቀት ተሟጋቾች፣ አስተማሪዎች እና የቴክኖሎጂ ባለሙያዎች ቡድን ተመሰረተ።',
    storyP2:
      'እንደ ዩኒቨርሲቲ የምርምር ፕሮጀክት የተጀመረው ነገር በፍጥነት ግለሰቦች በተለይም ወጣቶች የዛሬውን ውስብስብ የመረጃ ምህዳር ለመዳሰስ የሚያስፈልጉትን የሂሳዊ አስተሳሰብ ክህሎቶች እንዲያዳብሩ የሚረዳ ሁሉን አቀፍ መድረክ ሆነ።',
    journeyTitle: 'ጉዞው',
    journey1Title: 'የምርምር ምዕራፍ',
    journey1Date: 'ጥር 2023 - ሚያዝያ 2023',
    journey1Desc:
      'በሐሰተኛ መረጃ ስልቶች እና በዲጂታል እውቀት ክፍተቶች ላይ ሰፊ ምርምር ተካሄደ።',
    journey2Title: 'የመድረክ ልማት',
    journey2Date: 'ግንቦት 2023 - መስከረም 2023',
    journey2Desc:
      'የመጀመሪያውን የጨዋታ የትምህርት መድረክ እና የማህበረሰብ መሣሪያዎችን ገነባን።',
    journey3Title: 'ጅማሮ እና እድገት',
    journey3Date: 'ጥቅምት 2023 - አሁን',
    journey3Desc:
      'በይፋ ተጀመረ እና በግብረመልስ ላይ ተመስርቶ መርጃዎቻችንን በተከታታይ አስፋፋን።',

    missionTitle: 'ተልዕኳችን',
    missionDesc:
      'ግለሰቦችን ሐሰተኛ መረጃን በሁሉም መልኩ ለመለየት፣ ለመተንተን እና ለመታገል በሚያስፈልጉ የሂሳዊ አስተሳሰብ ክህሎቶች እና ዲጂታል እውቀት ማብቃት፣ ይበልጥ የተረዳ እና ጠንካራ ማህበረሰብ መፍጠር።',
    visionTitle: 'ራዕያችን',
    visionDesc:
      'ግለሰቦች ዲጂታል ምህዳሩን በኃላፊነት ለመዳሰስ የተዘጋጁ የሚሆኑበት፣ እውነት በሐሰት ላይ የሚያሸንፍበት፣ ማህበረሰቦች በትብብር የመረጃ ታማኝነትን የሚያጎለብቱበት ዓለም እንመኛለን።',

    valuesEyebrow: 'የእኛ መሪ ኮከብ',
    valuesTitle: 'ውስጣዊ',
    valuesTitleHighlight: 'እሴቶች።',
    value1Title: 'ታማኝነት',
    value1Desc:
      'የምንሰብከውን እንለማመዳለን፣ ይዘታችን ትክክለኛ እና ግልጽ መሆኑን እናረጋግጣለን።',
    value2Title: 'ፈጠራ',
    value2Desc: 'ዲጂታል እውቀትን አሳታፊ ለማድረግ አዳዲስ አቀራረቦችን በተከታታይ እናዳብራለን።',
    value3Title: 'ትብብር',
    value3Desc: 'ሐሰተኛ መረጃን መታገል የጋራ ጥረት እንደሚጠይቅ እናምናለን።',
    value4Title: 'ትምህርት',
    value4Desc: 'ከማስተባበል ይልቅ ሰዎችን በእውቀት ማብቃትን እናስቀድማለን።',

    ctaTitle: 'ለመቀላቀል ዝግጁ ነዎት',
    ctaTitleHighlight: 'ትግሉን?',
    ctaDesc:
      'አሁን ይመዝገቡ እና ዛሬ የሐሰተኛ መረጃ ተዋጊ ለመሆን ጉዞዎን ይጀምሩ።',
    ctaStartPlaying: 'መጫወት ይጀምሩ',
  },

  contact: {
    heroTitle: 'ተገናኝ ከ',
    heroSubtitle: 'እውነት',
    heroDesc: 'ጥያቄዎች አሉዎት? ዲጂታል ምህዳሩን እንዲዳስሱ ለመርዳት እዚህ ነን።',
    infoTitle: 'የመገናኛ መረጃ',
    emailUs: 'ኢሜይል ያድርጉልን',
    callUs: 'ይደውሉልን',
    visitUs: 'ይጎብኙን',
    visitLine1: 'ቦሌ መንገድ፣ አዲስ አበባ',
    visitLine2: 'ኢትዮጵያ',
    businessHours: 'የስራ ሰዓታት',
    weekdays: 'ሰኞ - አርብ',
    saturday: 'ቅዳሜ',
    sunday: 'እሁድ',
    closed: 'ዝግ',
    successTitle: 'መልዕክት ደርሷል',
    successDesc:
      'ባልደረቦቻችን መልዕክትዎን ተቀብለዋል። ውሂቡን ገምግመን በሚቀጥለው የስራ ዑደት ውስጥ በሰጡት መንገድ ምላሽ እንሰጣለን።',
    sendNew: 'አዲስ መልዕክት ላክ',
    formTitle: 'መልዕክት ላክ',
    formDesc: 'ከቡድናችን ጋር ቀጥተኛ የመገናኛ መንገድ ይጀምሩ።',
    firstName: 'የመጀመሪያ ስም',
    lastName: 'የአባት ስም',
    email: 'የመገናኛ ኢሜይል',
    subject: 'ርዕሰ ጉዳይ',
    message: 'መልዕክት',
    messagePlaceholder: 'መልዕክትዎን ያስገቡ...',
    subjectPlaceholder: 'ቴክኒካዊ ድጋፍ / አጋርነት',
    send: 'መልዕክት ላክ',
    sending: 'በመላክ ላይ...',
    successToast: 'እናመሰግናለን! መልዕክትዎ በተሳካ ሁኔታ ተልኳል።',
    errorToast: 'መልዕክት መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
  },

  faq: {
    title: 'ተደጋጋሚ የሚነሱ',
    titleHighlight: 'ጥያቄዎች',
    desc: 'ስለ Horizon Truth እና መድረካችንን እንዴት በሚገባ መጠቀም እንደሚችሉ ለተለመዱ ጥያቄዎች መልሶችን ያግኙ።',
    searchPlaceholder: 'ጥያቄዎችን ፈልግ...',
    categories: 'ምድቦች',
    catGeneral: 'አጠቃላይ',
    catAccount: 'መለያ እና መዳረሻ',
    catGame: 'ጨዋታ እና ትምህርት',
    catVerification: 'የይዘት ማረጋገጫ',
    catTechnical: 'ቴክኒካዊ ድጋፍ',
    catPrivacy: 'ግላዊነት እና ደህንነት',
    stillQuestions: 'አሁንም ጥያቄዎች አሉዎት?',
    stillDesc:
      'የሚፈልጉትን ማግኘት አልቻሉም? የድጋፍ ቡድናችን ሊረዳዎ እዚህ አለ።',
    contactSupport: 'ድጋፍ ያግኙ',
    searchResultsFor: 'የፍለጋ ውጤቶች ለ',
    questionsSuffix: 'ጥያቄዎች',
    questionsFound: 'ጥያቄዎች ተገኝተዋል',
    noResults: 'ምንም ውጤት አልተገኘም',
    noResultsDesc: 'የተለያዩ ቁልፍ ቃላትን ይሞክሩ ወይም የተለየ ምድብ ይምረጡ።',
    clearFilters: 'ሁሉንም ማጣሪያዎች አጽዳ',
    stillNeedHelp: 'አሁንም እገዛ ይፈልጋሉ?',
    stillNeedHelpDesc:
      'ባለሙያዎቻችን ስለ መድረካችን ማንኛውንም ጥርጣሬ ለማብራራት ዝግጁ ናቸው።',
    emailSupport: 'የኢሜይል ድጋፍ',
  },

  auth: {
    loginTitle: 'እንኳን ደህና ተመለሱ',
    loginSubtitle: 'ተልዕኮዎን ለመቀጠል ይግቡ።',
    loginBadge: 'የቀጣይ ትውልድ የመተማመኛ ስርዓት',
    loginDashboard: 'የእርስዎን ያልተማከለ የማረጋገጫ ዳሽቦርድ ይድረሱ',
    registerTitle: 'መለያ ይፍጠሩ',
    registerSubtitle: 'ሐሰተኛ መረጃን በመታገል ይቀላቀሉ።',
    email: 'ኢሜይል',
    phone: 'ስልክ',
    password: 'የይለፍ ቃል',
    confirmPassword: 'የይለፍ ቃል ያረጋግጡ',
    fullName: 'ሙሉ ስም',
    emailOrUsername: 'ኢሜይል ወይም የተጠቃሚ ስም',
    emailOrUsernamePlaceholder: 'ኢሜይልዎን ወይም የተጠቃሚ ስምዎን ያስገቡ',
    signIn: 'ግባ',
    signUp: 'ተመዝገብ',
    signingIn: 'በመግባት ላይ...',
    authenticating: 'በማረጋገጥ ላይ...',
    forgot: 'ረሱ?',
    forgotPassword: 'የይለፍ ቃል ረሱ?',
    noAccount: 'መለያ የለዎትም?',
    haveAccount: 'መለያ አለዎት?',
    createOne: 'መለያ ይፍጠሩ',
    welcomeToast: 'እንኳን ደህና ተመለሱ!',
    authFailedToast: 'ማረጋገጥ አልተሳካም',
    loginFailed: 'መግባት አልተሳካም። እባክዎ መረጃዎን ያረጋግጡ።',
  },

  legal: {
    privacyPolicy: 'የግላዊነት ፖሊሲ',
    dataRetentionPolicy: 'የውሂብ ማስቀመጫ ፖሊሲ',
    privacyClausesTitle: 'ለስምምነቶች የግላዊነት ንዑሶች',
    privacyClausesSubtitle: 'የውስጥ/የኮንትራክት የግላዊነት ንዑሶች እና የስምምነት መሣሪያ',
    aboutThisDocument: 'ስለ እዚህ ሰነድ',
    privacyPolicyDesc:
      'ይህ የግላዊነት ፖሊሲ Dabbal Software Development PLC በHorizon Truth መድረክ ላይ የግላዊ መረጃዎን እንዴት እንደሚሰበስብ፣ እንዴት እንደሚጠቀም እና እንዴት እንደሚጋራ ያብራራል።',
    privacyPolicyDesc2:
      'የግላዊነት ፖሊሲው ከውሂብ ማስቀመጫ ፖሊሲ እና ከኩኪ ፖሊሲ ጋር በተያያዘ ነው። መረጃዎ እንዴት እንደሚታከም ሙሉ ገባታችሁን ለማረጋገጥ እነዚህን ሶስት ሰነዶች ይ伭ogeጡ።',
    dataRetentionDesc:
      'ይህ የውሂብ ማስቀመጫ ፖሊሲ በHorizon Truth መድረክ ላይ የተለያዩ ዓይነት የግላዊ መረጃዎች ምን ያህል ጊዜ እንደሚቀመጡ እና የውሂብ ማጥፋት እና ማስፋፊያ እንዴት እንደሚሠራ ያብራራል።',
    dataRetentionDesc2:
      'ከግላዊነት ፖሊሲ እና ከኩኪ ፖሊሲ ጋር በተያያዘ ነው።',
    privacyClausesDesc:
      'ይህ ሰነድ ከድርጅቶች ጋር በሚደረጉ ስምምነቶች ውስጥ የሚጠቀሙ የውስጥ የኮንትራክት የግላዊነት ንዑሶች እና የውሂብ ማስወንemd ስምምነት (DPA) መሣሪያ ያካትታል። ይህ የህዝብ ፖሊሲ አይደለም።',
    privacyClausesNotice:
      'ይህ የስራ መሣሪያ ነው፣ የህዝብ ፖሊሲ አይደለም። ከድርጅቶች ጋር በሚደረጉ ስምምነቶች ውስጥ የሚጠቀሙ የVendor/DPA ቋንቋ እና የኮንትራክት ንዑሶች ያካትታል።',
    internalDocument: 'የውስጥ / የኮንትራክት ሰነድ',
    version: 'ስሪት',
    effectiveDate: 'የተግባር ቀን',
    format: 'ፎርማት',
    organization: 'ድርጅት',
    documentInfo: 'የሰነድ መረጃ',
    viewPdf: 'ፒዲኤፍ ይመልከቱ',
    downloadPdf: 'ፒዲኤፍ ያውርዱ',
    relatedDocuments: 'ተዛabraቸውን ሰነዶች',
    relatedDocumentsDesc: 'ይህ ሰነድ ከሚከተሉት ፖሊሶች ጋር መዋስ አለበት:',
    type: 'ዓይነት',
    internalContractual: 'የውስጥ / የኮንትራክት',
    purpose: 'አmnare',
    privacyClausesPurpose: 'የድርጅት ስምምነቶች፣ DPAs እና የኮንትራክት የግላዊነት ንዑሶች',
  },

  moderation: {
    title: 'ማጣራት',
    subtitle: 'የወረፋ ሁኔታ፣ አዝማሚያዎች እና ባለቤት የሚጠብቅ ሥራ።',
    queue: 'የማጣራት ወረፋ',
    dashboard: 'የማጣራት ዳሽቦርድ',
    appeals: 'ይግባኞች',
    analytics: 'የማጣራት ትንተና',
    audit: 'የማጣራት ኦዲት',
    settings: 'የማጣራት ቅንብሮች',

    pendingReports: 'በመጠባበቅ ላይ ያሉ ሪፖርቶች',
    awaitingReview: 'ግምገማ የሚጠብቁ',
    escalated: 'ወደ ላይ የተላኩ',
    flaggedContent: 'ምልክት የተደረገበት ይዘት',
    suspendedUsers: 'የታገዱ ተጠቃሚዎች',
    activeModerators: 'ንቁ አጣሪዎች',
    resolvedToday: 'ዛሬ የተፈቱ',
    averageResolution: 'አማካይ የመፍቻ ጊዜ',

    caseNumber: 'የጉዳይ ቁጥር',
    reportedContent: 'ሪፖርት የተደረገ ይዘት',
    reportDetails: 'የሪፖርት ዝርዝሮች',
    history: 'ታሪክ',
    reporter: 'ሪፖርት አድራጊ',
    reportedUser: 'ሪፖርት የተደረገበት ተጠቃሚ',
    anonymous: 'ስም አልባ',
    owner: 'ባለቤት',
    unassigned: 'ያልተመደበ',
    evidence: 'ማስረጃ',
    outcome: 'ውጤት',
    severity: 'ክብደት',
    status: 'ሁኔታ',

    claimCase: 'ጉዳዩን ውሰድ',
    startReview: 'ግምገማ ጀምር',
    applyFlags: 'ምልክቶችን ተግብር',
    hideContent: 'ይዘቱን ደብቅ',
    deleteContent: 'ይዘቱን ሰርዝ',
    restoreContent: 'ይዘቱን መልስ',
    escalate: 'ወደ ላይ ላክ',
    uphold: 'አጽድቅና ዝጋ',
    dismiss: 'መሠረት የለውም ብለህ አሰናብት',
    reopen: 'ጉዳዩን እንደገና ክፈት',
    merge: 'ተደጋጋሚዎችን አዋህድ',

    riskScore: 'የአደጋ ነጥብ',
    violationRecord: 'የጥሰት መዝገብ',
    issueWarning: 'ማስጠንቀቂያ ስጥ',
    suspendUser: 'ለጊዜው አግድ',
    banUser: 'በቋሚነት አግድ',
    liftSanctions: 'ቅጣቶችን አንሳ',
    sanctionHistory: 'የቅጣት ታሪክ',

    moderatorNotes: 'የአጣሪ ማስታወሻዎች',
    addNote: 'ማስታወሻ ጨምር',
    notesPrivate: 'ለማጣሪያ ቡድን ብቻ የተወሰነ።',
    reason: 'ምክንያት',
    reasonRequired: 'ምክንያት ያስፈልጋል — ይህ ቋሚ መዝገብ ነው።',
    internalNotes: 'የውስጥ ማስታወሻዎች (አማራጭ)',
    confirm: 'አረጋግጥ',
    cancel: 'ሰርዝ',

    appealNumber: 'የይግባኝ ቁጥር',
    appealReason: 'ተጠቃሚው የሚያመለክትበት ምክንያት',
    upholdAppeal: 'ይግባኙን አጽድቅ',
    rejectAppeal: 'ይግባኙን ውድቅ አድርግ',
    appealResponse: 'ለተጠቃሚው የሚሰጥ ምላሽ',

    emptyQueue: 'ወረፋው ባዶ ነው — የሚጣራ ነገር የለም።',
    noMatches: 'ከዚህ እይታ ጋር የሚዛመድ ጉዳይ የለም።',
    loadFailed: 'የማጣራት ዳሽቦርዱን መጫን አልተቻለም።',
  },
};
