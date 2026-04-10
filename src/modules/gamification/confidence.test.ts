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