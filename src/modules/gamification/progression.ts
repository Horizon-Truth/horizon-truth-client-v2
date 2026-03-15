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