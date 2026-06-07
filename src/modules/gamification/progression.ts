/**
 * Single source of truth for player progression.
 *
 * XP → level: level = floor(sqrt(xp / 100)) + 1  (kept compatible with the
 * existing game.store formula so persisted stats keep meaning).
 * Level N starts at xp = (N - 1)^2 * 100.
 */

export interface Rank {
    /** Rank index, 0-based */
    tier: number;
    name: string;
    /** Minimum total XP to hold this rank */
    minXp: number;
    /** Short motto shown under the rank name */
    tagline: string;
    /** Tailwind text color class */
    color: string;
    /** Tailwind bg/border classes for badge chips */
    chip: string;
    emoji: string;
}

export const RANKS: Rank[] = [
    { tier: 0, name: 'Recruit', minXp: 0, tagline: 'Learning the basics', color: 'text-slate-500 dark:text-slate-400', chip: 'bg-slate-500/10 border-slate-500/20', emoji: '🎓' },
    { tier: 1, name: 'Beginner', minXp: 100, tagline: 'First steps against misinformation', color: 'text-lime-600 dark:text-lime-400', chip: 'bg-lime-500/10 border-lime-500/20', emoji: '🌱' },
    { tier: 2, name: 'Explorer', minXp: 400, tagline: 'Questioning what you read', color: 'text-emerald-600 dark:text-emerald-400', chip: 'bg-emerald-500/10 border-emerald-500/20', emoji: '🧭' },