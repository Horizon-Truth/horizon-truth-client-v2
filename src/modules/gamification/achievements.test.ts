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