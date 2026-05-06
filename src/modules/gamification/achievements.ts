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

function countTierAtLeast(tiers: MasteryTier[], minIndex: number): number {
    return tiers.filter(t => MASTERY_TIERS.findIndex(m => m.key === t.key) >= minIndex).length;
}

function skillsAtLevel(book: Record<string, SkillProgress>, level: number): number {
    return SKILLS.filter(s => skillLevel(book[s.key]?.xp ?? 0) >= level).length;
}

const count = (current: number, target: number) => ({ current: Math.min(current, target), target });

export const ACHIEVEMENTS: Achievement[] = [
    // ——— The journey ———
    { key: 'first-investigation', category: 'journey', name: 'First Investigation', description: 'Complete your first mission.', emoji: '🔍', progress: c => count(c.missionsCompleted, 1) },
    { key: 'five-missions', category: 'journey', name: 'Getting Serious', description: 'Complete 5 missions.', emoji: '📋', progress: c => count(c.missionsCompleted, 5) },
    { key: 'twenty-missions', category: 'journey', name: 'Seasoned Investigator', description: 'Complete 20 missions.', emoji: '🕵️', progress: c => count(c.missionsCompleted, 20) },
    { key: 'fifty-missions', category: 'journey', name: 'Veteran of the Feed', description: 'Complete 50 missions.', emoji: '🎖️', progress: c => count(c.missionsCompleted, 50) },
    { key: 'xp-1000', category: 'journey', name: 'Thousand Points of Truth', description: 'Earn 1,000 XP.', emoji: '✨', progress: c => count(c.xp, 1000) },
    { key: 'xp-5000', category: 'journey', name: 'Hardened Analyst', description: 'Earn 5,000 XP.', emoji: '⚡', progress: c => count(c.xp, 5000) },
    { key: 'xp-10000', category: 'journey', name: 'Legend of Horizon', description: 'Earn 10,000 XP and reach the final rank.', emoji: '👑', progress: c => count(c.xp, 10000) },

    // ——— Precision ———
    { key: 'hundred-correct', category: 'accuracy', name: '100 Correct Calls', description: 'Make 100 correct decisions.', emoji: '💯', progress: c => count(correctDecisions(c.skillBook), 100) },
    { key: 'five-hundred-decisions', category: 'accuracy', name: 'Practice Makes Sharp', description: 'Make 500 decisions of any kind.', emoji: '🔁', progress: c => count(totalDecisions(c.skillBook), 500) },
    { key: 'accuracy-80', category: 'accuracy', name: 'Sharp Eye', description: 'Hold an overall accuracy of 80% or better.', emoji: '👁️', progress: c => count(c.accuracyRate, 80) },
    { key: 'accuracy-95', category: 'accuracy', name: 'Surgical', description: 'Hold an overall accuracy of 95% or better.', emoji: '🎯', progress: c => count(c.accuracyRate, 95) },
    { key: 'trust-90', category: 'accuracy', name: 'Pillar of the Community', description: 'Reach a trust score of 90.', emoji: '🏛️', progress: c => count(c.trustScore, 90) },
    {
        key: 'well-calibrated',