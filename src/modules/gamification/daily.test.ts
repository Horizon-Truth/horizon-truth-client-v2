import { describe, it, expect } from 'vitest';
import {
    todayKey,
    emptyLedger,
    ensureToday,
    DAILY_QUESTS,
    questDone,
    allQuestsDone,
    dailyScenario,
} from './daily';
import type { Scenario } from '@/services/engine.service';

const scenario = (id: string, lockStatus: 'LOCKED' | 'AVAILABLE' = 'AVAILABLE'): Scenario =>
    ({ id, lockStatus } as Scenario);

describe('todayKey / ensureToday', () => {
    it('uses the local date', () => {
        expect(todayKey(new Date(2026, 6, 30, 23, 59))).toBe('2026-07-30');
        expect(todayKey(new Date(2026, 0, 5, 0, 0))).toBe('2026-01-05');
    });

    it('keeps a same-day ledger and rolls over stale ones', () => {
        const now = new Date(2026, 6, 30);
        const current = { date: '2026-07-30', missions: 2, correctDecisions: 4, sharpMissions: 1 };
        expect(ensureToday(current, now)).toBe(current);
        expect(ensureToday({ ...current, date: '2026-07-29' }, now)).toEqual(emptyLedger('2026-07-30'));
        expect(ensureToday(null, now)).toEqual(emptyLedger('2026-07-30'));
    });
});

describe('quests', () => {
    it('evaluates progress against targets', () => {
        const ledger = { date: 'd', missions: 1, correctDecisions: 3, sharpMissions: 0 };
        const byKey = Object.fromEntries(DAILY_QUESTS.map(q => [q.key, q]));
        expect(questDone(byKey['mission'], ledger)).toBe(true);
        expect(questDone(byKey['decisions'], ledger)).toBe(false);
        expect(allQuestsDone(ledger)).toBe(false);
        expect(allQuestsDone({ date: 'd', missions: 1, correctDecisions: 5, sharpMissions: 1 })).toBe(true);
    });
});

describe('dailyScenario', () => {
    const pool = [scenario('a'), scenario('b'), scenario('c'), scenario('d')];

    it('is deterministic for a given date and pool', () => {
        const first = dailyScenario(pool, '2026-07-30');
        expect(first).not.toBeNull();
        expect(dailyScenario(pool, '2026-07-30')).toBe(first);
    });

    it('varies across dates', () => {
        const picks = new Set(
            ['2026-07-28', '2026-07-29', '2026-07-30', '2026-07-31', '2026-08-01']
                .map(d => dailyScenario(pool, d)?.id)
        );
        expect(picks.size).toBeGreaterThan(1);
    });

    it('skips locked scenarios by walking forward', () => {
        const locked = pool.map((s, i) => (i === 0 ? s : scenario(s.id, 'LOCKED')));
        expect(dailyScenario(locked, '2026-07-30')?.id).toBe('a');
    });

    it('returns null when nothing is playable', () => {
        expect(dailyScenario([], '2026-07-30')).toBeNull();
        expect(dailyScenario([scenario('a', 'LOCKED')], '2026-07-30')).toBeNull();
    });
});
