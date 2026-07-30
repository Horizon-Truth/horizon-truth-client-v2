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
    const d = `${now.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function emptyLedger(date: string = todayKey()): DailyLedger {
    return { date, missions: 0, correctDecisions: 0, sharpMissions: 0 };
}

/** Roll the ledger over if it belongs to a previous day. */
export function ensureToday(ledger: DailyLedger | null | undefined, now: Date = new Date()): DailyLedger {
    const key = todayKey(now);
    return ledger && ledger.date === key ? ledger : emptyLedger(key);
}

export interface DailyQuest {
    key: string;
    label: string;
    target: number;
    progress: (ledger: DailyLedger) => number;
}

export const DAILY_QUESTS: DailyQuest[] = [
    { key: 'mission', label: 'Complete a mission', target: 1, progress: l => l.missions },
    { key: 'decisions', label: 'Make 5 correct decisions', target: 5, progress: l => l.correctDecisions },
    { key: 'sharp', label: 'Finish a mission with 80%+ accuracy', target: 1, progress: l => l.sharpMissions },
];

export function questDone(quest: DailyQuest, ledger: DailyLedger): boolean {
    return quest.progress(ledger) >= quest.target;
}

export function allQuestsDone(ledger: DailyLedger): boolean {
    return DAILY_QUESTS.every(q => questDone(q, ledger));
}

/** Deterministic hash so every player sees the same daily pick. */
function hashKey(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return hash;
}

/**
 * Mission of the day: a stable, date-seeded pick over the active scenario
 * list. Locked scenarios are skipped for this player by walking forward from
 * the seeded index, so everyone gets the same pick when their unlocks allow.
 */
export function dailyScenario(scenarios: Scenario[], dateKey: string = todayKey()): Scenario | null {
    if (scenarios.length === 0) return null;
    const start = hashKey(dateKey) % scenarios.length;
    for (let offset = 0; offset < scenarios.length; offset++) {
        const candidate = scenarios[(start + offset) % scenarios.length];
        if (candidate.lockStatus !== 'LOCKED') return candidate;
    }
    return null;
}
