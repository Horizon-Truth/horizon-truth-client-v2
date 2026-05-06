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