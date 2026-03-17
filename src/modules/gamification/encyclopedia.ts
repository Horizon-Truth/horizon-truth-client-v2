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