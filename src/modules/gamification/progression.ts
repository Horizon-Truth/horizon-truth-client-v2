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
    { tier: 3, name: 'Fact Checker', minXp: 900, tagline: 'Verifying before sharing', color: 'text-teal-600 dark:text-teal-400', chip: 'bg-teal-500/10 border-teal-500/20', emoji: '🔍' },
    { tier: 4, name: 'Truth Seeker', minXp: 1600, tagline: 'Digging for original sources', color: 'text-cyan-600 dark:text-cyan-400', chip: 'bg-cyan-500/10 border-cyan-500/20', emoji: '💡' },
    { tier: 5, name: 'Investigator', minXp: 2500, tagline: 'Spotting manipulation techniques', color: 'text-sky-600 dark:text-sky-400', chip: 'bg-sky-500/10 border-sky-500/20', emoji: '🕵️' },
    { tier: 6, name: 'Analyst', minXp: 3600, tagline: 'Reading between the headlines', color: 'text-blue-600 dark:text-blue-400', chip: 'bg-blue-500/10 border-blue-500/20', emoji: '📊' },
    { tier: 7, name: 'Expert', minXp: 4900, tagline: 'Trusted by the community', color: 'text-indigo-600 dark:text-indigo-400', chip: 'bg-indigo-500/10 border-indigo-500/20', emoji: '🎯' },
    { tier: 8, name: 'Guardian', minXp: 6400, tagline: 'Protecting others from falsehoods', color: 'text-violet-600 dark:text-violet-400', chip: 'bg-violet-500/10 border-violet-500/20', emoji: '🛡️' },
    { tier: 9, name: 'Master Defender', minXp: 8100, tagline: 'Misinformation stops with you', color: 'text-purple-600 dark:text-purple-400', chip: 'bg-purple-500/10 border-purple-500/20', emoji: '⚔️' },
    { tier: 10, name: 'Legend', minXp: 10000, tagline: 'A beacon of truth', color: 'text-amber-600 dark:text-amber-400', chip: 'bg-amber-500/10 border-amber-500/20', emoji: '👑' },
];

export function levelForXp(xp: number): number {
    return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1);
}

export function xpForLevel(level: number): number {
    return Math.pow(Math.max(1, level) - 1, 2) * 100;
}

export function getRank(xp: number): Rank {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.minXp) rank = r;
    }
    return rank;
}

export function getNextRank(xp: number): Rank | null {
    const current = getRank(xp);
    return RANKS[current.tier + 1] ?? null;
}

/** Progress (0–100) from the current rank towards the next one. */
export function rankProgress(xp: number): number {
    const current = getRank(xp);
    const next = getNextRank(xp);
    if (!next) return 100;
    const span = next.minXp - current.minXp;
    return Math.min(100, Math.max(0, Math.round(((xp - current.minXp) / span) * 100)));
}

/** Progress (0–100) within the current numeric level. */
export function levelProgress(xp: number): number {
    const level = levelForXp(xp);
    const start = xpForLevel(level);
    const end = xpForLevel(level + 1);
    if (end <= start) return 100;
    return Math.min(100, Math.max(0, Math.round(((xp - start) / (end - start)) * 100)));
}

export function xpToNextRank(xp: number): number {
    const next = getNextRank(xp);
    return next ? Math.max(0, next.minXp - xp) : 0;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}
