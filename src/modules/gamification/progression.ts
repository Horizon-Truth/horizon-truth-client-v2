/**
 * Single source of truth for player progression.
 *
 * XP → level: level = floor(sqrt(xp / 100)) + 1  (kept compatible with the
 * existing game.store formula so persisted stats keep meaning).
 * Level N starts at xp = (N - 1)^2 * 100.
 */

export interface Rank {