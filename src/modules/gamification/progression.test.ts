import { describe, it, expect } from 'vitest';
import { RANKS, levelForXp, xpForLevel, getRank, getNextRank, rankProgress, xpToNextRank } from './progression';

describe('progression', () => {
    it('ranks are ordered by ascending minXp starting at 0', () => {
        expect(RANKS[0].minXp).toBe(0);
        for (let i = 1; i < RANKS.length; i++) {
            expect(RANKS[i].minXp).toBeGreaterThan(RANKS[i - 1].minXp);
        }
    });

    it('levelForXp matches the store formula', () => {
        expect(levelForXp(0)).toBe(1);
        expect(levelForXp(99)).toBe(1);
        expect(levelForXp(100)).toBe(2);
        expect(levelForXp(400)).toBe(3);
        expect(levelForXp(-50)).toBe(1);
    });

    it('xpForLevel inverts levelForXp at boundaries', () => {
        for (let level = 1; level <= 12; level++) {
            expect(levelForXp(xpForLevel(level))).toBe(level);
        }
    });

    it('getRank returns the highest earned rank', () => {
        expect(getRank(0).name).toBe('Recruit');
        expect(getRank(99).name).toBe('Recruit');
        expect(getRank(100).name).toBe('Beginner');
        expect(getRank(10000).name).toBe('Legend');
        expect(getRank(999999).name).toBe('Legend');
    });

    it('getNextRank returns null at max rank', () => {
        expect(getNextRank(0)?.name).toBe('Beginner');
        expect(getNextRank(10000)).toBeNull();
    });

    it('rankProgress stays within 0-100', () => {
        expect(rankProgress(0)).toBe(0);
        expect(rankProgress(50)).toBe(50);
        expect(rankProgress(10000)).toBe(100);
        expect(rankProgress(999999)).toBe(100);
    });

    it('xpToNextRank is 0 at max rank and positive otherwise', () => {
        expect(xpToNextRank(0)).toBe(100);
        expect(xpToNextRank(10000)).toBe(0);
    });
});
