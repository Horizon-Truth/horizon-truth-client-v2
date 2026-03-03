import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { engineService } from '@/services/engine.service';
import type { Scenario, Scene } from '@/services/engine.service';
import api from '@/services/api';

export interface GuestChoiceLogEntry {
    sceneId: string;
    choiceId?: string;
    label: string;
    trustDelta: number;
    timestamp: string;
}

/** Feedback for the last submitted choice, shown as a Learning Moment
 *  before the game advances (via continueGuestGame). */
export interface GuestLastChoice {
    label: string;
    feedback: string | null;
    trustDelta: number;
    trap: string | null;
    correct: boolean | null;
}

export interface GuestGameState {
    scenarios: Scenario[];
    activeScenario: Scenario | null;
    currentScene: Scene | null;
    choicesLog: GuestChoiceLogEntry[];
    trustScore: number;
    isCompleted: boolean;
    isLoading: boolean;
    error: string | null;
    lastChoice: GuestLastChoice | null;
    /** Where the game goes after the player reads the learning moment. */
    pendingAdvance: { nextScene: Scene | null; completed: boolean } | null;

    // Actions
    fetchScenarios: () => Promise<void>;
    startGuestGame: (scenario: Scenario) => void;
    submitGuestChoice: (choice: any) => void;
    continueGuestGame: () => void;
    resetGuestGame: () => void;
}

async function reportGuestPlay(scenarioId: string, choicesLog: GuestChoiceLogEntry[], finalScore: number) {
    try {
        const authStore = JSON.parse(localStorage.getItem('horizon-auth-storage') || '{}');
        const guestId = authStore.state?.user?.id;
        await api.post('/engine/guest/play', {
            guestId: guestId || 'anonymous',
            scenarioId,
            choicesLog,
            finalScore,
            metadata: {
                userAgent: navigator.userAgent,
                platform: navigator.platform
            }
        });
    } catch (e) {
        console.error('Failed to submit guest play data', e);
    }
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
            lastChoice: null,
            pendingAdvance: null,

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
                set({ isLoading: true, activeScenario: scenario, choicesLog: [], trustScore: 50, isCompleted: false, error: null, lastChoice: null, pendingAdvance: null });
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
                const { currentScene, choicesLog, trustScore, activeScenario, isLoading, lastChoice } = get();
                if (!currentScene || !activeScenario || isLoading || lastChoice) return;

                set({ isLoading: true, error: null });
                try {
                    const outcome = choice.outcomes?.[0]; // Simplified for guest mode
                    const trustDelta = outcome?.trustScoreDelta ?? choice.scoreImpact ?? 0;
                    const newTrustScore = Math.min(100, Math.max(0, trustScore + trustDelta));

                    const newChoiceLog: GuestChoiceLogEntry[] = [...choicesLog, {
                        sceneId: currentScene.id,
                        choiceId: choice.id,
                        label: choice.label,
                        trustDelta,
                        timestamp: new Date().toISOString()
                    }];

                    // Resolve where the game goes next (but don't advance yet —
                    // the player reads the learning moment first).
                    let nextScene: Scene | null = null;
                    if (!outcome?.endScenario) {
                        if (choice.nextSceneId) {
                            // Explicit branching: find next scene by ID in state
                            nextScene = (activeScenario.scenes || []).find((s: any) => s.id === choice.nextSceneId) ?? null;

                            // Fallback: re-fetch if not in current state array
                            if (!nextScene) {
                                try {
                                    const fullScenario = await engineService.getScenarioById(activeScenario.id);
                                    nextScene = fullScenario.scenes?.find((s: any) => s.id === choice.nextSceneId) ?? null;
                                    set({ activeScenario: fullScenario });
                                } catch (error) {
                                    console.error('Next scene re-fetch failed', error);
                                }
                            }
                        } else {
                            // Linear progression: find next scene by order
                            const currentOrder = currentScene.order || 0;
                            const sortedScenes = [...(get().activeScenario?.scenes || [])].sort((a: any, b: any) => a.order - b.order);
                            nextScene = sortedScenes.find((s: any) => s.order > currentOrder) ?? null;
                        }
                    }

                    set({
                        choicesLog: newChoiceLog,
                        trustScore: newTrustScore,
                        lastChoice: {
                            label: choice.label,
                            feedback: outcome?.message || null,
                            trustDelta,
                            trap: choice.psychologicalTrap || null,
                            correct: trustDelta > 0 ? true : trustDelta < 0 ? false : null,
                        },
                        pendingAdvance: { nextScene, completed: !nextScene },
                        isLoading: false
                    });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to submit choice', isLoading: false });
                }
            },

            continueGuestGame: () => {
                const { pendingAdvance, activeScenario, choicesLog, trustScore } = get();
                if (!pendingAdvance) return;

                if (pendingAdvance.completed) {
                    set({ isCompleted: true, currentScene: null, lastChoice: null, pendingAdvance: null });
                    if (activeScenario) {
                        void reportGuestPlay(activeScenario.id, choicesLog, trustScore);
                    }
                } else {
                    set({ currentScene: pendingAdvance.nextScene, lastChoice: null, pendingAdvance: null });
                }
            },

            resetGuestGame: () => set({
                activeScenario: null,
                currentScene: null,
                choicesLog: [],
                trustScore: 50,
                isCompleted: false,
                error: null,
                lastChoice: null,
                pendingAdvance: null
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
