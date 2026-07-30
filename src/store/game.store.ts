import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { engineService } from '@/services/engine.service';
import { userService } from '@/services/user.service';
import type { GameProgress, GameOutcome } from '@/services/engine.service';
import { matchTechnique } from '@/modules/gamification/learning-content';
import { skillForTechnique, XP_PER_CORRECT_DECISION, XP_PER_INCORRECT_DECISION } from '@/modules/gamification/skills';
import type { SkillProgress } from '@/modules/gamification/skills';
import { EMPTY_CALIBRATION, confidenceKeyForLevel } from '@/modules/gamification/confidence';
import type { ConfidenceLevel, CalibrationLedger } from '@/modules/gamification/confidence';

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
    /** Whether the previous choice gained (true), lost (false) or kept (null) trust. */
    lastChoiceCorrect: boolean | null;
    lastTrustDelta: number;
    /** The psychological trap attached to the last chosen option, if any. */
    lastChoiceTrap: string | null;
    // Player identity
    reputationRole: string;
    currentStreak: number;
    /** Per-skill competency ledger (Phase 7), keyed by skill key. */
    skillBook: Record<string, SkillProgress>;
    /** Confidence-vs-accuracy ledger (Phase 15). */
    calibration: CalibrationLedger;
    /** Confidence stated for the last submitted choice. */
    lastConfidence: ConfidenceLevel | null;

    // Actions
    fetchGameHistory: () => Promise<void>;
    startGame: (scenarioId: string) => Promise<void>;
    submitChoice: (sceneId: string, choiceKey: string, choiceLabel?: string, confidence?: ConfidenceLevel) => Promise<void>;
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
            lastChoiceCorrect: null,
            lastTrustDelta: 0,
            lastChoiceTrap: null,
            reputationRole: 'OBSERVER',
            currentStreak: 0,
            skillBook: {},
            calibration: EMPTY_CALIBRATION,
            lastConfidence: null,

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

            submitChoice: async (sceneId: string, choiceKey: string, choiceLabel?: string, confidence?: ConfidenceLevel) => {
                const { activeProgress, isLoading } = get();
                if (!activeProgress || isLoading) return;

                // Attribute a resolved decision to the skill graph and calibration ledger.
                const recordDecision = (correct: boolean | null, trap: string | null | undefined) => {
                    if (correct === null) return {};
                    const skill = skillForTechnique(matchTechnique(trap)?.key);
                    const prev = get().skillBook[skill.key] ?? { xp: 0, correct: 0, total: 0 };
                    const skillBook = {
                        ...get().skillBook,
                        [skill.key]: {
                            xp: prev.xp + (correct ? XP_PER_CORRECT_DECISION : XP_PER_INCORRECT_DECISION),
                            correct: prev.correct + (correct ? 1 : 0),
                            total: prev.total + 1,
                        },
                    };
                    let calibration = get().calibration;
                    if (confidence) {
                        const key = confidenceKeyForLevel(confidence);
                        const bucket = calibration[key] ?? { correct: 0, total: 0 };
                        calibration = {
                            ...calibration,
                            [key]: { correct: bucket.correct + (correct ? 1 : 0), total: bucket.total + 1 },
                        };
                    }
                    return { skillBook, calibration };
                };

                set({ isLoading: true, error: null, lastSpreadSimulation: null, lastChoiceLabel: null, lastChoiceFeedback: null, lastChoiceCorrect: null, lastTrustDelta: 0, lastChoiceTrap: null, lastConfidence: confidence ?? null });
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
                        const trustDelta = result.trustScoreDelta ?? choiceData?.scoreImpact ?? 0;
                        const choiceCorrect = trustDelta === 0 ? (spreadSim ? false : null) : trustDelta > 0;

                        set({
                            ...recordDecision(choiceCorrect, choiceData?.psychologicalTrap),
                            activeProgress: {
                                ...activeProgress,
                                currentScene: result.nextScene,
                                totalScore: result.totalScore,
                                influenceScore: result.influenceScore,
                                accuracyRate: result.accuracyRate
                            },
                            stats: {
                                ...get().stats,
                                trustScore: Math.min(100, Math.max(0, get().stats.trustScore + (result.trustScoreDelta ?? 0))),
                                influence: result.influenceScore ?? get().stats.influence,
                                accuracyRate: result.accuracyRate ?? get().stats.accuracyRate
                            },
                            lastSpreadSimulation: spreadSim,
                            lastChoiceLabel: choiceLabel || choiceKey,
                            lastChoiceFeedback: result.message || null,
                            lastChoiceCorrect: choiceCorrect,
                            lastTrustDelta: trustDelta,
                            lastChoiceTrap: choiceData?.psychologicalTrap ?? null,
                            isLoading: false
                        });
                        // Phase 16: Prefetch next scene assets
                        get().prefetchAssets(result.nextScene);
                    } else if (result.status === 'game_completed') {
                        const finalChoice = activeProgress.currentScene?.choices?.find(
                            (c: any) => c.label === choiceKey || c.id === choiceKey
                        );
                        const finalDelta = result.outcome?.trustScoreDelta ?? finalChoice?.scoreImpact ?? 0;
                        set({
                            ...recordDecision(finalDelta === 0 ? null : finalDelta > 0, finalChoice?.psychologicalTrap),
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
                                trustScore: Math.min(100, Math.max(0, get().stats.trustScore + (result.outcome.trustScoreDelta ?? 0))),
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
                lastChoiceCorrect: null,
                lastTrustDelta: 0,
                lastChoiceTrap: null,
                lastConfidence: null,
            }),

            clearError: () => set({ error: null }),

            clearSpreadSimulation: () => set({ lastSpreadSimulation: null, lastChoiceLabel: null, lastChoiceFeedback: null, lastChoiceCorrect: null, lastTrustDelta: 0, lastChoiceTrap: null }),

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
                skillBook: state.skillBook,
                calibration: state.calibration,
            }),
        }
    )
);
