/**
 * Curated educational content for learning moments.
 *
 * Scenario-authored fields (psychologicalTrap, preventionLesson, …) always
 * take priority; this library provides the technique explanations and
 * verification tips that turn a right/wrong verdict into a lesson.
 */

export interface ManipulationTechnique {
    key: string;
    title: string;
    description: string;
    howToSpot: string;
    example: string;
}

/** Known manipulation techniques, keyed loosely so scenario-provided trap
 *  strings can be matched against them. */
export const TECHNIQUES: ManipulationTechnique[] = [
    {
        key: 'emotional',
        title: 'Emotional Manipulation',
        description: 'Content engineered to trigger fear, anger, or outrage. Strong emotions switch off critical thinking and make you share before you verify.',
        howToSpot: 'Notice your own reaction. If a post makes you furious or terrified instantly, that reaction may be the product — pause before acting.',
        example: '“SHOCKING: They don\'t want you to see this!” headlines that promise outrage but never cite a source.',
    },
    {
        key: 'urgency',
        title: 'False Urgency',
        description: 'Pressure to act NOW — “share before it gets deleted!” Urgency prevents verification, which is exactly the point.',
        howToSpot: 'Real information survives scrutiny. Anything that punishes you for taking 5 minutes to check is suspect.',
        example: 'Chain messages claiming a law changes “at midnight tonight” that have circulated for years.',
    },
    {
        key: 'authority',
        title: 'Fake Authority',
        description: 'Citing vague or invented experts (“scientists say”, “a doctor friend”) to borrow credibility without evidence.',
        howToSpot: 'Ask: which scientist? Which study? A real claim names checkable sources; a fake one stays vague.',
        example: '“Top doctors confirm…” posts where no doctor, hospital, or paper is ever named.',
    },
    {
        key: 'context',
        title: 'Context Manipulation',
        description: 'Real photos, videos, or quotes presented with a false time, place, or story. The content is genuine — the framing is the lie.',
        howToSpot: 'Reverse-image search photos and check the original date. Old disaster footage is constantly recycled for new events.',
        example: 'A 2015 flood video re-shared as “yesterday\'s storm” in a different country.',
    },
    {
        key: 'social-proof',
        title: 'Manufactured Consensus',
        description: 'Bots, fake accounts, and coordinated reposts create the illusion that “everyone believes this”, exploiting our instinct to follow the crowd.',
        howToSpot: 'Check the accounts: creation dates, repetitive wording, no personal history. Thousands of identical comments are a red flag, not proof.',
        example: 'A hashtag trending through accounts that were all created last week.',
    },
    {
        key: 'statistics',
        title: 'Misleading Statistics',
        description: 'Real numbers framed dishonestly — truncated graph axes, cherry-picked date ranges, or percentages without a baseline.',
        howToSpot: 'Look at the axes and the time window. Ask “percent of what?” A 200% rise from 1 case to 3 cases is technically true and deeply misleading.',
        example: 'A chart starting its y-axis at 90% to make a 2% difference look enormous.',
    },
    {
        key: 'impersonation',
        title: 'Impersonation',
        description: 'Fake accounts or lookalike websites mimicking trusted news outlets, officials, or friends to launder false claims.',
        howToSpot: 'Check the exact handle and domain character by character. “bbc-news24.com” is not the BBC.',
        example: 'A screenshot of a “breaking news” tweet from an account with one letter changed in the name.',
    },
];

export interface VerificationTip {
    title: string;
    tip: string;
}

/** Rotating practical verification habits, shown after choices and on results. */
export const VERIFICATION_TIPS: VerificationTip[] = [
    { title: 'Pause before sharing', tip: 'The single most effective habit: wait 30 seconds. Misinformation depends on instant, emotional resharing.' },
    { title: 'Find the original source', tip: 'Follow the claim upstream. If every post links to other posts and never to a primary source, treat it as unverified.' },
    { title: 'Reverse-image search', tip: 'Right-click any suspicious image and search for it. You\'ll often find the same photo attached to a different, older story.' },
    { title: 'Check the date', tip: 'Old news re-shared as new is one of the most common forms of misinformation — always check when it was actually published.' },
    { title: 'Read past the headline', tip: 'Headlines are written to be shared, not to be accurate. The article often contradicts its own headline.' },
    { title: 'Cross-check with multiple outlets', tip: 'If a story is real and significant, more than one independent outlet will carry it. One lone source for a huge claim is a warning sign.' },
    { title: 'Inspect the account', tip: 'Before trusting a post, look at who posted it: account age, follower patterns, and what else they share tell you a lot.' },
    { title: 'Beware of screenshots', tip: 'Screenshots of posts or “messages” are trivially faked. Look for a link to the live original before believing one.' },
    { title: 'Ask who benefits', tip: 'Misinformation usually serves someone — politically or financially. Asking “who gains if I believe this?” exposes many hoaxes.' },
];

/** Match a scenario-provided trap/technique string against the library. */
export function matchTechnique(raw?: string | null): ManipulationTechnique | null {
    if (!raw) return null;
    const s = raw.toLowerCase();
    const patterns: [RegExp, string][] = [
        [/emotion|fear|anger|outrage|panic/, 'emotional'],
        [/urgen|hurry|act now|deadline|before it/, 'urgency'],
        [/authorit|expert|doctor|scientist|official/, 'authority'],
        [/context|out of context|old (photo|video|image)|recycl|miscaption/, 'context'],
        [/bot|consensus|bandwagon|everyone|social proof|coordinat/, 'social-proof'],
        [/statistic|number|graph|chart|percent|data/, 'statistics'],
        [/imperson|fake account|lookalike|spoof|mimic/, 'impersonation'],
    ];
    for (const [re, key] of patterns) {
        if (re.test(s)) return TECHNIQUES.find(t => t.key === key) ?? null;
    }
    return null;
}

/** Deterministic tip rotation so the same scene shows a stable tip. */
export function tipForSeed(seed: string): VerificationTip {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return VERIFICATION_TIPS[hash % VERIFICATION_TIPS.length];
}
