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

describe('ledger-driven achievements', () => {
    const find = (key: string, c: AchievementContext) => evaluateAll(c).find(a => a.key === key)!;

    /** Level 5 needs 800 xp, level 10 needs 4050 (skillLevel is sqrt-based). */
    const bookAt = (xp: number) =>
        Object.fromEntries(SKILLS.map(s => [s.key, { xp, correct: 0, total: 0 }]));

    it('sums decisions across the whole skill book', () => {
        const book = Object.fromEntries(
            SKILLS.map(s => [s.key, { xp: 0, correct: 20, total: 100 }]),
        );

        expect(find('hundred-correct', ctx({ skillBook: book })).unlocked).toBe(true);
        expect(find('five-hundred-decisions', ctx({ skillBook: book })).unlocked).toBe(true);
    });

    it('ignores skills missing from the book rather than failing', () => {
        const partial = { 'source-verification': { xp: 0, correct: 3, total: 4 } };

        const a = find('hundred-correct', ctx({ skillBook: partial }));

        expect(a.current).toBe(3);
        expect(a.unlocked).toBe(false);
    });

    it('unlocks Specialist at level 5 in any one skill', () => {
        const book = { 'source-verification': { xp: 800, correct: 0, total: 0 } };

        expect(find('skill-level-5', ctx({ skillBook: book })).unlocked).toBe(true);
        expect(find('all-skills-level-5', ctx({ skillBook: book })).unlocked).toBe(false);
    });

    it('unlocks Renaissance Mind only when every skill hits level 5', () => {
        expect(find('all-skills-level-5', ctx({ skillBook: bookAt(800) })).unlocked).toBe(true);
    });

    it('unlocks Grandmaster at level 10', () => {
        expect(find('skill-level-10', ctx({ skillBook: bookAt(800) })).unlocked).toBe(false);
        expect(find('skill-level-10', ctx({ skillBook: bookAt(4050) })).unlocked).toBe(true);
    });

    describe('per-skill accuracy achievements', () => {
        it('reports decisions made while under the 10-decision minimum', () => {
            const a = find(
                'source-expert',
                ctx({ skillBook: { 'source-verification': { xp: 0, correct: 4, total: 4 } } }),
            );

            expect(a.current).toBe(4);
            expect(a.target).toBe(10);
            expect(a.unlocked).toBe(false);
        });

        it('reports zero progress when the skill is untouched', () => {
            const a = find('source-expert', ctx());

            expect(a.current).toBe(0);
            expect(a.target).toBe(10);
        });

        it('switches to the accuracy target past the minimum', () => {
            const a = find(
                'source-expert',
                ctx({ skillBook: { 'source-verification': { xp: 0, correct: 19, total: 20 } } }),
            );

            expect(a.target).toBe(90);
            expect(a.unlocked).toBe(true);
        });

        it('stays locked when accuracy is below the bar', () => {
            const a = find(
                'deepfake-hunter',
                ctx({ skillBook: { 'media-analysis': { xp: 0, correct: 10, total: 20 } } }),
            );

            expect(a.target).toBe(90);
            expect(a.unlocked).toBe(false);
        });

        it('applies the same rule to Bias Breaker', () => {
            const a = find(
                'bias-breaker',
                ctx({ skillBook: { 'emotional-defense': { xp: 0, correct: 19, total: 20 } } }),
            );

            expect(a.unlocked).toBe(true);
        });
    });

    describe('calibration achievements', () => {
        it('reads the certain bucket', () => {
            const calibration = {
                ...EMPTY_CALIBRATION,
                certain: { correct: 50, total: 50 },
            };

            expect(find('well-calibrated', ctx({ calibration })).target).toBe(90);
        });

        it('counts guessing-bucket decisions', () => {
            const calibration = {
                ...EMPTY_CALIBRATION,
                guessing: { correct: 5, total: 20 },
            };

            expect(find('honest-doubt', ctx({ calibration })).unlocked).toBe(true);
        });

        it('treats an absent ledger as zero progress', () => {
            const a = find('honest-doubt', ctx({ calibration: undefined as never }));

            expect(a.current).toBe(0);
        });
    });

    describe('daily-habit achievements', () => {
        const daily = (over: Record<string, number> = {}) => ({
            date: '2026-01-01',
            missions: 0,
            correctDecisions: 0,
            sharpMissions: 0,
            ...over,
        });

        it('leaves habits locked with no ledger for today', () => {
            expect(find('daily-sweep', ctx({ daily: null })).unlocked).toBe(false);
            expect(find('marathon', ctx({ daily: null })).current).toBe(0);
        });

        it('unlocks the daily sweep only when all three quests are cleared', () => {
            const partial = daily({ missions: 1, correctDecisions: 5 });
            expect(find('daily-sweep', ctx({ daily: partial as never })).unlocked).toBe(false);

            const full = daily({ missions: 1, correctDecisions: 5, sharpMissions: 1 });
            expect(find('daily-sweep', ctx({ daily: full as never })).unlocked).toBe(true);
        });

        it('tracks a marathon session toward three missions', () => {
            const a = find('marathon', ctx({ daily: daily({ missions: 2 }) as never }));

            expect(a.current).toBe(2);
            expect(a.unlocked).toBe(false);

            expect(
                find('marathon', ctx({ daily: daily({ missions: 3 }) as never })).unlocked,
            ).toBe(true);
        });
    });

    it('counts higher tiers toward lower-tier mastery achievements', () => {
        const platinum = MASTERY_TIERS.find(t => t.key === 'platinum')!;
        const legendary = MASTERY_TIERS.find(t => t.key === 'legendary')!;

        expect(find('first-gold', ctx({ masteryTiers: [platinum] })).unlocked).toBe(true);
        expect(find('first-platinum', ctx({ masteryTiers: [platinum] })).unlocked).toBe(true);
        expect(find('first-legendary', ctx({ masteryTiers: [platinum] })).unlocked).toBe(false);
        expect(find('first-legendary', ctx({ masteryTiers: [legendary] })).unlocked).toBe(true);
    });

    it('tracks progress toward five golds', () => {
        const gold = MASTERY_TIERS.find(t => t.key === 'gold')!;

        const a = find('five-gold', ctx({ masteryTiers: [gold, gold, gold] }));

        expect(a.current).toBe(3);
        expect(a.target).toBe(5);
    });
});
