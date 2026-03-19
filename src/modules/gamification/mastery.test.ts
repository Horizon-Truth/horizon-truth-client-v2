import { describe, it, expect } from 'vitest';
import { masteryFor, nextMasteryGoal } from './mastery';

const record = (over: Partial<Parameters<typeof masteryFor>[0] & object> = {}) => ({
    isCompleted: true,
    bestAccuracyRate: 0,
    bestScore: 0,
    totalPossibleScore: 0,
    ...over,
});

describe('masteryFor', () => {
    it('returns null when never completed', () => {
        expect(masteryFor(null)).toBeNull();
        expect(masteryFor(record({ isCompleted: false, bestAccuracyRate: 90 }))).toBeNull();
    });

    it('maps accuracy to tiers', () => {
        expect(masteryFor(record({ bestAccuracyRate: 40 }))?.key).toBe('bronze');
        expect(masteryFor(record({ bestAccuracyRate: 70 }))?.key).toBe('silver');
        expect(masteryFor(record({ bestAccuracyRate: 84 }))?.key).toBe('silver');
        expect(masteryFor(record({ bestAccuracyRate: 85 }))?.key).toBe('gold');
        expect(masteryFor(record({ bestAccuracyRate: 95 }))?.key).toBe('platinum');
        expect(masteryFor(record({ bestAccuracyRate: 100 }))?.key).toBe('master');
    });

    it('awards legendary only for perfect accuracy AND perfect score', () => {
        expect(masteryFor(record({ bestAccuracyRate: 100, bestScore: 500, totalPossibleScore: 500 }))?.key).toBe('legendary');
        expect(masteryFor(record({ bestAccuracyRate: 100, bestScore: 400, totalPossibleScore: 500 }))?.key).toBe('master');
        // No known totalPossibleScore → legendary unavailable
        expect(masteryFor(record({ bestAccuracyRate: 100, bestScore: 400, totalPossibleScore: 0 }))?.key).toBe('master');
    });
});

describe('nextMasteryGoal', () => {
    it('targets completion when never completed', () => {
        expect(nextMasteryGoal(null)?.tier.key).toBe('bronze');
    });

    it('targets the next tier up', () => {
        expect(nextMasteryGoal(record({ bestAccuracyRate: 50 }))?.tier.key).toBe('silver');
        expect(nextMasteryGoal(record({ bestAccuracyRate: 85 }))?.tier.key).toBe('platinum');
    });

    it('offers legendary after master only when a perfect score is defined', () => {
        expect(nextMasteryGoal(record({ bestAccuracyRate: 100, bestScore: 400, totalPossibleScore: 500 }))?.tier.key).toBe('legendary');
        expect(nextMasteryGoal(record({ bestAccuracyRate: 100, bestScore: 400, totalPossibleScore: 0 }))).toBeNull();
    });

    it('has nothing beyond legendary', () => {
        expect(nextMasteryGoal(record({ bestAccuracyRate: 100, bestScore: 500, totalPossibleScore: 500 }))).toBeNull();
    });
});
