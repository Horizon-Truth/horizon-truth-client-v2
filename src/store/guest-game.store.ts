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
                set({ isLoading: true, error: null });
                try {
                    const response = await engineService.getScenarios({ isActive: true } as any);
                    const data = Array.isArray(response) ? response : (response.data || []);
                    set({ scenarios: data, isLoading: false });
                } catch (error: any) {
                    console.error('Guest store failed to fetch scenarios', error);
                    set({ error: error.message, isLoading: false });
                }
            },

            startGuestGame: async (scenario: Scenario) => {
                set({ isLoading: true, activeScenario: scenario, choicesLog: [], trustScore: 50, isCompleted: false, error: null });
                try {
                    // Fetch full scenario with scenes for local play
                    const fullScenario = await engineService.getScenarioById(scenario.id);
                    // Sort scenes by order to find the first one
                    const sortedScenes = [...(fullScenario.scenes || [])].sort((a: any, b: any) => a.order - b.order);
                    const firstScene = sortedScenes[0];

                    if (!firstScene) {
                        throw new Error('This scenario has no scenes configured.');
                    }

                    set({
                        activeScenario: fullScenario,
                        currentScene: firstScene,
                        isLoading: false
                    });
                } catch (error: any) {
                    console.error('Failed to start guest game', error);
                    set({ error: error.message, isLoading: false });
                }
            },

            submitGuestChoice: async (choice: any) => {
                const { currentScene, choicesLog, trustScore, activeScenario, isLoading } = get();
                if (!currentScene || !activeScenario || isLoading) return;

                set({ isLoading: true, error: null });
                try {
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
                            const authStore = JSON.parse(localStorage.getItem('horizon-auth-storage') || '{}');
                            const guestId = authStore.state?.user?.id;

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
                        // Find next scene in the local scenario data (already in state)
                        const nextScene = (activeScenario.scenes || []).find((s: any) => s.id === choice.nextSceneId);

                        if (nextScene) {
                            set({
                                currentScene: nextScene,
                                choicesLog: newChoiceLog,
                                trustScore: newTrustScore
                            });
                        } else {
                            // Fallback: try to find by ID if not in current scenes array for some reason
                            set({ isLoading: true });
                            try {
                                const fullScenario = await engineService.getScenarioById(activeScenario.id);
                                const foundScene = fullScenario.scenes.find((s: any) => s.id === choice.nextSceneId);
                                set({
                                    activeScenario: fullScenario,
                                    currentScene: foundScene,
                                    choicesLog: newChoiceLog,
                                    trustScore: newTrustScore,
                                    isLoading: false
                                });
                            } catch (error: any) {
                                set({ error: "Next scene not found", isLoading: false });
                            }
                        }
                    }
                } finally {
                    set({ isLoading: false });
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
