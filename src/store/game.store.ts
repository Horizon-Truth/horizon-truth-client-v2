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
import { mergeSkillBooks, mergeCalibrations } from '@/modules/gamification/learning-profile';
import { emptyImpact, applyDecisionImpact } from '@/modules/gamification/impact';
import type { MissionImpact } from '@/modules/gamification/impact';
import { ensureToday } from '@/modules/gamification/daily';
import type { DailyLedger } from '@/modules/gamification/daily';

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
    /** Community-impact ledger for the current/just-finished mission (Phase 4). */
    missionImpact: MissionImpact | null;
    /** Per-day quest progress (Phase 14); rolls over at local midnight. */
    dailyLedger: DailyLedger | null;
    /** Career totals across all completed missions (Phase 13 achievements). */
    lifetimeImpact: { reached: number; preventedReach: number };

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
            missionImpact: null,
            dailyLedger: null,
            lifetimeImpact: { reached: 0, preventedReach: 0 },

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
                    const [history, playerStats, learningProfile] = await Promise.all([
                        engineService.getMyGameHistory(),
                        userService.getMyStats().catch(() => null), // graceful fallback
                        userService.getMyLearningProfile().catch(() => null) // guests / older servers
                    ]);

                    // Reconcile server-synced ledgers with local ones (element-wise
                    // max, so neither side can lose progress).
                    if (learningProfile) {
                        set(state => ({
                            skillBook: mergeSkillBooks(state.skillBook, learningProfile.skillBook),
                            calibration: mergeCalibrations(state.calibration, learningProfile.calibration),
                        }));
                    }

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
                    set({ activeProgress: progress, isLoading: false, missionImpact: emptyImpact(progress.id) });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to start game', isLoading: false });
                }
            },

            loadProgress: async (progressId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const progress = await engineService.getGameProgress(progressId);
                    set(state => ({
                        activeProgress: progress,
                        isLoading: false,
                        // Keep the impact ledger only if it belongs to this mission.
                        missionImpact: state.missionImpact?.progressId === progress.id
                            ? state.missionImpact
                            : emptyImpact(progress.id),
                    }));
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
                    // Fire-and-forget sync; the server merges element-wise max,
                    // and guests / offline players simply keep local state.
                    userService.saveMyLearningProfile({ skillBook, calibration }).catch(() => { });
                    return { skillBook, calibration };
                };

                // Advance today's quest counters (rolling the ledger over at midnight).
                const bumpDaily = (patch: Partial<Pick<DailyLedger, 'missions' | 'correctDecisions' | 'sharpMissions'>>) => {
                    const today = ensureToday(get().dailyLedger);
                    return {
                        ...today,
                        missions: today.missions + (patch.missions ?? 0),
                        correctDecisions: today.correctDecisions + (patch.correctDecisions ?? 0),
                        sharpMissions: today.sharpMissions + (patch.sharpMissions ?? 0),
                    };
                };

                // Fold this decision into the mission's community-impact ledger.
                const foldImpact = (
                    spread: { reach: number; reshares: number; credibility_loss: number } | null,
                    correct: boolean | null,
                ) => {
                    const current = get().missionImpact?.progressId === activeProgress.id
                        ? get().missionImpact!
                        : emptyImpact(activeProgress.id);
                    return applyDecisionImpact(current, spread, correct, activeProgress.currentScene?.choices);
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