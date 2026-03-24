import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { engineService } from '@/services/engine.service';
import { userService } from '@/services/user.service';
import type { GameProgress, GameOutcome } from '@/services/engine.service';

export interface GameStats {
    trustScore: number;
    level: number;
    experience: number;
    influence: number;
    missionsCompleted: number;
    accuracyRate: number;
}

export interface GameState {
    stats: GameStats;
    activeProgress: GameProgress | null;
    currentOutcome: GameOutcome | null;
    history: GameProgress[];
    isLoading: boolean;
    error: string | null;
    pendingBadges: any[];
    // Spread simulation data from last choice
    lastSpreadSimulation: { reach: number; reshares: number; credibility_loss: number } | null;
    lastChoiceLabel: string | null;
    lastChoiceFeedback: string | null;
    // Player identity
    reputationRole: string;
    currentStreak: number;

    // Actions
    fetchGameHistory: () => Promise<void>;
    startGame: (scenarioId: string) => Promise<void>;
    submitChoice: (sceneId: string, choiceKey: string, choiceLabel?: string) => Promise<void>;
    loadProgress: (progressId: string) => Promise<void>;
    resetGame: () => void;
    clearError: () => void;
    removePendingBadge: (badgeId: string) => void;
    prefetchAssets: (scene: any) => void;
    clearSpreadSimulation: () => void;
}

const INITIAL_STATS: GameStats = {
    trustScore: 50,
    level: 1,
    experience: 0,
    influence: 10,
    missionsCompleted: 0,
    accuracyRate: 100,
};

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            stats: INITIAL_STATS,
            activeProgress: null,
            currentOutcome: null,
            history: [],
            isLoading: false,
            error: null,
            pendingBadges: [],
            lastSpreadSimulation: null,
            lastChoiceLabel: null,
            lastChoiceFeedback: null,
            reputationRole: 'OBSERVER',
            currentStreak: 0,

            prefetchAssets: (scene: any) => {
                if (!scene || !scene.content) return;

                const assetsToPreload: string[] = [];
                if (scene.content.imageUrl) assetsToPreload.push(scene.content.imageUrl);
                if (scene.content.videoUrl) assetsToPreload.push(scene.content.videoUrl);
                if (scene.content.mediaUrl) assetsToPreload.push(scene.content.mediaUrl);
                if (scene.content.feedItems) {
                    scene.content.feedItems.forEach((item: any) => {
                        if (item.mediaUrl) assetsToPreload.push(item.mediaUrl);
                    });
                }

                assetsToPreload.forEach(url => {
                    if (url.endsWith('.mp4') || url.endsWith('.webm')) {
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.as = 'video';
                        link.href = url;
                        document.head.appendChild(link);
                    } else {
                        const img = new Image();
                        img.src = url;
                    }
                });
            },

            fetchGameHistory: async () => {
                set({ isLoading: true, error: null });
                try {
                    const [history, playerStats] = await Promise.all([
                        engineService.getMyGameHistory(),
                        userService.getMyStats().catch(() => null) // graceful fallback
                    ]);

                    // Calculate average accuracy from completed items in history
                    const completedGames = history.filter((game: GameProgress) => game.status === 'COMPLETED' && typeof game.accuracyRate === 'number');
                    let averageAccuracy = 0;
                    if (completedGames.length > 0) {
                        const sumAccuracy = completedGames.reduce((sum: number, game: GameProgress) => sum + (game.accuracyRate || 0), 0);
                        averageAccuracy = Math.round(sumAccuracy / completedGames.length);
                    }

                    // Calculate total influence
                    let totalInfluence = 0;
                    history.forEach((game: GameProgress) => {
                        if (game.influenceScore) totalInfluence += game.influenceScore;
                    });

                    // Determine level and experience 
                    // Let's use playerStats.totalScore as experience (fallback to computing from history if API fails)
                    let experience = playerStats?.totalScore ?? 0;
                    if (!playerStats) {
                        experience = history.reduce((sum: number, game: GameProgress) => sum + (game.totalScore || 0), 0);
                    }
                    const level = Math.max(1, Math.floor(Math.sqrt(experience / 100)) + 1);

                    set(state => ({
                        history,
                        stats: {
                            ...state.stats,
                            missionsCompleted: playerStats?.gamesCompleted ?? completedGames.length,
                            experience: experience,
                            level: level,
                            accuracyRate: averageAccuracy,
                            influence: totalInfluence,
                            trustScore: playerStats?.trustScore ?? 50
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

            submitChoice: async (sceneId: string, choiceKey: string, choiceLabel?: string) => {
                const { activeProgress, isLoading } = get();
                if (!activeProgress || isLoading) return;

                set({ isLoading: true, error: null, lastSpreadSimulation: null, lastChoiceLabel: null, lastChoiceFeedback: null });
                try {
                    const result = await engineService.submitChoice({
                        progressId: activeProgress.id,
                        sceneId,
                        choiceKey
                    });

                    if (result.status === 'scene_completed') {
                        // Check if the choice had a spread simulation (wrong choice)
                        const choiceData = activeProgress.currentScene?.choices?.find(
                            (c: any) => c.label === choiceKey || c.id === choiceKey
                        );
                        const spreadSim = choiceData?.spreadSimulation || result.spreadSimulation || null;

                        set({
                            activeProgress: {
                                ...activeProgress,
                                currentScene: result.nextScene,
                                totalScore: result.totalScore,
                                influenceScore: result.influenceScore,
                                accuracyRate: result.accuracyRate
                            },
                            stats: {
                                ...get().stats,
                                trustScore: get().stats.trustScore + (result.trustScoreDelta ?? 0),
                                influence: result.influenceScore ?? get().stats.influence,
                                accuracyRate: result.accuracyRate ?? get().stats.accuracyRate
                            },
                            lastSpreadSimulation: spreadSim,
                            lastChoiceLabel: choiceLabel || choiceKey,
                            lastChoiceFeedback: result.message || null,
                            isLoading: false
                        });
                        // Phase 16: Prefetch next scene assets
                        get().prefetchAssets(result.nextScene);
                    } else if (result.status === 'game_completed') {
                        set({
                            activeProgress: null,
                            currentOutcome: result.outcome,
                            isLoading: false,
                            reputationRole: result.reputationRole || get().reputationRole,
                            currentStreak: result.currentStreak || get().currentStreak,
                            stats: {
                                ...get().stats,
                                // Optimistic update, ideally should fetch fresh stats
                                missionsCompleted: get().stats.missionsCompleted + 1,
                                experience: get().stats.experience + result.outcome.score,
                                trustScore: get().stats.trustScore + (result.outcome.trustScoreDelta ?? 0),
                                influence: result.outcome.influenceScore ?? get().stats.influence
                            },
                            pendingBadges: result.badgesAwarded || []
                        });
                        // Refresh history after game completion to ensure scores are updated
                        get().fetchGameHistory();
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
                isLoading: false,
                lastSpreadSimulation: null,
                lastChoiceLabel: null,
                lastChoiceFeedback: null,
            }),

            clearError: () => set({ error: null }),

            clearSpreadSimulation: () => set({ lastSpreadSimulation: null, lastChoiceLabel: null, lastChoiceFeedback: null }),

            removePendingBadge: (badgeId: string) => set(state => ({
                pendingBadges: state.pendingBadges.filter(b => b.id !== badgeId)
            }))
        }),
        {
            name: 'horizon-game-storage',
            partialize: (state) => ({
                stats: state.stats,
                activeProgress: state.activeProgress,
                currentOutcome: state.currentOutcome,
                reputationRole: state.reputationRole,
                currentStreak: state.currentStreak,
            }),
        }
    )
);
