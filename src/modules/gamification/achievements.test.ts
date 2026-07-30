import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS, evaluateAll, unlockedCount, ACHIEVEMENT_CATEGORIES } from './achievements';
import type { AchievementContext } from './achievements';
import { EMPTY_CALIBRATION } from './confidence';
import { MASTERY_TIERS } from './mastery';
import { SKILLS } from './skills';

const ctx = (over: Partial<AchievementContext> = {}): AchievementContext => ({
    missionsCompleted: 0,
    xp: 0,
    trustScore: 50,
    accuracyRate: 0,
    currentStreak: 0,
    skillBook: {},
    calibration: EMPTY_CALIBRATION,
    daily: null,
    masteryTiers: [],
    totalPreventedReach: 0,
    totalReached: 0,
    ...over,
});

describe('catalog integrity', () => {
    it('has unique keys and valid categories', () => {
        const keys = ACHIEVEMENTS.map(a => a.key);
        expect(new Set(keys).size).toBe(keys.length);
        for (const a of ACHIEVEMENTS) {
            expect(ACHIEVEMENT_CATEGORIES[a.category]).toBeDefined();
        }
    });

    it('offers a substantial catalog', () => {
        expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(30);
    });

    it('unlocks nothing for a brand-new player', () => {
        expect(unlockedCount(ctx())).toBe(0);
    });

    it('never reports progress outside 0–100%', () => {
        const generous = ctx({
            missionsCompleted: 999, xp: 999999, trustScore: 100, accuracyRate: 100, currentStreak: 999,
            totalPreventedReach: 10_000_000,
        });
        for (const a of evaluateAll(generous)) {
            expect(a.pct).toBeGreaterThanOrEqual(0);
            expect(a.pct).toBeLessThanOrEqual(100);
            expect(a.current).toBeLessThanOrEqual(a.target);
        }
    });
});

describe('representative achievements', () => {
    const find = (key: string, c: AchievementContext) => evaluateAll(c).find(a => a.key === key)!;

    it('unlocks the first mission achievement', () => {
        expect(find('first-investigation', ctx({ missionsCompleted: 1 })).unlocked).toBe(true);
        expect(find('first-investigation', ctx()).unlocked).toBe(false);
    });

    it('requires a minimum sample before calibration counts', () => {
        const few = find('well-calibrated', ctx({ calibration: { ...EMPTY_CALIBRATION, certain: { correct: 5, total: 5 } } }));
        expect(few.unlocked).toBe(false);
        expect(few.target).toBe(10);

        const enough = find('well-calibrated', ctx({ calibration: { ...EMPTY_CALIBRATION, certain: { correct: 19, total: 20 } } }));
        expect(enough.unlocked).toBe(true);
    });

    it('locks "Never Amplified" once misinformation was spread', () => {
        expect(find('clean-hands', ctx({ missionsCompleted: 10 })).unlocked).toBe(true);
        expect(find('clean-hands', ctx({ missionsCompleted: 10, totalReached: 500 })).unlocked).toBe(false);
    });

    it('counts mastery tiers at or above the threshold', () => {
        const gold = MASTERY_TIERS.find(t => t.key === 'gold')!;
        const silver = MASTERY_TIERS.find(t => t.key === 'silver')!;
        expect(find('first-gold', ctx({ masteryTiers: [silver] })).unlocked).toBe(false);
        expect(find('first-gold', ctx({ masteryTiers: [silver, gold] })).unlocked).toBe(true);
    });

    it('tracks well-rounded practice across every skill', () => {
        const book = Object.fromEntries(SKILLS.map(s => [s.key, { xp: 10, correct: 1, total: 1 }]));
        expect(find('all-skills-started', ctx({ skillBook: book })).unlocked).toBe(true);
    });
});
