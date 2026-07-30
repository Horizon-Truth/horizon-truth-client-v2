import { describe, it, expect } from 'vitest';
import { campaignTitle, groupByCampaign, campaignWorldState } from './campaigns';
import type { Scenario } from '@/services/engine.service';

const scenario = (id: string, campaignTag: string | null, userRecord?: Partial<NonNullable<Scenario['userRecord']>>): Scenario => ({
    id,
    campaignTag,
    userRecord: userRecord
        ? { bestScore: 0, bestAccuracyRate: 0, bestInfluence: 0, isCompleted: false, attempts: 1, ...userRecord }
        : null,
} as Scenario);

describe('campaignTitle', () => {
    it('humanizes tags in any common casing', () => {
        expect(campaignTitle('ELECTION_CAMPAIGN')).toBe('Election Campaign');
        expect(campaignTitle('health-hoax')).toBe('Health Hoax');
        expect(campaignTitle('viral panic')).toBe('Viral Panic');
    });
});

describe('groupByCampaign', () => {
    it('groups consecutive runs and keeps standalone missions between arcs', () => {
        const groups = groupByCampaign([
            scenario('a', 'ARC_ONE'),
            scenario('b', 'ARC_ONE'),
            scenario('c', null),
            scenario('d', 'ARC_TWO'),
        ]);
        expect(groups.map(g => [g.tag, g.scenarios.length])).toEqual([
            ['ARC_ONE', 2],
            [null, 1],
            ['ARC_TWO', 1],
        ]);
        expect(groups[0].title).toBe('Arc One');
        expect(groups[1].title).toBeNull();
    });

    it('handles empty input', () => {
        expect(groupByCampaign([])).toEqual([]);
    });
});

describe('campaignWorldState', () => {
    it('starts neutral before any mission is completed', () => {
        const state = campaignWorldState([scenario('a', 'ARC'), scenario('b', 'ARC')]);
        expect(state).toMatchObject({ completed: 0, total: 2, pct: 0, avgAccuracy: null, tone: 'neutral' });
    });

    it('averages accuracy over completed missions only', () => {
        const state = campaignWorldState([
            scenario('a', 'ARC', { isCompleted: true, bestAccuracyRate: 90 }),
            scenario('b', 'ARC', { isCompleted: true, bestAccuracyRate: 80 }),
            scenario('c', 'ARC'),
        ]);
        expect(state.completed).toBe(2);
        expect(state.pct).toBe(67);
        expect(state.avgAccuracy).toBe(85);
        expect(state.tone).toBe('thriving');
    });

    it('maps accuracy bands to narrative tones', () => {
        const at = (acc: number) =>
            campaignWorldState([scenario('a', 'ARC', { isCompleted: true, bestAccuracyRate: acc })]).tone;
        expect(at(90)).toBe('thriving');
        expect(at(75)).toBe('contested');
        expect(at(50)).toBe('crisis');
    });
});
