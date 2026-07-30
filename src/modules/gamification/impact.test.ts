import { describe, it, expect } from 'vitest';
import {
    emptyImpact,
    applyDecisionImpact,
    maxSceneSpread,
    hasImpact,
    impactVerdict,
    formatPeople,
} from './impact';

const spread = (reach: number, reshares = 10, credibility_loss = 5) => ({ reach, reshares, credibility_loss });

describe('applyDecisionImpact', () => {
    it('accumulates spread when the chosen option spreads misinformation', () => {
        let impact = emptyImpact('p1');
        impact = applyDecisionImpact(impact, spread(1200, 40, 8), false);
        impact = applyDecisionImpact(impact, spread(800, 10, 2), false);
        expect(impact).toMatchObject({ reached: 2000, reshares: 50, credibilityLoss: 10, misinfoChoices: 2 });
    });

    it('credits prevented reach from the worst alternative on a correct call', () => {
        const choices = [
            { spreadSimulation: spread(500) },
            { spreadSimulation: spread(3000) },
            { spreadSimulation: null },
        ];
        const impact = applyDecisionImpact(emptyImpact('p1'), null, true, choices);
        expect(impact.preventedReach).toBe(3000);
        expect(impact.protectiveChoices).toBe(1);
    });

    it('ignores neutral decisions and scenes with no spread data', () => {
        const untouched = applyDecisionImpact(emptyImpact('p1'), null, null, []);
        expect(untouched).toEqual(emptyImpact('p1'));
        const correctNoData = applyDecisionImpact(emptyImpact('p1'), null, true, []);
        expect(correctNoData.preventedReach).toBe(0);
        expect(correctNoData.protectiveChoices).toBe(1);
    });

    it('sanitizes malformed numbers', () => {
        const impact = applyDecisionImpact(emptyImpact('p1'), { reach: NaN, reshares: -5, credibility_loss: 3 } as any, false);
        expect(impact).toMatchObject({ reached: 0, reshares: 0, credibilityLoss: 3, misinfoChoices: 1 });
    });
});

describe('maxSceneSpread', () => {
    it('handles missing choice lists', () => {
        expect(maxSceneSpread(null)).toBe(0);
        expect(maxSceneSpread(undefined)).toBe(0);
    });
});

describe('hasImpact / impactVerdict', () => {
    it('only reports impact when something spread or was prevented', () => {
        expect(hasImpact(emptyImpact('p'))).toBe(false);
        expect(hasImpact({ ...emptyImpact('p'), preventedReach: 100 })).toBe(true);
    });

    it('grades clean, mixed, and harmful missions', () => {
        expect(impactVerdict({ ...emptyImpact('p'), preventedReach: 5000, protectiveChoices: 3 }).tone).toBe('good');
        expect(impactVerdict({ ...emptyImpact('p'), reached: 1000, preventedReach: 4000 }).tone).toBe('mixed');
        expect(impactVerdict({ ...emptyImpact('p'), reached: 5000, reshares: 120 }).tone).toBe('bad');
    });
});

describe('formatPeople', () => {
    it('abbreviates thousands and millions', () => {
        expect(formatPeople(950)).toBe('950');
        expect(formatPeople(12800)).toBe('12.8K');
        expect(formatPeople(2000)).toBe('2K');
        expect(formatPeople(1_500_000)).toBe('1.5M');
    });
});
