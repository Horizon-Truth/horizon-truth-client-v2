import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { engineService } from '@/services/engine.service';
import type { GameProgress, GameOutcome } from '@/services/engine.service';

export interface GameStats {
    trustScore: number;
    level: number;
    experience: number;
    influence: number;
    missionsCompleted: number;
}

export interface GameState {
    stats: GameStats;
    activeProgress: GameProgress | null;
    currentOutcome: GameOutcome | null;
    isLoading: boolean;
    error: string | null;
    pendingBadges: any[];

    // Actions
    fetchGameHistory: () => Promise<void>;
    startGame: (scenarioId: string) => Promise<void>;
    submitChoice: (sceneId: string, choiceKey: string) => Promise<void>;
    loadProgress: (progressId: string) => Promise<void>;
    resetGame: () => void;
    clearError: () => void;
    removePendingBadge: (badgeId: string) => void;
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
        (set, get) => ({
            stats: INITIAL_STATS,
            activeProgress: null,
            currentOutcome: null,
            isLoading: false,
            error: null,
            pendingBadges: [],

            fetchGameHistory: async () => {
                set({ isLoading: true, error: null });
                try {
                    const history = await engineService.getMyGameHistory();
                    // Calculate stats from history if needed, or fetch separate stats endpoint
                    // For now, we'll just update missionsCompleted
                    set(state => ({
                        stats: {
                            ...state.stats,
                            missionsCompleted: history.length
                        },
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch history', isLoading: false });
                }
            },

            startGame: async (scenarioId: string) => {
                set({ isLoading: true, error: null, currentOutcome: null });
                try {
                    const progress = await engineService.startGame(scenarioId);
                    set({ activeProgress: progress, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to start game', isLoading: false });
                }
            },

            loadProgress: async (progressId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const progress = await engineService.getGameProgress(progressId);
                    set({ activeProgress: progress, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to load progress', isLoading: false });
                }
            },

            submitChoice: async (sceneId: string, choiceKey: string) => {
                const { activeProgress } = get();
                if (!activeProgress) return;

                set({ isLoading: true, error: null });
                try {
                    const result = await engineService.submitChoice({
                        progressId: activeProgress.id,
                        sceneId,
                        choiceKey
                    });

                    if (result.status === 'scene_completed') {
                        set({
                            activeProgress: {
                                ...activeProgress,
                                currentScene: result.nextScene
                            },
                            isLoading: false
                        });
                    } else if (result.status === 'game_completed') {
                        set({
                            activeProgress: null,
                            currentOutcome: result.outcome,
                            isLoading: false,
                            stats: {
                                ...get().stats,
                                // Optimistic update, ideally should fetch fresh stats
                                missionsCompleted: get().stats.missionsCompleted + 1,
                                experience: get().stats.experience + result.outcome.score
                            },
                            pendingBadges: result.badgesAwarded || []
                        });
                    } else if (result.status === 'scene_completed' && result.awardedBadges) {
                        set(state => ({
                            pendingBadges: [...state.pendingBadges, ...result.awardedBadges]
                        }));
                    }
                } catch (error: any) {
                    set({ error: error.message || 'Failed to submit choice', isLoading: false });
                }
            },

            resetGame: () => set({
                activeProgress: null,
                currentOutcome: null,
                error: null,
                isLoading: false
            }),

            clearError: () => set({ error: null }),

            removePendingBadge: (badgeId: string) => set(state => ({
                pendingBadges: state.pendingBadges.filter(b => b.id !== badgeId)
            }))
        }),
        {
            name: 'horizon-game-storage',
            partialize: (state) => ({ stats: state.stats }), // Only persist stats
        }
    )
);
