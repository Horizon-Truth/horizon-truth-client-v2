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