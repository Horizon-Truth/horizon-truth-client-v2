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