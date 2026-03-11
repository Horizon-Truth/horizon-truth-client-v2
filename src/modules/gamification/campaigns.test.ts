import { describe, it, expect } from 'vitest';
import { campaignTitle, groupByCampaign, campaignWorldState } from './campaigns';
import type { Scenario } from '@/services/engine.service';

const scenario = (id: string, campaignTag: string | null, userRecord?: Partial<NonNullable<Scenario['userRecord']>>): Scenario => ({
    id,
    campaignTag,