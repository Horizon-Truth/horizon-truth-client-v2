/**
 * Client-side merge for the server-synced learning ledgers (skill book +
 * confidence calibration). Mirrors backend/src/players/learning-profile.util.ts:
 * counters are monotonic, so divergent copies reconcile via element-wise max —
 * progress can never be lost, whichever side is stale.
 */

import type { SkillProgress } from './skills';
import { EMPTY_CALIBRATION } from './confidence';
import type { CalibrationLedger, CalibrationBucket } from './confidence';

const num = (value: unknown): number =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;

export function mergeSkillBooks(
    local: Record<string, SkillProgress> = {},
    remote: Record<string, Partial<SkillProgress>> = {},
): Record<string, SkillProgress> {
    const merged: Record<string, SkillProgress> = {};
    for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
        const l = local[key] ?? { xp: 0, correct: 0, total: 0 };
        const r = remote[key] ?? {};
        merged[key] = {
            xp: Math.max(num(l.xp), num(r.xp)),
            correct: Math.max(num(l.correct), num(r.correct)),
            total: Math.max(num(l.total), num(r.total)),
        };
    }
    return merged;
}

export function mergeCalibrations(
    local: CalibrationLedger,
    remote: Record<string, Partial<CalibrationBucket>> = {},
): CalibrationLedger {
    const merged = { ...EMPTY_CALIBRATION, ...local };
    for (const key of Object.keys(merged) as (keyof CalibrationLedger)[]) {
        const l = local[key] ?? { correct: 0, total: 0 };
        const r = remote[key] ?? {};
        merged[key] = {
            correct: Math.max(num(l.correct), num(r.correct)),
            total: Math.max(num(l.total), num(r.total)),
        };
    }
    return merged;
}
