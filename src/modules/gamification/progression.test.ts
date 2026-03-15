import { describe, it, expect } from 'vitest';
import { RANKS, levelForXp, xpForLevel, getRank, getNextRank, rankProgress, xpToNextRank } from './progression';

describe('progression', () => {
    it('ranks are ordered by ascending minXp starting at 0', () => {