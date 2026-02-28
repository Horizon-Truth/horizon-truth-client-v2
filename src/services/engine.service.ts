import api from './api';
import { getCurrentLanguage } from '@/store/language.store';
import type { LanguageCode } from '@/shared/i18n/languages';

export interface Scenario {
    id: string;
    title: string;
    description: string;
    language: LanguageCode;
    type: 'SOCIAL_POST' | 'NEWS_STORY' | 'CHAT_CONVERSATION';
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    scenarioType: 'TUTORIAL' | 'CHALLENGE' | 'STORY';
    isActive: boolean;
    isArchived: boolean;
    minimumScore: number;
    gameLevelId: string;
    totalScenes: number;
    gameLevel: {
        id: string;
        level: number;
        requiredXp: number;
    };
    learningObjective?: string;
    behavioralRisk?: string;
    psychologicalTrigger?: string;
    preventionLesson?: string;
    theme?: string;
    scenes?: Scene[];
    userRecord?: {
        bestScore: number;
        bestAccuracyRate: number;
        bestInfluence: number;
        isCompleted: boolean;
        attempts: number;
    } | null;
    lockStatus?: 'LOCKED' | 'AVAILABLE' | 'VERIFIED';
    unlockScenarioId?: string | null;
    campaignTag?: string | null;
    totalPossibleScore?: number;
    order?: number;
    activeProgressId?: string | null;
}

export interface Scene {
    id: string;
    title: string;
    description: string;
    order: number;
    sceneType: 'NARRATIVE' | 'CHOICE' | 'CHALLENGE';