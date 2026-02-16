import api from './api';

export interface Scenario {
    id: string;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    scenarioType: 'TUTORIAL' | 'CHALLENGE' | 'STORY';
    isActive: boolean;
    gameLevel: {
        id: string;
        level: number;
        requiredXp: number;
    };
}

export interface Scene {
    id: string;
    title: string;
    description: string;
    order: number;
    sceneType: 'NARRATIVE' | 'CHOICE' | 'CHALLENGE';
    content: any;
    chatMessages: any[];
    feedItems: any[];
    availableChoices: string[];
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
}

export interface ChoicePayload {
    progressId: string;
    sceneId: string;
    choiceKey: string;
    metadata?: any;
}

export interface GameOutcome {
    outcomeType: string;
    score: number;
    feedback: string;
    completedAt: string;
    scenario: {
        id: string;
        title: string;
    };
}

class EngineService {
    async getScenarios(params?: { difficulty?: string; scenarioType?: string }) {
        const response = await api.get('/engine/scenarios', { params });
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

    async getGameOutcome(progressId: string) {
        const response = await api.get(`/engine/game/${progressId}/outcome`);
        return response.data;
    }

    async getMyGameHistory(scenarioId?: string) {
        const response = await api.get('/engine/game/history/me', { params: { scenarioId } });
        return response.data;
    }
}

export const engineService = new EngineService();
