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

const record = (over: Partial<NonNullable<Scenario['userRecord']>> = {}) => ({
    bestScore: 0,
    bestAccuracyRate: 0,
    bestInfluence: 0,
    isCompleted: false,
    attempts: 0,
    ...over,
});

// Skill book where data-literacy is clearly the weakest (25% over 4 tries).
const weakDataLiteracy = {
    'data-literacy': { xp: 30, correct: 1, total: 4 },