import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { engineService } from '@/services/engine.service';
import type { Scenario, Scene } from '@/services/engine.service';
import api from '@/services/api';

export interface GuestGameState {
    scenarios: Scenario[];
    activeScenario: Scenario | null;
    currentScene: Scene | null;
    choicesLog: any[];
    trustScore: number;
    isCompleted: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchScenarios: () => Promise<void>;
    startGuestGame: (scenario: Scenario) => void;
    submitGuestChoice: (choice: any) => void;
    resetGuestGame: () => void;
}

export const useGuestGameStore = create<GuestGameState>()(
    persist(
        (set, get) => ({
            scenarios: [],
            activeScenario: null,
            currentScene: null,
            choicesLog: [],
            trustScore: 50,
            isCompleted: false,
            isLoading: false,
            error: null,

            fetchScenarios: async () => {
                set({ isLoading: true });
                try {
                    const response = await engineService.getScenarios();
                    set({ scenarios: response.data, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            startGuestGame: async (scenario: Scenario) => {
                set({ isLoading: true, activeScenario: scenario, choicesLog: [], trustScore: 50, isCompleted: false });
                try {
                    // Fetch full scenario with scenes for local play
                    const fullScenario = await engineService.getScenarioById(scenario.id);
                    const firstScene = fullScenario.scenes.sort((a: any, b: any) => a.order - b.order)[0];
                    set({ currentScene: firstScene, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            },

            submitGuestChoice: async (choice: any) => {
                const { currentScene, choicesLog, trustScore, activeScenario } = get();
                if (!currentScene || !activeScenario) return;

                const newChoiceLog = [...choicesLog, {
                    sceneId: currentScene.id,
                    choiceId: choice.id,
                    label: choice.label,
                    timestamp: new Date().toISOString()
                }];

                const outcome = choice.outcomes?.[0]; // Simplified for guest mode
                const newTrustScore = Math.min(100, Math.max(0, trustScore + (outcome?.trustScoreDelta || 0)));

                if (outcome?.endScenario || !choice.nextSceneId) {
                    set({
                        choicesLog: newChoiceLog,
                        trustScore: newTrustScore,
                        isCompleted: true,
                        currentScene: null
                    });

                    // Submit anonymous play data to backend
                    try {
                        const guestId = JSON.parse(localStorage.getItem('horizon-auth-storage') || '{}').state?.user?.id;
                        await api.post('/engine/guest/play', {
                            guestId: guestId || 'anonymous',
                            scenarioId: activeScenario.id,
                            choicesLog: newChoiceLog,
                            finalScore: newTrustScore,
                            metadata: {
                                userAgent: navigator.userAgent,
                                platform: navigator.platform
                            }
                        });
                    } catch (e) {
                        console.error('Failed to submit guest play data', e);
                    }
                } else {
                    // Find next scene in the local scenario data (already fetched in startGuestGame)
                    try {
                        const fullScenario = await engineService.getScenarioById(activeScenario.id);
                        const nextScene = fullScenario.scenes.find((s: any) => s.id === choice.nextSceneId);
                        set({
                            currentScene: nextScene,
                            choicesLog: newChoiceLog,
                            trustScore: newTrustScore
                        });
                    } catch (error: any) {
                        set({ error: error.message });
                    }
                }
            },

            resetGuestGame: () => set({
                activeScenario: null,
                currentScene: null,
                choicesLog: [],
                trustScore: 50,
                isCompleted: false,
                error: null
            })
        }),
        {
            name: 'horizon-guest-game-storage',
            partialize: (state) => ({
                activeScenario: state.activeScenario,
                currentScene: state.currentScene,
                choicesLog: state.choicesLog,
                trustScore: state.trustScore,
                isCompleted: state.isCompleted
            }),
        }
    )
);
