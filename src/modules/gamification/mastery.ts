/**
 * Scenario mastery tiers (Phase 8) — derived entirely from the existing
 * PlayerScenarioRecord bests returned by the API, so no backend change is
 * required. Tiers give replay a visible goal beyond the pass/100% binary.
 */

export interface MasteryTier {
    key: 'bronze' | 'silver' | 'gold' | 'platinum' | 'master' | 'legendary';
    name: string;
    /** Minimum best accuracy (0–100) to hold this tier. */
    minAccuracy: number;
    emoji: string;
    /** Tailwind text color class. */
    color: string;
    /** Tailwind bg/border classes for chips. */
    chip: string;
}

export const MASTERY_TIERS: MasteryTier[] = [
    { key: 'bronze', name: 'Bronze', minAccuracy: 0, emoji: '🥉', color: 'text-orange-700 dark:text-orange-400', chip: 'bg-orange-500/10 border-orange-500/25' },
    { key: 'silver', name: 'Silver', minAccuracy: 70, emoji: '🥈', color: 'text-slate-600 dark:text-slate-300', chip: 'bg-slate-500/10 border-slate-500/25' },
    { key: 'gold', name: 'Gold', minAccuracy: 85, emoji: '🥇', color: 'text-amber-600 dark:text-amber-400', chip: 'bg-amber-500/10 border-amber-500/25' },
    { key: 'platinum', name: 'Platinum', minAccuracy: 95, emoji: '💎', color: 'text-cyan-600 dark:text-cyan-400', chip: 'bg-cyan-500/10 border-cyan-500/25' },
    { key: 'master', name: 'Master', minAccuracy: 100, emoji: '🏆', color: 'text-violet-600 dark:text-violet-400', chip: 'bg-violet-500/10 border-violet-500/25' },
    { key: 'legendary', name: 'Legendary', minAccuracy: 100, emoji: '👑', color: 'text-yellow-600 dark:text-yellow-400', chip: 'bg-yellow-500/10 border-yellow-500/30' },
];

export interface MasteryInput {
    isCompleted: boolean;
    bestAccuracyRate: number;
    bestScore: number;
    /** Scenario's totalPossibleScore; 0/undefined disables the Legendary check. */
    totalPossibleScore?: number;
}

/** Current tier for a scenario record, or null if never completed. */
export function masteryFor(record: MasteryInput | null | undefined): MasteryTier | null {
    if (!record?.isCompleted) return null;
    const acc = record.bestAccuracyRate ?? 0;
    if (
        acc >= 100 &&
        (record.totalPossibleScore ?? 0) > 0 &&
        record.bestScore >= (record.totalPossibleScore ?? 0)
    ) {
        return MASTERY_TIERS[5]; // legendary: perfect accuracy AND perfect score
    }
    // Walk down from master to bronze.
    for (let i = 4; i >= 0; i--) {
        if (acc >= MASTERY_TIERS[i].minAccuracy) return MASTERY_TIERS[i];
    }
    return MASTERY_TIERS[0];
}

/** The next tier to chase and what it takes, for replay motivation copy. */
export function nextMasteryGoal(record: MasteryInput | null | undefined): { tier: MasteryTier; requirement: string } | null {
    const current = masteryFor(record);
    if (!current) {
        return { tier: MASTERY_TIERS[0], requirement: 'Complete the mission' };
    }
    if (current.key === 'legendary') return null;
    if (current.key === 'master') {
        if ((record?.totalPossibleScore ?? 0) > 0) {
            return { tier: MASTERY_TIERS[5], requirement: 'Perfect accuracy with a perfect score' };
        }
        return null;
    }
    const next = MASTERY_TIERS[MASTERY_TIERS.findIndex(t => t.key === current.key) + 1];
    return { tier: next, requirement: `Reach ${next.minAccuracy}% accuracy` };
}
