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