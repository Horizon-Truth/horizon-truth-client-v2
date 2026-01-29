import { describe, it, expect } from 'vitest';
import { scenarioSkill, overallAccuracy, recommendScenario } from './recommendation';
import type { Scenario } from '@/services/engine.service';

const scenario = (over: Partial<Scenario>): Scenario => ({
    id: over.id ?? 'id',
    title: 'A mission',
    description: '',
    language: 'en',
    type: 'SOCIAL_POST',
    difficulty: 'MEDIUM',