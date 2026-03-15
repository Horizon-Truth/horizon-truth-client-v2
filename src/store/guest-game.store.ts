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

                    if (outcome?.endScenario) {
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
                        // Progression Logic
                        let nextScene = null;

                        if (choice.nextSceneId) {
                            // 1. Explicit Branching: Find next scene by ID in state
                            nextScene = (activeScenario.scenes || []).find((s: any) => s.id === choice.nextSceneId);
                            
                            // 2. Fallback: Re-fetch if not in current state array
                            if (!nextScene) {
                                set({ isLoading: true });
                                try {
                                    const fullScenario = await engineService.getScenarioById(activeScenario.id);
                                    nextScene = fullScenario.scenes.find((s: any) => s.id === choice.nextSceneId);
                                    set({ activeScenario: fullScenario });
                                } catch (error) {
                                    console.error("Next scene re-fetch failed", error);
                                }
                            }
                        } else {
                            // 3. Linear Progression: Find next scene by order
                            const currentOrder = currentScene.order || 0;
                            const sortedScenes = [...(activeScenario.scenes || [])].sort((a: any, b: any) => a.order - b.order);
                            nextScene = sortedScenes.find((s: any) => s.order > currentOrder);
                        }

                        if (nextScene) {
                            set({
                                currentScene: nextScene,
                                choicesLog: newChoiceLog,
                                trustScore: newTrustScore,
                                isLoading: false
                            });
                        } else {
                            // No next scene found, complete scenario
                            set({
                                choicesLog: newChoiceLog,
                                trustScore: newTrustScore,
                                isCompleted: true,
                                currentScene: null,
                                isLoading: false
                            });

                            // Submit anonymous play data to backend (Completion)
                            try {
                                const authStore = JSON.parse(localStorage.getItem('horizon-auth-storage') || '{}');
                                const guestId = authStore.state?.user?.id;
                                await api.post('/engine/guest/play', {
                                    guestId: guestId || 'anonymous',
                                    scenarioId: activeScenario.id,
                                    choicesLog: newChoiceLog,
                                    finalScore: newTrustScore
                                });
                            } catch (e) {
                                console.error('Failed to submit guest play data', e);
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
