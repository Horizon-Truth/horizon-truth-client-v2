import { describe, it, expect } from 'vitest';
import { RANKS, levelForXp, xpForLevel, getRank, getNextRank, rankProgress, xpToNextRank } from './progression';

describe('progression', () => {
    it('ranks are ordered by ascending minXp starting at 0', () => {
        expect(RANKS[0].minXp).toBe(0);
        for (let i = 1; i < RANKS.length; i++) {
            expect(RANKS[i].minXp).toBeGreaterThan(RANKS[i - 1].minXp);
        }
    });