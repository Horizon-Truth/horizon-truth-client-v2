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