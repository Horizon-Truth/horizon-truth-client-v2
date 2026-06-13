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
    contentType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'CHAT' | 'FEED' | 'PROPAGATION';
    isTerminal?: boolean;
    content: any;
    chatMessages: any[];
    feedItems: any[];
    availableChoices: string[];
    decisionTimeLimit?: number | null;
    sceneTypeLabel?: string | null;
    choices?: {
        id?: string;
        label: string;
        actionType?: string;
        nextSceneId?: string;
        scoreImpact?: number;
        influenceImpact?: number;
        spreadSimulation?: { reach: number; reshares: number; credibility_loss: number } | null;
        psychologicalTrap?: string | null;
        outcomes?: {
            id?: string;
            outcomeType: string;
            score?: number;
            trustScoreDelta?: number;
            message?: string;
            endScenario?: boolean;
        }[];
    }[];
}

export interface GameProgress {
    id: string;
    scenarioId: string;
    scenarioTitle: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    currentScene: Scene;
    startedAt: string;
    completedAt?: string;
    finalOutcome?: string;
    totalScore?: number;
    influenceScore?: number;
    passed?: boolean;
    accuracyRate?: number;
}

export interface ChoicePayload {
    progressId: string;
    sceneId: string;
    choiceKey: string;
    metadata?: any;
}

export interface GameOutcome {
    progressId?: string;
    outcomeType: string;
    score: number;
    feedback: string;
    completedAt: string;
    totalScore?: number;
    influenceScore?: number;
    passed?: boolean;
    narrativeEnding?: string;
    accuracyRate?: number | null;
    scenario: {
        id: string;
        title: string;
    };
}

class EngineService {
    async getScenarios(params?: {
        difficulty?: string;
        scenarioType?: string;
        isActive?: boolean;
        isArchived?: boolean;
        language?: LanguageCode;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ data: Scenario[]; total: number; page: number; limit: number }> {
        // Player-facing listing: always scope to a single language so content is
        // never mixed. Default to the user's currently selected language.
        const resolved = { language: getCurrentLanguage(), ...params };
        const response = await api.get('/engine/scenarios', { params: resolved });
        return response.data;
    }

    async getAdminScenarios(params?: { difficulty?: string; scenarioType?: string; isArchived?: boolean; language?: LanguageCode; search?: string }) {
        // Admin listing: language is optional so admins can browse every language.
        const response = await api.get('/engine/admin/scenarios', { params });
        return response.data;
    }

    async getLevels() {
        const response = await api.get('/engine/admin/scenarios/levels');
        return response.data;
    }

    async createLevel(data: any) {
        const response = await api.post('/engine/admin/scenarios/levels', data);
        return response.data;
    }

    async updateLevel(id: string, data: any) {
        const response = await api.put(`/engine/admin/scenarios/levels/${id}`, data);
        return response.data;
    }

    async deleteLevel(id: string) {
        const response = await api.delete(`/engine/admin/scenarios/levels/${id}`);
        return response.data;
    }

    async getScenarioById(id: string) {
        const response = await api.get(`/engine/scenarios/${id}`);
        return response.data;
    }

    async startGame(scenarioId: string) {
        const response = await api.post('/engine/game/start', { scenarioId });
        return response.data;
    }

    async getGameProgress(id: string) {
        const response = await api.get(`/engine/game/progress/${id}`);
        return response.data;
    }

    async submitChoice(data: ChoicePayload) {
        const response = await api.post('/engine/game/choice', data);
        return response.data;
    }

    // Admin Methods
    async createScenario(data: any) {
        const response = await api.post('/engine/admin/scenarios', data);
        return response.data;
    }

    async updateScenario(id: string, data: any) {
        const response = await api.put(`/engine/admin/scenarios/${id}`, data);
        return response.data;
    }

    async deleteScenario(id: string) {
        const response = await api.delete(`/engine/admin/scenarios/${id}`);
        return response.data;
    }

    async exportScenarios(ids: string[]) {
        const response = await api.post('/engine/admin/scenarios/export', { ids });
        return response.data;
    }

    async importScenarios(data: any[]) {
        const response = await api.post('/engine/admin/scenarios/import', data);
        return response.data;
    }

    async getGameOutcome(progressId: string) {
        const response = await api.get(`/engine/game/${progressId}/outcome`);
        return response.data;
    }

    async getMyGameHistory(scenarioId?: string) {
        const response = await api.get('/engine/game/history/me', { params: { scenarioId } });
        return response.data;
    }

    async getScenarioSummary(progressId: string) {
        const response = await api.get(`/engine/game/progress/${progressId}/summary`);
        return response.data;
    }

    // Scene Management
    async getScenes(scenarioId: string) {
        const response = await api.get(`/engine/admin/scenarios/${scenarioId}/scenes`);
        return response.data;
    }

    async createScene(scenarioId: string, data: any) {
        const response = await api.post(`/engine/admin/scenarios/${scenarioId}/scenes`, data);
        return response.data;
    }

    async updateScene(id: string, data: any) {
        const response = await api.put(`/engine/admin/scenes/${id}`, data);
        return response.data;
    }

    async deleteScene(id: string) {
        const response = await api.delete(`/engine/admin/scenes/${id}`);
        return response.data;
    }
}

export const engineService = new EngineService();
