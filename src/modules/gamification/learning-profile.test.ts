import { describe, it, expect } from 'vitest';
import { mergeSkillBooks, mergeCalibrations } from './learning-profile';
import { EMPTY_CALIBRATION } from './confidence';

describe('mergeSkillBooks', () => {
    it('returns an empty book when both sides are empty', () => {
        expect(mergeSkillBooks({}, {})).toEqual({});
    });

    it('defaults both sides when called with no arguments', () => {
        expect(mergeSkillBooks()).toEqual({});
    });

    it('keeps a local-only skill', () => {
        const local = { sourcing: { xp: 24, correct: 2, total: 3 } };

        expect(mergeSkillBooks(local, {})).toEqual(local);
    });

    it('adopts a remote-only skill', () => {
        const remote = { sourcing: { xp: 12, correct: 1, total: 1 } };

        expect(mergeSkillBooks({}, remote)).toEqual({
            sourcing: { xp: 12, correct: 1, total: 1 },
        });
    });

    it('takes the element-wise max so progress is never lost', () => {
        const local = { sourcing: { xp: 36, correct: 1, total: 5 } };
        const remote = { sourcing: { xp: 12, correct: 4, total: 4 } };

        expect(mergeSkillBooks(local, remote)).toEqual({
            sourcing: { xp: 36, correct: 4, total: 5 },
        });
    });

    it('unions keys from both sides', () => {
        const merged = mergeSkillBooks(
            { sourcing: { xp: 10, correct: 1, total: 1 } },
            { framing: { xp: 20, correct: 2, total: 2 } },
        );

        expect(Object.keys(merged).sort()).toEqual(['framing', 'sourcing']);
    });

    it('fills missing remote fields from zero rather than producing NaN', () => {
        const merged = mergeSkillBooks(
            { sourcing: { xp: 5, correct: 0, total: 1 } },
            { sourcing: { xp: 9 } },
        );

        expect(merged.sourcing).toEqual({ xp: 9, correct: 0, total: 1 });
    });

    it.each([
        ['negative', -4],
        ['NaN', Number.NaN],
        ['Infinity', Number.POSITIVE_INFINITY],
        ['a string', '30' as unknown as number],
        ['null', null as unknown as number],
    ])('coerces %s counters to 0', (_label, bad) => {
        const merged = mergeSkillBooks(
            { sourcing: { xp: bad, correct: 0, total: 0 } },
            {},
        );

        expect(merged.sourcing.xp).toBe(0);
    });

    it('floors fractional counters', () => {
        const merged = mergeSkillBooks(
            { sourcing: { xp: 12.9, correct: 0, total: 0 } },
            {},
        );

        expect(merged.sourcing.xp).toBe(12);
    });
});

describe('mergeCalibrations', () => {
    it('returns the empty ledger when both sides are empty', () => {
        expect(mergeCalibrations(EMPTY_CALIBRATION, {})).toEqual(EMPTY_CALIBRATION);
    });

    it('defaults the remote side when omitted', () => {
        expect(mergeCalibrations(EMPTY_CALIBRATION)).toEqual(EMPTY_CALIBRATION);
    });

    it('always returns all three confidence buckets', () => {
        const merged = mergeCalibrations(EMPTY_CALIBRATION, {});

        expect(Object.keys(merged).sort()).toEqual(['certain', 'guessing', 'somewhat']);
    });

    it('takes the element-wise max per bucket', () => {
        const local = {
            ...EMPTY_CALIBRATION,
            certain: { correct: 5, total: 6 },
        };
        const remote = { certain: { correct: 2, total: 9 } };

        expect(mergeCalibrations(local, remote).certain).toEqual({
            correct: 5,
            total: 9,
        });
    });

    it('adopts remote values for buckets the local ledger has not touched', () => {
        const merged = mergeCalibrations(EMPTY_CALIBRATION, {
            guessing: { correct: 1, total: 4 },
        });

        expect(merged.guessing).toEqual({ correct: 1, total: 4 });
        expect(merged.certain).toEqual({ correct: 0, total: 0 });
    });

    it('ignores an unknown remote bucket rather than adding it', () => {
        const merged = mergeCalibrations(EMPTY_CALIBRATION, {
            bogus: { correct: 9, total: 9 },
        } as never);

        expect(merged).not.toHaveProperty('bogus');
    });

    it('coerces invalid remote counters to 0', () => {
        const merged = mergeCalibrations(EMPTY_CALIBRATION, {
            somewhat: { correct: -3, total: Number.NaN },
        });

        expect(merged.somewhat).toEqual({ correct: 0, total: 0 });
    });

    it('does not mutate the ledger it was given', () => {
        const local = { ...EMPTY_CALIBRATION, certain: { correct: 1, total: 1 } };
        const snapshot = JSON.parse(JSON.stringify(local));

        mergeCalibrations(local, { certain: { correct: 8, total: 8 } });

        expect(local).toEqual(snapshot);
    });
});
