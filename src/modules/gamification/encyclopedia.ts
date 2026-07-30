/**
 * Field Manual (Phase 6) — the unlockable knowledge encyclopedia.
 *
 * Articles unlock as the player progresses (missions completed and/or XP),
 * turning in-game learning moments into a permanent, browsable reference.
 * Content lives here (like learning-content.ts) and is structured so
 * per-language variants can be added alongside later without reshaping.
 */

export type ManualCategory =
    | 'cognitive-bias'
    | 'technique'
    | 'synthetic-media'
    | 'network'
    | 'scam'
    | 'toolkit';

export const MANUAL_CATEGORIES: Record<ManualCategory, { name: string; emoji: string; blurb: string }> = {
    'cognitive-bias': { name: 'Cognitive Biases', emoji: '🧠', blurb: 'The shortcuts in your own head that misinformation exploits.' },
    technique: { name: 'Manipulation Techniques', emoji: '🎭', blurb: 'The recurring tricks used to make false things feel true.' },
    'synthetic-media': { name: 'Synthetic Media', emoji: '🤖', blurb: 'Deepfakes and AI-generated images, video, and audio.' },
    network: { name: 'Networks & Amplification', emoji: '🕸️', blurb: 'How falsehoods spread: bots, brigades, and bubbles.' },
    scam: { name: 'Scams & Fraud', emoji: '💸', blurb: 'When misinformation is after your money or your accounts.' },
    toolkit: { name: 'Verification Toolkit', emoji: '🧰', blurb: 'The professional habits and tools of fact-checkers.' },
};

export interface ManualArticle {
    id: string;
    category: ManualCategory;
    title: string;
    tagline: string;
    /** Unlock requirements — met if EITHER threshold is reached. */
    unlock: { missions: number; xp: number };
    body: string[];
    howToSpot: string[];
    realWorld: string;
    /** Concrete verification tools / reliable starting points. */
    verifyWith?: string[];
    /** learning-content.ts technique key this article deepens, if any. */
    techniqueKey?: string;
}

export const MANUAL_ARTICLES: ManualArticle[] = [
    // ——— Unlocked from the start: the foundations ———
    {
        id: 'confirmation-bias',
        category: 'cognitive-bias',
        title: 'Confirmation Bias',
        tagline: 'You believe it because you already believed it.',
        unlock: { missions: 0, xp: 0 },
        body: [
            'Confirmation bias is the tendency to accept information that supports what you already think and to scrutinize — or simply not see — information that contradicts it. It is not a flaw of unintelligent people; it is the default setting of every human brain, and it gets stronger when a topic is tied to identity or group membership.',
            'Misinformation producers rely on it: a fabricated story that flatters your side needs no evidence, because you supply the belief yourself. This is why the most viral false stories are rarely neutral — they are engineered to feel like a win for someone.',
        ],
        howToSpot: [
            'Notice when a story feels satisfying rather than surprising — satisfaction is the bias talking.',
            'Apply the switch test: would you believe this if it were said about the other side?',
            'Deliberately search for the strongest counter-argument before sharing.',
        ],
        realWorld: 'Studies of viral hoaxes consistently find people share political misinformation aligned with their side while accurately spotting the other side\'s fakes.',
    },
    {
        id: 'emotional-manipulation',
        category: 'technique',
        title: 'Emotional Manipulation',
        tagline: 'Outrage is the delivery mechanism.',
        unlock: { missions: 0, xp: 0 },
        techniqueKey: 'emotional',
        body: [
            'Strong emotion — fear, anger, disgust, moral outrage — measurably reduces analytical thinking and increases sharing. Misinformation is therefore engineered for maximum emotional load: the emotion is not a side effect, it is the delivery mechanism.',
            'Research on social platforms shows false news spreads farther and faster than true news, and the difference is largely explained by emotional novelty: lies are free to be more shocking than reality.',
        ],
        howToSpot: [
            'Track your own pulse: if a post makes you furious instantly, treat that reaction as a red flag, not a verdict.',
            'ALL-CAPS, rows of emergency emojis, and “SHARE BEFORE THEY DELETE THIS” are emotional accelerants.',
            'Ask: what does this post want me to feel — and who benefits if I feel it?',
        ],
        realWorld: 'During disease outbreaks, fabricated cure and conspiracy posts consistently out-share official health guidance because they are more emotionally charged.',
    },
    {
        id: 'source-verification',
        category: 'toolkit',
        title: 'Source Verification',
        tagline: 'The first question is always: says who?',
        unlock: { missions: 0, xp: 0 },
        techniqueKey: 'authority',
        body: [
            'Every claim has a chain of custody. Professional fact-checkers follow it upstream: who published this, where did they get it, and where did it originally come from? Most misinformation dies at the first link — the “news site” is three weeks old, the “expert” doesn\'t exist, the “document” has no origin.',
            'A real claim names checkable specifics: institutions, publication dates, named authors. Vagueness (“scientists say”, “reports confirm”) is a structural feature of fabrication, because specifics can be checked.',
        ],
        howToSpot: [
            'Open a second tab and search the outlet\'s name plus “credibility” before trusting an unfamiliar site.',
            'Check the About page, the domain age, and whether real journalists\' names appear anywhere.',
            'Follow the links: if every citation points at other posts and never a primary source, treat it as unverified.',
        ],
        realWorld: 'Lookalike “local news” sites — real town names, no newsroom — are a documented tactic for laundering political talking points into feeds.',
        verifyWith: ['Search the outlet name + “fact check”', 'WHOIS / domain-age lookup', 'Media Bias / credibility databases'],
    },
    {
        id: 'pause-before-sharing',
        category: 'toolkit',
        title: 'The 30-Second Pause',
        tagline: 'The single highest-impact habit in this manual.',
        unlock: { missions: 0, xp: 0 },
        body: [
            'Misinformation depends on instant, emotional resharing. Introducing any friction — even reading the article before sharing it — measurably reduces the spread of false content. The pause is where every other skill in this manual gets room to run.',
            'Accuracy prompts (“is this true?”) shown before sharing reduce the spread of false headlines in controlled studies. You can install that prompt in yourself.',
        ],
        howToSpot: [
            'Feel the urge to share immediately? That urge is the signal to wait 30 seconds.',
            'Ask yourself one question before resharing: how do I know this is true?',
            'If the answer is “someone I like posted it”, that is not evidence.',
        ],
        realWorld: 'Platforms that added “read the article before resharing?” prompts saw meaningful drops in blind amplification.',
    },

    // ——— Early unlocks ———
    {
        id: 'false-urgency',
        category: 'technique',
        title: 'False Urgency',
        tagline: 'Anything that punishes you for checking is suspect.',
        unlock: { missions: 1, xp: 100 },
        techniqueKey: 'urgency',
        body: [
            'Urgency is verification\'s natural enemy, which is why manufactured deadlines are everywhere in misinformation: “share before midnight”, “they\'re deleting this”, “last chance”. If you don\'t have time to check, you can\'t discover it\'s false.',
            'Legitimate emergencies do exist — but real emergency information comes from authorities with names and channels, and it survives a five-minute check.',
        ],
        howToSpot: [
            'A deadline attached to a share request is almost always the trick itself.',
            'Chain messages that have “circulated since forever” but always expire “tonight”.',
            'Real information rewards scrutiny; fake urgency punishes it.',
        ],
        realWorld: 'The “WhatsApp will start charging unless you forward this” hoax has run for over a decade on pure manufactured urgency.',
    },
    {
        id: 'authority-bias',
        category: 'cognitive-bias',
        title: 'Authority Bias & Fake Experts',
        tagline: 'A lab coat is not a citation.',
        unlock: { missions: 1, xp: 150 },
        techniqueKey: 'authority',
        body: [
            'We are wired to defer to experts — usually a good shortcut, which is exactly why it is stolen. Misinformation borrows authority: invented doctors, real doctors speaking far outside their field, or “a friend who works at the hospital”.',
            'The halo effect compounds it: someone impressive in one domain (a celebrity, a CEO) feels credible in all domains. Expertise does not transfer; credibility earned on screen says nothing about vaccine science.',
        ],
        howToSpot: [
            'Ask: which expert, which institution, which publication? Fabrication stays vague.',
            'Check whether the named expert exists and actually works in the relevant field.',
            'One dissenting “brave insider” against an entire field is a story pattern, not evidence.',
        ],
        realWorld: 'Health hoaxes routinely feature “Dr.” figures who turn out to be chiropractors, actors, or entirely invented.',
    },
    {
        id: 'out-of-context',
        category: 'technique',
        title: 'Out-of-Context Media',
        tagline: 'The photo is real. The story is not.',
        unlock: { missions: 2, xp: 250 },
        techniqueKey: 'context',
        body: [
            'The cheapest fake needs no editing at all: take a real photo or video and attach a false time, place, or story. Because the media itself is genuine, it survives casual inspection — the lie lives entirely in the caption.',
            'This is consistently among the most common forms of visual misinformation during breaking news, wars, and disasters, when demand for imagery outruns supply.',
        ],
        howToSpot: [
            'Reverse-image search is the antidote: the same photo attached to an older, different story ends the question.',
            'Check weather, signage language, license plates, and clothing against the claimed time and place.',
            'Breaking-news footage “too dramatic to be anywhere else” very often is from somewhere else.',
        ],
        realWorld: 'Old disaster footage is recycled within hours of nearly every major earthquake, flood, or conflict event.',
        verifyWith: ['Google Lens / reverse image search', 'TinEye', 'Frame-by-frame video search (InVID)'],
    },
    {
        id: 'reverse-image-search',
        category: 'toolkit',
        title: 'Reverse Image Search',
        tagline: 'Ten seconds to check where a picture really came from.',
        unlock: { missions: 2, xp: 250 },
        techniqueKey: 'context',
        body: [
            'Reverse image search finds other places an image has appeared — usually revealing its true age and origin. It is the fastest single verification tool available to non-professionals, and professionals use it constantly.',
            'For video, verifiers grab keyframes (screenshots of distinctive moments) and reverse-search those.',
        ],
        howToSpot: [
            'On desktop: right-click an image → “Search image with Google”. On mobile: use Google Lens.',
            'Sort or scan results by date — the earliest appearance usually tells the real story.',
            'No results is not proof of authenticity; it is one signal among several.',
        ],
        realWorld: 'A viral “shark swimming on a flooded highway” photo has been debunked by reverse search after nearly every hurricane since 2011.',
        verifyWith: ['Google Lens', 'TinEye', 'Bing Visual Search', 'InVID/WeVerify browser plugin'],
    },
    {
        id: 'clickbait',
        category: 'technique',
        title: 'Clickbait & Engagement Economics',
        tagline: 'When attention is the product, accuracy is optional.',
        unlock: { missions: 3, xp: 400 },
        techniqueKey: 'clickbait',
        body: [
            'Much misinformation is not ideological — it is commercial. Pages earn money per click and per view, and false stories are cheaper to produce and more shareable than true ones. Curiosity-gap headlines, fake miracle cures, and invented celebrity deaths are business models.',
            'Understanding the economics changes what you look for: not “who wants me to believe this?” but simply “who gets paid when I click?”',
        ],
        howToSpot: [
            'Headlines that withhold the payoff (“You won\'t believe what happened next”).',
            'Sites plastered with ads where the “article” is three sentences under the headline.',
            'Emotional superlatives with no named sources anywhere in the piece.',
        ],
        realWorld: 'Teenagers running content farms discovered fabricated political stories earned far more ad revenue than real news — with no political motive at all.',
    },
    {
        id: 'read-past-headline',
        category: 'toolkit',
        title: 'Lateral Reading',
        tagline: 'Fact-checkers leave the page. Amateurs stay on it.',
        unlock: { missions: 3, xp: 400 },
        body: [
            'Professional fact-checkers were found to verify unfamiliar sites dramatically faster than academics — because they immediately leave the site and read what the rest of the web says about it (“lateral reading”), instead of judging the site by its own About page and design.',
            'A polished site proves a budget, not accuracy. The site\'s own description of itself is marketing.',
        ],
        howToSpot: [
            'Open new tabs: search the outlet, the author, and the central claim before finishing the article.',
            'Read past the headline — articles frequently contradict their own headlines.',
            'Cross-check: a significant true story will be carried by multiple independent outlets within hours.',
        ],
        realWorld: 'In Stanford\'s studies, historians with PhDs were fooled by lobbyist sites that professional checkers unmasked in under two minutes — by leaving the page.',
        verifyWith: ['Search the claim + “fact check”', 'AFP Fact Check, Reuters Fact Check, Africa Check', 'Wikipedia for outlet background (a starting point, not an endpoint)'],
    },

    // ——— Mid-game unlocks ———
    {
        id: 'social-proof',
        category: 'cognitive-bias',
        title: 'Social Proof & the Bandwagon',
        tagline: '10,000 shares is a number, not a fact-check.',
        unlock: { missions: 4, xp: 600 },
        techniqueKey: 'social-proof',
        body: [
            'When uncertain, humans look at what others are doing — usually a sensible shortcut, and therefore a prime target. Like counts, share counts, and comment sections are all manipulable signals that feel like independent confirmation but aren\'t.',
            'Manufactured consensus can be bought for a few dollars per thousand engagements. Once real users see the inflated numbers, genuine sharing takes over and the manipulation becomes self-sustaining.',
        ],
        howToSpot: [
            'Treat virality as zero evidence of truth — popularity measures spreadability, not accuracy.',
            'Identical or near-identical comments from many accounts indicate coordination.',
            'Check a sample of amplifying accounts: creation dates, stolen profile photos, no personal history.',
        ],
        realWorld: 'Engagement-farming operations sell packages of likes, reshares, and supportive comments that make fringe claims appear mainstream overnight.',
    },
    {
        id: 'misleading-statistics',
        category: 'technique',
        title: 'Misleading Statistics',
        tagline: 'True numbers can still tell lies.',
        unlock: { missions: 4, xp: 600 },
        techniqueKey: 'statistics',
        body: [
            'The most durable misinformation uses real numbers framed dishonestly: truncated chart axes, cherry-picked date windows, percentages without baselines, and correlations dressed as causation. Because the underlying figure is technically true, it survives naive fact-checking.',
            '“Deaths doubled” can mean 1 became 2. “Crime up 40% in one city” can coexist with a national decline. The number is the bait; the missing denominator is the trick.',
        ],
        howToSpot: [
            'Always ask: percent of what? Compared to when? Says which dataset?',
            'Check chart axes — a y-axis starting at 90% turns 2 points into a cliff.',
            'Beware date ranges that start or end at suspiciously convenient moments.',
        ],
        realWorld: 'Truncated-axis charts are a staple of misleading economic and health graphics on every side of politics.',
    },
    {
        id: 'cherry-picking',
        category: 'technique',
        title: 'Cherry-Picking',
        tagline: 'Every fact true. The picture false.',
        unlock: { missions: 5, xp: 800 },
        techniqueKey: 'cherry-picking',
        body: [
            'Cherry-picking presents only the evidence that fits: the one cold winter against a warming trend, the one study against a consensus, the one crime against a falling statistic. No individual claim needs to be false — the deception is in the selection.',
            'This is why “do your own research” can mislead: unlimited information means supporting anecdotes exist for any conclusion. The professional question is never “is there evidence for this?” but “what does the weight of evidence say?”',
        ],
        howToSpot: [
            'Ask what the full dataset, full time range, or full body of research shows.',
            'A single dramatic counter-example against a large trend is a narrative device.',
            'Check whether cited studies are outliers, retracted, or misrepresented.',
        ],
        realWorld: 'Climate misinformation has leaned on individual cold snaps against a century of warming data for decades.',
    },
    {
        id: 'impersonation',
        category: 'technique',
        title: 'Impersonation & Spoofing',
        tagline: 'One changed letter is all it takes.',
        unlock: { missions: 5, xp: 800 },
        techniqueKey: 'impersonation',
        body: [
            'Fake accounts and lookalike domains borrow the trust of real institutions: a news logo, an official-sounding handle, a domain one letter off. Screenshots make it worse — a fabricated “tweet” image needs no account at all.',
            'Verification badges help less than assumed: paid verification and stolen accounts mean a checkmark is a weak signal on many platforms.',
        ],
        howToSpot: [
            'Read handles and domains character by character; “bbc-news24.com” is not the BBC.',
            'Never trust a screenshot of a post — find the live original or treat it as unverified.',
            'Cross-check “breaking” institutional statements against the institution\'s real site and feeds.',
        ],
        realWorld: 'A single fake verified account posing as a pharma company (“insulin is free now”) briefly moved the company\'s stock price in 2022.',
    },
    {
        id: 'echo-chambers',
        category: 'network',
        title: 'Echo Chambers & Filter Bubbles',
        tagline: 'The feed shows you more of what you already engaged with.',
        unlock: { missions: 6, xp: 1000 },
        body: [
            'Recommendation systems optimize for engagement, and you engage most with what confirms and provokes you. Over time your feed becomes an environment where your side\'s claims appear constantly and rebuttals appear never — making fringe beliefs feel like common knowledge.',
            'The bubble also distorts your sense of consensus: “everyone knows this” often means “everyone my algorithm shows me says this”.',
        ],
        howToSpot: [
            'If you cannot remember the last time you saw a credible opposing take, you are in a bubble.',
            'Deliberately follow serious sources you disagree with; search topics directly rather than waiting for the feed.',
            'Notice when a “huge story” is invisible outside your platform — that asymmetry is diagnostic.',
        ],
        realWorld: 'Studies mapping sharing networks show political misinformation circulating almost entirely within closed clusters that rarely exchange links.',
    },

    // ——— Late-game unlocks ———
    {
        id: 'bot-networks',
        category: 'network',
        title: 'Bot Networks & Coordinated Campaigns',
        tagline: 'A crowd that never sleeps and never disagrees.',
        unlock: { missions: 7, xp: 1300 },
        techniqueKey: 'social-proof',
        body: [
            'Automated and semi-automated account networks manufacture the appearance of grassroots opinion: trending hashtags, reply swarms, and thousands of “independent” voices repeating identical phrasing. The goal is rarely to convince directly — it is to set the agenda and make positions look popular.',
            'Modern operations blend bots with paid humans and hijacked accounts, making detection harder; but the behavioral fingerprints (timing, phrasing, account history) remain.',
        ],
        howToSpot: [
            'Check account age, posting frequency (hundreds of posts a day is not a person), and profile depth.',
            'Identical wording across many accounts is coordination, not coincidence.',
            'Hashtags that trend via brand-new accounts with generic names deserve zero trust.',
        ],
        realWorld: 'Platform transparency reports have documented state-linked networks of tens of thousands of accounts amplifying divisive content across elections.',
    },
    {
        id: 'deepfakes',
        category: 'synthetic-media',
        title: 'Deepfakes',
        tagline: 'Seeing is no longer believing — provenance is.',
        unlock: { missions: 8, xp: 1600 },
        techniqueKey: 'deepfake',
        body: [
            'Deepfakes use machine learning to graft one person\'s face or voice onto another\'s performance, producing video or audio of events that never happened. Quality now regularly beats casual inspection, so verification is shifting from artifacts to provenance: where did this file first appear and who can vouch for it?',
            'The threat is double-edged: fake clips get believed, and real clips get dismissed as fake (“the liar\'s dividend”). Both directions damage the information environment.',
        ],
        howToSpot: [
            'Artifacts still help: unnatural blinking, mismatched lip-sync, warped ears/jewelry, inconsistent lighting.',
            'Ask where the original file came from — an explosive clip with no traceable origin is a red flag.',
            'Check whether reputable outlets carry it; a real leaked video of a public figure becomes news within hours.',
        ],
        realWorld: 'A deepfake of a president “announcing surrender” circulated during wartime in 2022 — debunked within hours precisely because verifiers traced provenance.',
        verifyWith: ['Reverse-search keyframes', 'Official channels of the person depicted', 'AFP/Reuters fact-check desks'],
    },
    {
        id: 'ai-images',
        category: 'synthetic-media',
        title: 'AI-Generated Images & Audio',
        tagline: 'Photorealistic, effortless, and everywhere.',
        unlock: { missions: 8, xp: 1600 },
        techniqueKey: 'deepfake',
        body: [
            'Text-to-image models produce photorealistic scenes from a sentence, and voice models clone a speaker from seconds of audio. The marginal cost of fabricated “evidence” has fallen to zero, which means volume: synthetic crowds, fake disaster photos, invented historical images.',
            'Classic tells (mangled hands, garbled text, melted backgrounds) are fading with each model generation. Habits that survive: check provenance, check independent coverage, and distrust perfect-yet-unsourced imagery.',
        ],
        howToSpot: [
            'Zoom into hands, teeth, text, logos, and background geometry for artifacts.',
            'Perfect lighting plus zero source information is a signature combination.',
            'For audio: flat emotional cadence and no verifiable recording context.',
        ],
        realWorld: 'AI images of “the Pope in a designer puffer jacket” fooled millions in 2023 — a harmless preview of a serious capability.',
    },
    {
        id: 'financial-scams',
        category: 'scam',
        title: 'Financial Scams & Phishing',
        tagline: 'Misinformation with an invoice attached.',
        unlock: { missions: 9, xp: 2000 },
        body: [
            'Scams are misinformation with a payment step: fake investment platforms, celebrity-endorsed crypto giveaways, prize notifications, and phishing pages that mimic your bank. They reuse every technique in this manual — urgency, authority, social proof — aimed at your wallet or your credentials.',
            'The tell is structural: at some point, you are asked to pay, to “verify” credentials, or to move to an unmonitored channel. Legitimate institutions do not operate that way.',
        ],
        howToSpot: [
            'Guaranteed returns are a contradiction in terms; “double your money” is always theft.',
            'Check URLs character by character before entering any credentials; go to your bank by typing its address yourself.',
            'Pressure to act now, pay in gift cards or crypto, or keep it secret — each alone is disqualifying.',
        ],
        realWorld: 'Deepfaked celebrity investment ads run industrially on social platforms, funneling victims to polished fake trading dashboards.',
    },
    {
        id: 'conspiracy-thinking',
        category: 'cognitive-bias',
        title: 'Conspiracy Framing',
        tagline: 'A theory that explains everything explains nothing.',
        unlock: { missions: 10, xp: 2500 },
        techniqueKey: 'conspiracy',
        body: [
            'Conspiracy narratives offer emotional payoffs ordinary explanations can\'t: hidden order behind chaotic events, secret knowledge, and a villain to blame. Their structural signature is unfalsifiability — evidence against the plot is reframed as proof of the cover-up, so the theory can only grow.',
            'Real conspiracies exist — and are exposed by journalists and courts through documents, whistleblowers, and evidence chains. The difference between investigation and conspiracy thinking is whether evidence could, in principle, change the conclusion.',
        ],
        howToSpot: [
            'Ask the falsifiability question: what evidence would change your mind? “Nothing” ends the conversation.',
            'Claims requiring thousands of silent co-conspirators across rival institutions fail on logistics alone.',
            '“They don\'t want you to know” is a marketing hook, not a source.',
        ],
        realWorld: 'Real scandals (surveillance programs, doping schemes) were proven by evidence and reporting — the opposite of theories that survive only by rejecting evidence.',
    },
];

export interface PlayerProgressSnapshot {
    missionsCompleted: number;
    xp: number;
}

/** An article is unlocked when either threshold is met. */
export function isArticleUnlocked(article: ManualArticle, p: PlayerProgressSnapshot): boolean {
    return p.missionsCompleted >= article.unlock.missions || p.xp >= article.unlock.xp;
}

export function unlockedArticles(p: PlayerProgressSnapshot): ManualArticle[] {
    return MANUAL_ARTICLES.filter(a => isArticleUnlocked(a, p));
}

export function articleForTechnique(techniqueKey?: string | null): ManualArticle | null {
    if (!techniqueKey) return null;
    return MANUAL_ARTICLES.find(a => a.techniqueKey === techniqueKey) ?? null;
}

/** Human copy for what it takes to unlock a locked article. */
export function unlockRequirementLabel(article: ManualArticle): string {
    const m = article.unlock.missions;
    return m <= 0 ? 'Available from the start' : `Complete ${m} mission${m > 1 ? 's' : ''} to unlock`;
}
