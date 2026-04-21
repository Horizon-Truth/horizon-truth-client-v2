/**
 * Achievement catalog (Phase 13).
 *
 * These are *derived* achievements: every one is evaluated from data the game
 * already tracks (player stats, the skill book, confidence calibration, the
 * community-impact ledger, daily quests, and per-scenario mastery records).
 * Nothing is minted or stored separately, so an achievement can never claim
 * something the underlying record doesn't support.
 *
 * Server-awarded badges (gamification module) remain the authoritative,
 * tamper-proof awards; these complement them with fine-grained goals.
 */

import { SKILLS, skillLevel, skillAccuracy } from './skills';
import type { SkillProgress } from './skills';
import { bucketAccuracy } from './confidence';
import type { CalibrationLedger } from './confidence';
import { MASTERY_TIERS } from './mastery';
import type { MasteryTier } from './mastery';
import type { DailyLedger } from './daily';

export type AchievementCategory = 'journey' | 'accuracy' | 'skills' | 'impact' | 'habits';

export const ACHIEVEMENT_CATEGORIES: Record<AchievementCategory, { name: string; emoji: string }> = {
    journey: { name: 'The Journey', emoji: '🧭' },
    accuracy: { name: 'Precision', emoji: '🎯' },
    skills: { name: 'Mastery', emoji: '🧠' },
    impact: { name: 'Community Impact', emoji: '🛡️' },
    habits: { name: 'Habits', emoji: '🔥' },
};

/** Everything an achievement may be evaluated against. */
export interface AchievementContext {
    missionsCompleted: number;
    xp: number;
    trustScore: number;
    accuracyRate: number;
    currentStreak: number;
    skillBook: Record<string, SkillProgress>;
    calibration: CalibrationLedger;
    daily: DailyLedger | null;
    /** Mastery tiers earned across all scenarios the player has records for. */
    masteryTiers: MasteryTier[];
    /** Lifetime community impact totals, if known. */
    totalPreventedReach: number;
    totalReached: number;
}

export interface Achievement {
    key: string;
    category: AchievementCategory;
    name: string;
    description: string;
    emoji: string;
    /** Current progress and the target, for partial-progress display. */
    progress: (ctx: AchievementContext) => { current: number; target: number };
}

/** Total decisions recorded across all skills. */
function totalDecisions(book: Record<string, SkillProgress>): number {
    return SKILLS.reduce((sum, s) => sum + (book[s.key]?.total ?? 0), 0);
}

function correctDecisions(book: Record<string, SkillProgress>): number {
    return SKILLS.reduce((sum, s) => sum + (book[s.key]?.correct ?? 0), 0);
}
