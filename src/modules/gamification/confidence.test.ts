import { describe, it, expect } from 'vitest';
import {
    CONFIDENCE_OPTIONS,
    confidenceKeyForLevel,
    bucketAccuracy,
    calibrationMoment,
    calibrationInsight,
    EMPTY_CALIBRATION,
} from './confidence';

describe('confidence options', () => {
    it('covers the 1–5 telemetry scale endpoints', () => {
        expect(CONFIDENCE_OPTIONS.map(o => o.level)).toEqual([1, 3, 5]);
    });

    it('maps levels back to bucket keys', () => {
        expect(confidenceKeyForLevel(1)).toBe('guessing');
        expect(confidenceKeyForLevel(3)).toBe('somewhat');
        expect(confidenceKeyForLevel(5)).toBe('certain');
    });
});

describe('calibrationMoment', () => {
    it('coaches on overconfident misses and lucky guesses', () => {
        expect(calibrationMoment(5, false)).toMatch(/certain/i);
        expect(calibrationMoment(1, true)).toMatch(/guessing/i);
        expect(calibrationMoment(5, true)).toMatch(/calibration/i);
        expect(calibrationMoment(3, true)).toBeNull();
        expect(calibrationMoment(3, false)).toBeNull();
    });
});

describe('calibrationInsight', () => {
    it('stays silent until 5 certain decisions accumulate', () => {
        expect(calibrationInsight(EMPTY_CALIBRATION)).toBeNull();
        expect(calibrationInsight({ ...EMPTY_CALIBRATION, certain: { correct: 3, total: 4 } })).toBeNull();
    });

    it('warns on overconfidence and affirms good calibration', () => {
        expect(calibrationInsight({ ...EMPTY_CALIBRATION, certain: { correct: 2, total: 6 } })?.tone).toBe('warn');
        expect(calibrationInsight({ ...EMPTY_CALIBRATION, certain: { correct: 6, total: 6 } })?.tone).toBe('good');
    });
});

describe('bucketAccuracy', () => {
    it('handles empty buckets and rounds', () => {
        expect(bucketAccuracy({ correct: 0, total: 0 })).toBeNull();
        expect(bucketAccuracy({ correct: 2, total: 3 })).toBe(67);
    });
});
