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