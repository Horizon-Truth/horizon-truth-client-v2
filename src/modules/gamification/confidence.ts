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