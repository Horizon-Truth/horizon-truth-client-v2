/**
 * Daily engagement (Phase 14) — "Today's briefing".
 *
 * A deterministic mission-of-the-day (same date → same pick, given the same
 * content set) plus a small set of daily quests whose progress is tracked in
 * a per-day ledger in the game store. The ledger rolls over automatically at
 * local midnight; quests reinforce the existing streak loop rather than
 * granting client-side rewards.
 */

import type { Scenario } from '@/services/engine.service';

export interface DailyLedger {
    /** Local date key (YYYY-MM-DD) this ledger belongs to. */
    date: string;
    /** Missions completed today. */
    missions: number;
    /** Correct decisions made today. */
    correctDecisions: number;
    /** Missions finished today with ≥80% accuracy. */
    sharpMissions: number;
}

/** Local (not UTC) date key, so "today" matches the player's clock. */
export function todayKey(now: Date = new Date()): string {
    const y = now.getFullYear();
    const m = `${now.getMonth() + 1}`.padStart(2, '0');