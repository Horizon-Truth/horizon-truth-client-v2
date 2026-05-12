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
        category: 'accuracy',
        name: 'Well Calibrated',
        description: 'Be right 90%+ of the time when you say you are certain (min. 10 certain calls).',
        emoji: '⚖️',
        progress: c => {
            const bucket = c.calibration?.certain ?? { correct: 0, total: 0 };
            if (bucket.total < 10) return { current: bucket.total, target: 10 };
            return count(bucketAccuracy(bucket) ?? 0, 90);
        },
    },
    {
        key: 'honest-doubt',
        category: 'accuracy',
        name: 'Honest Doubt',
        description: 'Admit uncertainty 20 times — knowing what you don\'t know is a skill.',
        emoji: '🤔',
        progress: c => count(c.calibration?.guessing?.total ?? 0, 20),
    },

    // ——— Mastery ———
    { key: 'first-gold', category: 'skills', name: 'Going for Gold', description: 'Earn Gold mastery on any mission.', emoji: '🥇', progress: c => count(countTierAtLeast(c.masteryTiers, 2), 1) },
    { key: 'five-gold', category: 'skills', name: 'Gold Standard', description: 'Earn Gold mastery or better on 5 missions.', emoji: '🏅', progress: c => count(countTierAtLeast(c.masteryTiers, 2), 5) },
    { key: 'first-platinum', category: 'skills', name: 'Diamond Hands', description: 'Earn Platinum mastery on any mission.', emoji: '💎', progress: c => count(countTierAtLeast(c.masteryTiers, 3), 1) },
    { key: 'first-legendary', category: 'skills', name: 'Flawless', description: 'Earn Legendary mastery — perfect accuracy and a perfect score.', emoji: '👑', progress: c => count(countTierAtLeast(c.masteryTiers, 5), 1) },
    { key: 'all-skills-started', category: 'skills', name: 'Well Rounded', description: 'Practice all six media-literacy skills.', emoji: '🧩', progress: c => count(SKILLS.filter(s => (c.skillBook[s.key]?.total ?? 0) > 0).length, SKILLS.length) },
    { key: 'skill-level-5', category: 'skills', name: 'Specialist', description: 'Reach level 5 in any skill.', emoji: '📈', progress: c => count(skillsAtLevel(c.skillBook, 5), 1) },
    { key: 'all-skills-level-5', category: 'skills', name: 'Renaissance Mind', description: 'Reach level 5 in every skill.', emoji: '🎓', progress: c => count(skillsAtLevel(c.skillBook, 5), SKILLS.length) },
    { key: 'skill-level-10', category: 'skills', name: 'Grandmaster', description: 'Max out any skill at level 10.', emoji: '🏆', progress: c => count(skillsAtLevel(c.skillBook, 10), 1) },
    {
        key: 'source-expert',
        category: 'skills',
        name: 'Source Expert',
        description: 'Reach 90% accuracy in Source Verification (min. 10 decisions).',
        emoji: '📰',
        progress: c => {
            const p = c.skillBook['source-verification'];
            if (!p || p.total < 10) return { current: p?.total ?? 0, target: 10 };
            return count(skillAccuracy(p) ?? 0, 90);
        },
    },
    {
        key: 'deepfake-hunter',
        category: 'skills',
        name: 'Deepfake Hunter',
        description: 'Reach 90% accuracy in Media Analysis (min. 10 decisions).',
        emoji: '🖼️',
        progress: c => {
            const p = c.skillBook['media-analysis'];
            if (!p || p.total < 10) return { current: p?.total ?? 0, target: 10 };
            return count(skillAccuracy(p) ?? 0, 90);
        },
    },
    {
        key: 'bias-breaker',
        category: 'skills',
        name: 'Bias Breaker',
        description: 'Reach 90% accuracy in Emotional Defense (min. 10 decisions).',
        emoji: '🧘',
        progress: c => {
            const p = c.skillBook['emotional-defense'];
            if (!p || p.total < 10) return { current: p?.total ?? 0, target: 10 };
            return count(skillAccuracy(p) ?? 0, 90);
        },
    },

    // ——— Community impact ———
    { key: 'shield-1000', category: 'impact', name: 'Community Shield', description: 'Prevent 1,000 people from being exposed to misinformation.', emoji: '🛡️', progress: c => count(c.totalPreventedReach, 1000) },
    { key: 'shield-25000', category: 'impact', name: 'Firewall', description: 'Prevent 25,000 exposures.', emoji: '🧱', progress: c => count(c.totalPreventedReach, 25000) },
    { key: 'shield-100000', category: 'impact', name: 'Truth Ambassador', description: 'Prevent 100,000 exposures.', emoji: '🌍', progress: c => count(c.totalPreventedReach, 100000) },
    {
        key: 'clean-hands',
        category: 'impact',
        name: 'Never Amplified',
        description: 'Complete 10 missions without ever spreading misinformation.',
        emoji: '🕊️',
        progress: c => (c.totalReached > 0 ? { current: 0, target: 10 } : count(c.missionsCompleted, 10)),
    },

    // ——— Habits ———
    { key: 'streak-3', category: 'habits', name: 'Building the Habit', description: 'Play 3 days in a row.', emoji: '🔥', progress: c => count(c.currentStreak, 3) },
    { key: 'streak-7', category: 'habits', name: 'Week of Vigilance', description: 'Play 7 days in a row.', emoji: '📅', progress: c => count(c.currentStreak, 7) },
    { key: 'streak-30', category: 'habits', name: 'Thirty Days of Truth', description: 'Play 30 days in a row.', emoji: '🗓️', progress: c => count(c.currentStreak, 30) },
    { key: 'daily-sweep', category: 'habits', name: 'Daily Sweep', description: 'Clear all of a day\'s quests.', emoji: '✅', progress: c => count((c.daily?.missions ?? 0) >= 1 && (c.daily?.correctDecisions ?? 0) >= 5 && (c.daily?.sharpMissions ?? 0) >= 1 ? 1 : 0, 1) },
    { key: 'marathon', category: 'habits', name: 'Marathon Session', description: 'Complete 3 missions in a single day.', emoji: '⏱️', progress: c => count(c.daily?.missions ?? 0, 3) },
];

export interface EvaluatedAchievement extends Achievement {
    current: number;
    target: number;
    unlocked: boolean;
    /** 0–100 completion. */
    pct: number;
}

export function evaluateAchievement(achievement: Achievement, ctx: AchievementContext): EvaluatedAchievement {
    const { current, target } = achievement.progress(ctx);
    const safeTarget = target > 0 ? target : 1;
    const clamped = Math.max(0, Math.min(current, safeTarget));
    return {
        ...achievement,
        current: clamped,
        target: safeTarget,
        unlocked: clamped >= safeTarget,
        pct: Math.round((clamped / safeTarget) * 100),
    };
}

export function evaluateAll(ctx: AchievementContext): EvaluatedAchievement[] {
    return ACHIEVEMENTS.map(a => evaluateAchievement(a, ctx));
}

export function unlockedCount(ctx: AchievementContext): number {
    return evaluateAll(ctx).filter(a => a.unlocked).length;
}
