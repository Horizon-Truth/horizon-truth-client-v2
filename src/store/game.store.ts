import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GameStats {
    trustScore: number;
    level: number;
    experience: number;
    influence: number;
    missionsCompleted: number;
}

export interface GameState {
    stats: GameStats;
    currentScenarioId: string | null;
    completedScenarios: string[];

    // Actions
    updateStats: (updates: Partial<GameStats>) => void;
    addExperience: (amount: number) => void;
    completeMission: (scenarioId: string, trustImpact: number) => void;
    resetGame: () => void;
}

const INITIAL_STATS: GameStats = {
    trustScore: 50,
    level: 1,
    experience: 0,
    influence: 10,
    missionsCompleted: 0,
};

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            stats: INITIAL_STATS,
            currentScenarioId: null,
            completedScenarios: [],

            updateStats: (updates) =>
                set((state) => ({
                    stats: { ...state.stats, ...updates }
                })),

            addExperience: (amount) =>
                set((state) => {
                    const newExp = state.stats.experience + amount;
                    const nextLevelExp = state.stats.level * 100;

                    if (newExp >= nextLevelExp) {
                        return {
                            stats: {
                                ...state.stats,
                                experience: newExp - nextLevelExp,
                                level: state.stats.level + 1,
                                influence: state.stats.influence + 5,
                            }
                        };
                    }

                    return {
                        stats: {
                            ...state.stats,
                            experience: newExp
                        }
                    };
                }),

            completeMission: (scenarioId, trustImpact) =>
                set((state) => {
                    const newTrustScore = Math.min(100, Math.max(0, state.stats.trustScore + trustImpact));
                    const expGained = Math.abs(trustImpact) * 5 + 20;

                    const updatedCompleted = state.completedScenarios.includes(scenarioId)
                        ? state.completedScenarios
                        : [...state.completedScenarios, scenarioId];

                    const newState = {
                        completedScenarios: updatedCompleted,
                        stats: {
                            ...state.stats,
                            trustScore: newTrustScore,
                            missionsCompleted: updatedCompleted.length,
                        }
                    };

                    // Chain exp addition
                    const newExp = newState.stats.experience + expGained;
                    const nextLevelExp = state.stats.level * 100;

                    if (newExp >= nextLevelExp) {
                        newState.stats.level += 1;
                        newState.stats.experience = newExp - nextLevelExp;
                        newState.stats.influence += 5;
                    } else {
                        newState.stats.experience = newExp;
                    }

                    return newState;
                }),

            resetGame: () => set({ stats: INITIAL_STATS, completedScenarios: [], currentScenarioId: null }),
        }),
        {
            name: 'horizon-game-storage',
        }
    )
);
