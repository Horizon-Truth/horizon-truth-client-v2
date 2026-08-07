import { describe, it, expect } from 'vitest';
import {
    MANUAL_ARTICLES,
    MANUAL_CATEGORIES,
    isArticleUnlocked,
    unlockedArticles,
    articleForTechnique,
    unlockRequirementLabel,
} from './encyclopedia';
import type { ManualArticle } from './encyclopedia';

const NEW_PLAYER = { missionsCompleted: 0, xp: 0 };

const article = (unlock: { missions: number; xp: number }) =>
    ({ id: 'test', unlock } as ManualArticle);

describe('manual content integrity', () => {
    it('gives every article a category that exists', () => {
        for (const a of MANUAL_ARTICLES) {
            expect(MANUAL_CATEGORIES).toHaveProperty(a.category);
        }
    });

    it('uses unique article ids', () => {
        const ids = MANUAL_ARTICLES.map((a) => a.id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it('ships a starter set that is readable immediately', () => {
        expect(unlockedArticles(NEW_PLAYER).length).toBeGreaterThan(0);
    });
});

describe('isArticleUnlocked', () => {
    it('unlocks a zero-threshold article for a brand-new player', () => {
        expect(isArticleUnlocked(article({ missions: 0, xp: 0 }), NEW_PLAYER)).toBe(true);
    });

    it('locks an article when neither threshold is met', () => {
        expect(
            isArticleUnlocked(article({ missions: 5, xp: 800 }), { missionsCompleted: 2, xp: 100 }),
        ).toBe(false);
    });

    it('unlocks on missions alone', () => {
        expect(
            isArticleUnlocked(article({ missions: 5, xp: 800 }), { missionsCompleted: 5, xp: 0 }),
        ).toBe(true);
    });

    it('unlocks on xp alone — either threshold suffices', () => {
        expect(
            isArticleUnlocked(article({ missions: 5, xp: 800 }), { missionsCompleted: 0, xp: 800 }),
        ).toBe(true);
    });

    it('treats the threshold as inclusive', () => {
        expect(
            isArticleUnlocked(article({ missions: 3, xp: 999 }), { missionsCompleted: 3, xp: 0 }),
        ).toBe(true);
    });
});

describe('unlockedArticles', () => {
    it('grows monotonically as the player progresses', () => {
        const early = unlockedArticles(NEW_PLAYER).length;
        const mid = unlockedArticles({ missionsCompleted: 5, xp: 800 }).length;
        const late = unlockedArticles({ missionsCompleted: 10, xp: 2500 }).length;

        expect(mid).toBeGreaterThan(early);
        expect(late).toBeGreaterThanOrEqual(mid);
    });

    it('returns the whole manual to a fully progressed player', () => {
        expect(unlockedArticles({ missionsCompleted: 999, xp: 999999 })).toHaveLength(
            MANUAL_ARTICLES.length,
        );
    });

    it('returns only unlocked articles', () => {
        const unlocked = unlockedArticles({ missionsCompleted: 1, xp: 0 });

        for (const a of unlocked) {
            expect(isArticleUnlocked(a, { missionsCompleted: 1, xp: 0 })).toBe(true);
        }
    });
});

describe('articleForTechnique', () => {
    it('returns null for a missing key', () => {
        expect(articleForTechnique(undefined)).toBeNull();
        expect(articleForTechnique(null)).toBeNull();
        expect(articleForTechnique('')).toBeNull();
    });

    it('returns null for a technique with no article', () => {
        expect(articleForTechnique('no-such-technique')).toBeNull();
    });

    it('finds the article deepening a known technique', () => {
        const found = articleForTechnique('emotional');

        expect(found).not.toBeNull();
        expect(found?.techniqueKey).toBe('emotional');
    });
});

describe('unlockRequirementLabel', () => {
    it('describes a starter article', () => {
        expect(unlockRequirementLabel(article({ missions: 0, xp: 0 }))).toBe(
            'Available from the start',
        );
    });

    it('uses the singular for a one-mission requirement', () => {
        expect(unlockRequirementLabel(article({ missions: 1, xp: 100 }))).toBe(
            'Complete 1 mission to unlock',
        );
    });

    it('pluralises beyond one mission', () => {
        expect(unlockRequirementLabel(article({ missions: 4, xp: 600 }))).toBe(
            'Complete 4 missions to unlock',
        );
    });

    it('treats a negative requirement as available', () => {
        expect(unlockRequirementLabel(article({ missions: -1, xp: 0 }))).toBe(
            'Available from the start',
        );
    });
});
