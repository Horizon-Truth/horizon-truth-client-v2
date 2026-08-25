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
    contactUs: 'Nu Quunnamaa',
    getInTouch: 'Nu Quunnamaa',
    learnMore: 'Dabalata Baradhu',
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

  nav: {
    about: 'Waa’ee Keenya',
    features: 'Amaloota',
    crowdsourcing: 'Hirmaannaa Hawaasaa',
    faq: 'Gaaffilee Yeroo Baayyee',
    login: 'Seeni',
    theme: 'Bifa',
    language: 'Afaan',
    startGame: 'Taphicha Jalqabi',
    startGameShort: 'Jalqabi',
  },

  footer: {
    tagline:
      'Beekumsa dijitaalaa tapha fakkaatuun sammuu cimsuu. Bakka dijitaalaa dhugaa qabu ijaaruu.',
    pages: 'Fuulota',
    legal: 'Seera',
    aboutUs: 'Waa’ee Keenya',
    blogResources: 'Blog & Qabeenya',
    faq: 'Gaaffilee Yeroo Baayyee',
    contact: 'Nu Quunnamaa',
    privacy: 'Imaammata Dhuunfaa',
    dataRetention: 'Imaammata Eegumsa Daataa',
    terms: 'Haala Tajaajilaa',
    cookies: 'Imaammata Kukii',
    rights: '© 2026 Horizon Truth. Mirgi seeraan eegamaadha.',
  },

  landing: {
    slide1Badge: 'Qabiyyee Hawaasaan Mirkanaa’e',
    slide1Title: 'Bara Dijitaalaa Keessatti Dhugaa Eeguu',
    slide1Subtitle: 'Waliin Odeeffannoo Sobaa Mormuu',
    slide1Desc:
      'Horizon Truth oduu sobaa adda baasuuf, madda xiinxaluuf, fi gowwoomsaa dijitaalaa moo’achuuf simannaa addunyaa dhugaa tapha nama hawwatuun si qopheessa.',
    slide1Cta: 'Leenjii Kee Jalqabi',
    slide2Badge: 'Iftoomina Hawaasaa',
    slide2Title: 'Humna Sammuu Waloo',
    slide2Subtitle: 'Mirkaneessa Hawaasaan Geggeeffamu',
    slide2Desc:
      'Network ittisaa dijitaalaa guddachaa jiru kan qabiyyee shakkisiisaa gabaasu, gamaaggamuu fi mirkaneessu waliin makami. Waliin naannoo odeeffannoo nageenya qabuu fi amanamaa uumna.',
    slide2Cta: 'Gabaasa Hawaasaa Ilaali',
    slide3Badge: 'Dandeettii Guddisi & Badhaasa Argadhu',
    slide3Title: 'Baradhu. Taphadhu. Eegi.',
    slide3Subtitle: 'Beekumsa Dijitaalaa Tapha Fakkaatu',
    slide3Desc:
      'Dandeettii yaada qeequu kee qormaata simannaa, gaaffilee fi ergama haala irratti hundaa’een cimsadhu, kunis beekumsa miidiyaa hawwataa fi badhaasa qabu taasisuuf qophaa’e.',
    slide3Cta: 'Imala Jalqabi',
    playAsGuest: 'Akka Keessummaatti Taphadhu',

    featuresEyebrow: 'Barnoota Walqunnamtii',
    featuresTitle: 'Beekumsa Dijitaalaa Too’adhu',
    featuresTitleHighlight: 'Tapha Keessaan',
    featuresDesc:
      'Pilaatformiin keenya yaada beekumsa miidiyaa walxaxaa gara qormaata hawwataatti jijjiira. Deepfake adda baasuu, madda mirkaneessuu fi tooftaa viiraalii naannoo nageenya qabuun baradhu.',
    feature1Title: 'Haalawwan Dhugaa',
    feature1Desc: 'Dhimmoota odeeffannoo sobaa dhugaa barnootaaf qophaa’an mormi.',
    feature2Title: 'Deebii Ariifachiisaa',
    feature2Desc: 'Qabiyyeen maaliif dogoggorsiisaa akka taʼe taphachaa hubadhu.',
    feature3Title: 'Guddina Dandeettii',
    feature3Desc:
      'Dandeettii haaraa yeroo too’attu sadarkaa ‘Barbaadaa Dhugaa’ kee guddisi.',
    feature4Title: 'Badhaasa Argadhu',
    feature4Desc: 'Guddina keetiif badge fi qabxiidhaan beekamtii argadhu.',

    crowdEyebrow: 'Sammuu Waloo',
    crowdTitle: 'Waliin Gowwoomsaa Mormuu',
    crowdDesc:
      'Humna kumaatama fayyadami. Sirni gabaasa hawaasaan geggeeffamu keenya fayyadamaan hundi eegduu dhugaa dijitaalaa akka taʼu dandeessisa.',
    crowd1Title: 'Qabiyyee Shakkisiisaa Gabaasi',
    crowd1Desc:
      'Wanta shakkisiisaa argattee? Meeshaa gabaasa salphaa keenyaan gamaaggama hawaasaaf battalumatti mallatteessi.',
    crowd2Title: 'Mirkaneessa Hawaasaa',
    crowd2Desc:
      'Fayyadamtoota ‘Node Dhugaa’ kan qabiyyee gabaafame mirkaneessuuf yookaan sobsiisuuf sagalee kennanii ragaa dhiyeessan makami.',
    crowd3Title: 'Amanamummaa Waliigaltee',
    crowd3Desc:
      'Algoritmiin keenya waliigaltee hawaasaa fi mirkaneessa ogeessaa irratti hundaa’ee qabxii amanamummaa shallaga.',

    missionEyebrow: 'Urjii Geggeessaa Keenya',
    missionTitle: 'Horizon Truth',
    missionTitleHighlight: 'Maaliif Barbaachisa',
    missionDesc:
      'Bara odeeffannoon meeshaa waraanaa taʼuu dandaʼu keessatti, dhugaan qabeenya keenya gatii guddaa qabuudha. Lammiilee yaada qeequun cimsuun sansuura kamiyyuu caalaa bu’a qabeessa akka taʼe ni amanna.',
    mission1Title: 'Iftoomina Cimaa',
    mission1Desc: 'Mirkaneessi hundi waliigaltee hawaasaa fi daataa banaadhaan deeggarama.',
    mission2Title: 'Cimsuun Dursa',
    mission2Desc:
      'Maal akka amantu si hin himnu; meeshaa murteessuuf si barbaachisu siif kennina.',
    confidenceScore: 'Qabxii Amantii Fayyadamaa',

    partnersEyebrow: 'Naannoo Amanamaa',
    partnersTitle: 'Michoota Bu’uuraa Keenya',
    partnersDesc:
      'Biyya guutuu keessatti jabina dijitaalaa ijaaruuf dhaabbilee dursitoota waliin hojjechaa jirra.',
    partner1Title: 'Yuunivarsiitii Jimmaa',
    partner1Desc: 'Walitti makamuu sirna barnootaa fi qorannoo.',
    partner2Title: 'Ministeera Nagaa',
    partner2Desc: 'Sagantaa ergamtoota dargaggootaa biyyoolessaa.',
    partner3Title: 'Magaalaa Shaggar',
    partner3Desc: 'Leenjii beekumsa dijitaalaa hawaasaan geggeeffamu.',

    statActiveUsers: 'Fayyadamtoota Sochii',
    statReportsDebunked: 'Gabaasota Sobsiifaman',
    statVerifiers: 'Mirkaneessitoota Hawaasaa',
    statAccuracy: 'Sadarkaa Sirrii',

    faqEyebrow: 'Wiirtuu Gargaarsaa',
    faqTitle: 'Deebii',
    faqTitleHighlight: 'Ogeessaa',
    faqDesc:
      'Horizon Truth akkamitti daangaa dijitaalaa akka eegu hubachuuf qajeelfama ariifachiisaa.',
    faqButton: 'Kuusaa Beekumsaa Guutuu',
    faq1Q: 'Horizon Truth maali?',
    faq1A:
      'Pilaatformii beekumsa dijitaalaa tapha fakkaatu kan barnoota walqunnamtii fi mirkaneessa hawaasaadhaan odeeffannoo sobaa mormuuf qophaa’e.',
    faq2Q: 'Taphichi akkamitti hojjeta?',
    faq2A:
      'Qormaata odeeffannoo sobaa addunyaa dhugaa fakkeessaman keessatti hirmaatta, gaaffilee fi shaakala qeequun oduu sobaa adda baasuu baratta.',
    faq3Q: 'Daataan koo nageenya qabaa?',
    faq3A:
      'Dhugumaan. Iccitii sadarkaa industirii fayyadamna, daataa xiqqaa guddina barnoota keetiif barbaachisu qofa walitti qabna.',
    faq4Q: 'Akkamitti gumaachuu danda’a?',
    faq4A:
      'Qabiyyee shakkisiisaa intarneetii irratti argattu gabaasuun fi sagalee mirkaneessa hawaasaa irratti hirmaachuun.',

    newsletterTitle: 'Gowwoomsaa Dura Bu’i',
    newsletterDesc:
      'Hawaasa ittisaa dijitaalaa keenya makami. Hubannoo beekumsa miidiyaa haaraa, fooyya’iinsa pilaatformii, fi oduu mirkanaa’e kallattiin gara iimeelii keetii argachuuf galmaa’i.',
    newsletterPlaceholder: 'Teessoo iimeelii kee galchi',
    newsletterSubscribe: 'Amma Galmaa’i',
    newsletterSubscribing: 'Galmaa’aa jira...',
    newsletterSuccessTitle: 'Gara Fuulduraatti Baga Nagaan Dhuftan',
    newsletterSuccessDesc:
      'Galmeen kee mirkanaa’eera. Amma kutaa network ittisaa dijitaalaa addunyaa taateetta. Fooyya’iinsa dursa olaanaaf iimeelii kee daawwadhu.',
    newsletterAnother: 'Iimeelii biraa galmeessi',
    newsletterDisclaimer:
      'Galmaa\'uun Imaammata Dhuunfaa keenya ni fudhatta. Spam hin jiru, dhugaa qofa.',
    newsletterSuccessToast:
      'Galmeen Newsletter milkaa\'eera! Beeksisa mirkaneessa iimeelii ni argatta.',
    newsletterErrorToast: 'Galmaa\'uun hin milkoofne. Maaloo irra deebi\'ii yaali.',
    fundedBy: 'Fayyadame / Deeggarama',
    unicefAttribution: 'UNICEF',
  },

  about: {
    heroTitle: 'Waa’ee',
    heroHighlight: 'Horizon Truth',
    heroDesc:
      'Barnoota, teknooloojii fi hirmaannaa hawaasaatiin odeeffannoo sobaa mormuuf ergama irra jirra.',
    ourStory: 'Seenaa Keenya',
    meetTeam: 'Garee Keenya Beekaa',

    genesisEyebrow: 'Jalqabbii Keenya',
    storyTitle: 'Horizon Truth',
    storyTitleHighlight: 'Akkamitti Jalqabe.',
    storyP1:
      'Horizon Truth bara 2023 garee falmitoota beekumsa dijitaalaa, barsiisotaa fi ogeeyyii teknooloojii kan addunyaa walitti hidhamaa jiru keessatti balaa odeeffannoo sobaa guddachaa jiru hubataniin hundaa’e.',
    storyP2:
      'Wanti akka pirojektii qorannoo yuunivarsiitiitti jalqabe dafee gara pilaatformii guutuu namootni, keessumaa dargaggoonni, dandeettii yaada qeequu naannoo odeeffannoo har’aa walxaxaa kana keessa deemuuf barbaachisu akka horatan gargaarutti guddate.',
    journeyTitle: 'Imalichi',
    journey1Title: 'Sadarkaa Qorannoo',
    journey1Date: 'Amajjii 2023 - Ebla 2023',
    journey1Desc:
      'Tooftaa odeeffannoo sobaa fi qaawwa beekumsa dijitaalaa irratti qorannoo bal’aa geggeessine.',
    journey2Title: 'Misooma Pilaatformii',
    journey2Date: 'Caamsaa 2023 - Fulbaana 2023',
    journey2Desc:
      'Fakkii jalqabaa pilaatformii barnoota tapha fakkaatuu fi meeshaalee hawaasaa ijaarre.',
    journey3Title: 'Eegalchaa fi Guddina',
    journey3Date: 'Onkoloolessa 2023 - Ammatti',
    journey3Desc:
      'Ifatti eegalle, yaada irraa argannuun qabeenya keenya itti fufiinsaan baballisne.',

    missionTitle: 'Ergama Keenya',
    missionDesc:
      'Namoota dandeettii yaada qeequu fi beekumsa dijitaalaa odeeffannoo sobaa bifa hundaan adda baasuuf, xiinxaluuf, fi mormuuf barbaachisuun cimsuu, hawaasa odeeffannoo qabuu fi jabaa uumuu.',
    visionTitle: 'Mul’ata Keenya',
    visionDesc:
      'Addunyaa namootni naannoo dijitaalaa itti gaafatamummaadhaan keessa deeman, dhugaan soba moo’atu, hawaasni waliin amanamummaa odeeffannoo guddisan ni hawwina.',

    valuesEyebrow: 'Urjii Geggeessaa Keenya',
    valuesTitle: 'Gatii',
    valuesTitleHighlight: 'Keessoo.',
    value1Title: 'Amanamummaa',
    value1Desc:
      'Waan lallabnu ni hojjenna, qabiyyeen keenya sirrii fi ifa akka taʼe mirkaneessina.',
    value2Title: 'Kalaqa',
    value2Desc:
      'Beekumsa dijitaalaa hawwataa taasisuuf mala haaraa itti fufiinsaan misoomsina.',
    value3Title: 'Tumsa',
    value3Desc: 'Odeeffannoo sobaa mormuun carraaqqii waloo akka barbaadu ni amanna.',
    value4Title: 'Barnoota',
    value4Desc:
      'Sobsiisuu caalaa namoota beekumsaan cimsuuf dursa kennina.',

    ctaTitle: 'Makamuuf Qophiidhaa',
    ctaTitleHighlight: 'Falmicha?',
    ctaDesc:
      'Amma galmaa’ii har’a loltuu odeeffannoo sobaa taʼuuf imala kee jalqabi.',
    ctaStartPlaying: 'Taphachuu Jalqabi',
  },

  contact: {
    heroTitle: 'Wajjin Walqunnami',
    heroSubtitle: 'Dhugaa',
    heroDesc:
      'Gaaffii qabduu? Naannoo dijitaalaa keessa akka deemtu si gargaaruuf as jirra.',
    infoTitle: 'Odeeffannoo Quunnamtii',
    emailUs: 'Iimeelii Nuu Ergi',
    callUs: 'Nu Bilbili',
    visitUs: 'Nu Daawwadhu',
    visitLine1: 'Karaa Boolee, Finfinnee',
    visitLine2: 'Itoophiyaa',
    businessHours: 'Sa’aatii Hojii',
    weekdays: 'Wiixata - Jimaata',
    saturday: 'Sanbata',
    sunday: 'Dilbata',
    closed: 'Cufaa',
    successTitle: 'Ergaan Nu Gahe',
    successDesc:
      'Hojjettoonni keenya ergaa kee fudhataniiru. Daataa gamaaggamnee karaa nuu kennitee marsaa hojii itti aanu keessatti deebii kennina.',
    sendNew: 'Ergaa Haaraa Ergi',
    formTitle: 'Ergaa Ergi',
    formDesc: 'Garee keenya wajjin karaa quunnamtii kallattii jalqabi.',
    firstName: 'Maqaa Jalqabaa',
    lastName: 'Maqaa Abbaa',
    email: 'Iimeelii Quunnamtii',
    subject: 'Mata-duree',
    message: 'Ergaa',
    messagePlaceholder: 'Ergaa kee galchi...',
    subjectPlaceholder: 'Deeggarsa Teeknikaa / Michuummaa',
    send: 'Ergaa Ergi',
    sending: 'Ergaa jira...',
    successToast: 'Galatoomi! Ergaan kee milkaa’inaan ergameera.',
    errorToast: 'Ergaa erguun hin milkoofne. Maaloo irra deebi’ii yaali.',
  },

  faq: {
    title: 'Gaaffilee Yeroo',
    titleHighlight: 'Baayyee Gaafataman',
    desc: 'Waa’ee Horizon Truth fi akkamitti pilaatformii keenya sirritti fayyadamuu akka dandeessu gaaffilee yeroo baayyee deebii argadhu.',
    searchPlaceholder: 'Gaaffilee barbaadi...',
    categories: 'Ramaddiiwwan',
    catGeneral: 'Waliigala',
    catAccount: 'Akkaawuntii & Seensa',
    catGame: 'Tapha & Barnoota',
    catVerification: 'Mirkaneessa Qabiyyee',
    catTechnical: 'Deeggarsa Teeknikaa',
    catPrivacy: 'Dhuunfaa & Nageenya',
    stillQuestions: 'Ammas gaaffii qabdaa?',
    stillDesc:
      'Wanta barbaaddu argachuu hin dandeenye? Gareen deeggarsa keenya si gargaaruuf as jira.',
    contactSupport: 'Deeggarsa Quunnami',
    searchResultsFor: 'Bu’aa Barbaachaa',
    questionsSuffix: 'Gaaffilee',
    questionsFound: 'gaaffilee argaman',
    noResults: 'Bu’aan hin argamne',
    noResultsDesc: 'Jechoota adda addaa yaali yookaan ramaddii biraa filadhu.',
    clearFilters: 'Calaltuuwwan hunda haqi',
    stillNeedHelp: 'Ammas gargaarsa barbaaddaa?',
    stillNeedHelpDesc:
      'Ogeeyyiin keenya waa’ee pilaatformii keenyaa shakkii kamiyyuu ibsuuf qophii dha.',
    emailSupport: 'Deeggarsa Iimeelii',
  },

  auth: {
    loginTitle: 'Baga Nagaan Deebitan',
    loginSubtitle: 'Ergama kee itti fufuuf seeni.',
    loginBadge: 'Sirna Amantii Dhaloota Itti Aanu',
    loginDashboard: 'Daashboordii mirkaneessa kee bittinneeffame seeni',
    registerTitle: 'Akkaawuntii Uumi',
    registerSubtitle: 'Odeeffannoo sobaa mormuu keessatti makami.',
    email: 'Iimeelii',
    phone: 'Bilbila',
    password: 'Jecha Icciitii',
    confirmPassword: 'Jecha Icciitii Mirkaneessi',
    fullName: 'Maqaa Guutuu',
    emailOrUsername: 'Iimeelii yookaan Maqaa Fayyadamaa',
    emailOrUsernamePlaceholder: 'Iimeelii yookaan maqaa fayyadamaa kee galchi',
    signIn: 'Seeni',
    signUp: 'Galmaa’i',
    signingIn: 'Seenaa jira...',
    authenticating: 'Mirkaneessaa jira...',
    forgot: 'Dagattee?',
    forgotPassword: 'Jecha Icciitii Dagattee?',
    noAccount: 'Akkaawuntii hin qabduu?',
    haveAccount: 'Akkaawuntii qabdaa?',
    createOne: 'Tokko Uumi',
    welcomeToast: 'Baga nagaan deebite!',
    authFailedToast: 'Mirkaneessuun hin milkoofne',
    loginFailed: 'Seenuun hin milkoofne. Maaloo ragaa kee mirkaneessi.',
  },

  legal: {
    privacyPolicy: 'Imaammata Dhuunfaa',
    dataRetentionPolicy: 'Imaammata Eegumsa Daataa',
    privacyClausesTitle: 'Meeshaalee Walqunnamtii Dhuunfaa',
    privacyClausesSubtitle: 'Meeshaalee Dhuunfaa Keessoo/Walqunnamtii fi Qophaa\'ina Walqunnamtii',
    aboutThisDocument: 'Waa\'ee Kunuun Sanadichaa',
    privacyPolicyDesc:
      'Imaammata Dhuunfaa kuni akkamitti Dabbal Software Development PLC pilaatformii Horizon Truth irratti daataa dhuunfaa kee fudhata, fayyadama, fi walitti qabu ibsa gadi fida.',
    privacyPolicyDesc2:
      'Imaammata Dhuunfaa kuni Waa\'ee Eegumsa Daataa fi Waa\'ee Kukiin waliin jira. Daataan kee akkamitti fayyadamu hubachuuf sanadawwan sadii kanatti galii.',
    dataRetentionDesc:
      'Waa\'ee Eegumsa Daataa kuni qabiyyee daataa dhuunfaa addaa addaa pilaatformii Horizon Truth keessatti hanga yeroo maaliif eegama, fi daataa haquu fi hidda miseensisuun akkamitti hojjatu hubisa.',
    dataRetentionDesc2:
      'Waa\'ee Dhuunfaa fi Waa\'ee Kukiin waliin jira.',
    privacyClausesDesc:
      'Kun sanadni meeshaalee walqunnamtii keessoo fi Waliigaltee Galee Daataa (DPA) qophaa\'ina walqunnamtii dhuunfaa fi meeshaalee kennitoota waliin fayyadamuuf qophaa\'e. Kun imaammata hawaasaa miti.',
    privacyClausesNotice:
      'Kun meeshaa hojii dha, imaammata hawaasaa miti. Meeshaalee Vendor/DPA afaanii fi qophaa\'ina walqunnamtii dhuunfaa sanadawwan keessatti fayyadamu qaba.',
    internalDocument: 'Sanad Keessoo / Walqunnamtii',
    version: 'Fooyya\'iinsa',
    effectiveDate: 'Guyyaa Hojiirra Oolan',
    format: 'Dhangii',
    organization: 'Dhaabbala',
    documentInfo: 'Odeeffannoo Sanadaa',
    viewPdf: 'PDF Daawwadhu',
    downloadPdf: 'PDF Fudhadhu',
    relatedDocuments: 'Sanadota Waliin Jiran',
    relatedDocumentsDesc: 'Kun sanad kuni imaammata armaan gadii waliin ta\'uu qaba:',
    type: 'Akaakuu',
    internalContractual: 'Keessoo / Walqunnamtii',
    purpose: 'Kabajjii',
    privacyClausesPurpose: 'Sanadota dhaabbalaa, DPAs fi qophaa\'ina walqunnamtii dhuunfaa',
  },

  moderation: {
    title: 'To’annoo',
    subtitle: 'Haala tarree, kallattii, fi hojii abbaa eeggatu.',
    queue: 'Tarree To’annoo',
    dashboard: 'Daashboordii To’annoo',
    appeals: 'Ol’iyyannoo',
    analytics: 'Xiinxala To’annoo',
    audit: 'Odiitii To’annoo',
    settings: 'Qindaa’ina To’annoo',

    pendingReports: 'Gabaasota Eegaa Jiran',
    awaitingReview: 'Gamaggama Eeggatan',
    escalated: 'Ol Guddifaman',
    flaggedContent: 'Qabiyyee Mallattaa’e',
    suspendedUsers: 'Fayyadamtoota Ugguraman',
    activeModerators: 'To’attoota Sochii Irra Jiran',
    resolvedToday: 'Har’a Furaman',
    averageResolution: 'Yeroo Furmaataa Giddugaleessaa',

    caseNumber: 'Lakkoofsa Dhimmaa',
    reportedContent: 'Qabiyyee Gabaafame',
    reportDetails: 'Bal’ina Gabaasaa',
    history: 'Seenaa',
    reporter: 'Gabaasaa',
    reportedUser: 'Fayyadamaa Gabaafame',
    anonymous: 'Maqaa Hin Qabne',
    owner: 'Abbaa',
    unassigned: 'Hin Ramadamne',
    evidence: 'Ragaa',
    outcome: 'Bu’aa',
    severity: 'Cimina',
    status: 'Haala',

    claimCase: 'Dhimmicha Fudhadhu',
    startReview: 'Gamaggama Jalqabi',
    applyFlags: 'Mallattoo Kaa’i',
    hideContent: 'Qabiyyee Dhoksi',
    deleteContent: 'Qabiyyee Haqi',
    restoreContent: 'Qabiyyee Deebisi',
    escalate: 'Ol Guddisi',
    uphold: 'Mirkaneessiitii Cufi',
    dismiss: 'Bu’uura Hin Qabu Jettee Gati',
    reopen: 'Dhimmicha Irra Deebi’ii Bani',
    merge: 'Irra Deebi’an Walitti Makii',

    riskScore: 'Qabxii Balaa',
    violationRecord: 'Galmee Sarbamaa',
    issueWarning: 'Akeekkachiisa Kenni',
    suspendUser: 'Yeroof Uggurii',
    banUser: 'Dhaabbataan Uggurii',
    liftSanctions: 'Adabbii Kaasi',
    sanctionHistory: 'Seenaa Adabbii',

    moderatorNotes: 'Yaadannoo To’attootaa',
    addNote: 'Yaadannoo Dabali',
    notesPrivate: 'Garee to’annootiif qofa.',
    reason: 'Sababa',
    reasonRequired: 'Sababni barbaachisaadha — kun galmee dhaabbataadha.',
    internalNotes: 'Yaadannoo Keessoo (Filannoo)',
    confirm: 'Mirkaneessi',
    cancel: 'Haqi',

    appealNumber: 'Lakkoofsa Ol’iyyannoo',
    appealReason: 'Sababa fayyadamaan ol’iyyateef',
    upholdAppeal: 'Ol’iyyannoo Mirkaneessi',
    rejectAppeal: 'Ol’iyyannoo Kuffisi',
    appealResponse: 'Deebii fayyadamaaf kennitu',

    emptyQueue: 'Tarreen duwwaadha — wanti to’atamu hin jiru.',
    noMatches: 'Dhimmi mul’ata kanaan walsimu hin jiru.',
    loadFailed: 'Daashboordii to’annoo fe’uun hin danda’amne.',
  },
};
