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
    scenarioType: 'CHALLENGE',
    isActive: true,
    isArchived: false,
    minimumScore: 70,
    gameLevelId: 'lvl',
    totalScenes: 5,
    gameLevel: { id: 'lvl', level: 1, requiredXp: 0 },
    lockStatus: 'AVAILABLE',
    order: 0,
    ...over,
} as Scenario);