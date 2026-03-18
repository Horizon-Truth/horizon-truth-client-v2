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