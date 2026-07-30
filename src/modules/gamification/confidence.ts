/**
 * Confidence tracking (Phase 15).
 *
 * Before each decision is submitted the player states how sure they are.
 * The value flows into the existing telemetry field `decision_confidence_level`
 * and into a persisted calibration ledger (confidence vs. actual accuracy),
 * which powers overconfidence coaching in learning moments and on the hub.
 */

/** Matches the 1–5 scale of telemetry's decision_confidence_level. */
export type ConfidenceLevel = 1 | 3 | 5;

export interface ConfidenceOption {
    level: ConfidenceLevel;
    key: 'guessing' | 'somewhat' | 'certain';
    label: string;
    hint: string;
    emoji: string;
}

export const CONFIDENCE_OPTIONS: ConfidenceOption[] = [
    { level: 1, key: 'guessing', label: 'Guessing', hint: "I'm not sure — going with instinct", emoji: '🎲' },
    { level: 3, key: 'somewhat', label: 'Somewhat sure', hint: 'I have a reason, but some doubt', emoji: '🤔' },
    { level: 5, key: 'certain', label: 'Certain', hint: "I'd stake my reputation on it", emoji: '🎯' },
];

export interface CalibrationBucket {
    correct: number;
    total: number;
}

export type CalibrationLedger = Record<ConfidenceOption['key'], CalibrationBucket>;

export const EMPTY_CALIBRATION: CalibrationLedger = {
    guessing: { correct: 0, total: 0 },
    somewhat: { correct: 0, total: 0 },
    certain: { correct: 0, total: 0 },
};

export function confidenceKeyForLevel(level: ConfidenceLevel): ConfidenceOption['key'] {
    return CONFIDENCE_OPTIONS.find(o => o.level === level)?.key ?? 'somewhat';
}

export function bucketAccuracy(bucket: CalibrationBucket): number | null {
    if (!bucket.total) return null;
    return Math.round((bucket.correct / bucket.total) * 100);
}

/**
 * One-line coaching for the moment right after a decision resolves,
 * teaching calibration exactly when it's felt.
 */
export function calibrationMoment(level: ConfidenceLevel, correct: boolean): string | null {
    if (level === 5 && !correct) {
        return 'You were certain — and it was wrong. That feeling of certainty is exactly what misinformation is engineered to produce. Treat it as a cue to verify, not a verdict.';
    }
    if (level === 1 && correct) {
        return 'Right answer, but you were guessing. Next time, try to name the clue that makes it right — that turns luck into a skill.';
    }
    if (level === 5 && correct) {
        return 'Certain and correct — that\'s calibration. Knowing when to trust your judgment matters as much as the judgment itself.';
    }
    return null;
}

/**
 * Hub-level insight once enough certain-decisions have accumulated.
 * Returns null until there's a meaningful sample.
 */
export function calibrationInsight(ledger: CalibrationLedger): { tone: 'warn' | 'good'; text: string } | null {
    const certain = ledger.certain;
    if (certain.total < 5) return null;
    const acc = bucketAccuracy(certain)!;
    if (acc < 70) {
        return {
            tone: 'warn',
            text: `When you feel certain, you're right ${acc}% of the time. Overconfidence is the #1 opening misinformation exploits — slow down on the "sure things".`,
        };
    }
    return {
        tone: 'good',
        text: `When you feel certain, you're right ${acc}% of the time — well calibrated. Keep reserving certainty for claims you've actually verified.`,
    };
}
