import { describe, expect, it } from 'vitest';
import {
    APPEAL_STATUS_TONE,
    CASE_STATUS_TONE,
    FLAG_SEVERITY_TONE,
    REPORT_REASON_LABEL,
    SEVERITY_TONE,
    TARGET_TYPE_LABEL,
    actionLabel,
    flagColorClasses,
    formatDuration,
    riskBand,
} from './constants';

describe('formatDuration', () => {
    it('renders nothing for an absent duration', () => {
        expect(formatDuration(null)).toBe('—');
        expect(formatDuration(undefined)).toBe('—');
    });

    it('uses seconds under a minute', () => {
        expect(formatDuration(45)).toBe('45s');
    });

    it('uses minutes under an hour', () => {
        expect(formatDuration(600)).toBe('10m');
    });

    it('uses hours under a day', () => {
        expect(formatDuration(5400)).toBe('1.5h');
    });

    it('uses days beyond that', () => {
        expect(formatDuration(180_000)).toBe('2.1d');
    });

    it('handles zero without falling through to a dash', () => {
        expect(formatDuration(0)).toBe('0s');
    });
});

describe('riskBand', () => {
    it('reads a clean account as low risk', () => {
        expect(riskBand(0).label).toBe('Low risk');
    });

    it('escalates through the bands as the score rises', () => {
        expect(riskBand(20).label).toBe('Some history');
        expect(riskBand(50).label).toBe('Elevated risk');
        expect(riskBand(85).label).toBe('High risk');
    });

    it('places boundary values in the higher band', () => {
        expect(riskBand(15).label).toBe('Some history');
        expect(riskBand(40).label).toBe('Elevated risk');
        expect(riskBand(70).label).toBe('High risk');
    });

    it('supplies both a text and a bar colour, so risk is not colour-only', () => {
        const band = riskBand(90);
        expect(band.className).toBeTruthy();
        expect(band.barClassName).toBeTruthy();
    });
});

describe('tone maps', () => {
    it('covers every case status', () => {
        const statuses = [
            'OPEN',
            'ASSIGNED',
            'UNDER_REVIEW',
            'AWAITING_INFO',
            'ESCALATED',
            'DUPLICATE',
            'RESOLVED',
            'DISMISSED',
            'CLOSED',
        ] as const;

        for (const status of statuses) {
            expect(CASE_STATUS_TONE[status]).toBeDefined();
            expect(CASE_STATUS_TONE[status].label).toBeTruthy();
            expect(CASE_STATUS_TONE[status].hex).toMatch(/^#[0-9a-f]{6}$/i);
        }
    });

    it('gives every status class a dark-mode counterpart', () => {
        // A tone that only styles light mode renders as an unreadable badge
        // once the viewer switches theme.
        for (const tone of Object.values(CASE_STATUS_TONE)) {
            expect(tone.className).toContain('dark:');
        }
        for (const tone of Object.values(SEVERITY_TONE)) {
            expect(tone.className).toContain('dark:');
        }
    });

    it('covers every severity and flag severity', () => {
        for (const severity of ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const) {
            expect(SEVERITY_TONE[severity]).toBeDefined();
        }
        for (const severity of [
            'INFO',
            'LOW',
            'MEDIUM',
            'HIGH',
            'CRITICAL',
        ] as const) {
            expect(FLAG_SEVERITY_TONE[severity]).toBeDefined();
        }
    });

    it('covers every appeal status', () => {
        for (const status of [
            'SUBMITTED',
            'UNDER_REVIEW',
            'ACCEPTED',
            'REJECTED',
            'CLOSED',
        ] as const) {
            expect(APPEAL_STATUS_TONE[status]).toBeDefined();
        }
    });
});

describe('flagColorClasses', () => {
    it('maps a known colour name to theme-aware classes', () => {
        const classes = flagColorClasses('red');
        expect(classes).toContain('bg-red-100');
        expect(classes).toContain('dark:');
    });

    it('falls back to slate for an unknown colour rather than rendering bare', () => {
        // Administrators can type any colour name into the catalogue; an
        // unrecognised one must still produce a legible chip.
        expect(flagColorClasses('chartreuse')).toBe(flagColorClasses('slate'));
        expect(flagColorClasses(undefined)).toBe(flagColorClasses('slate'));
    });
});

describe('actionLabel', () => {
    it('renders known actions in plain language', () => {
        expect(actionLabel('USER_SUSPENDED')).toBe('User suspended');
        expect(actionLabel('CONTENT_HIDDEN')).toBe('Content hidden');
        expect(actionLabel('APPEAL_ACCEPTED')).toBe('Appeal upheld');
    });

    it('degrades an unknown action to readable text instead of SHOUTING', () => {
        expect(actionLabel('SOME_NEW_ACTION')).toBe('some new action');
    });
});

describe('label maps', () => {
    it('names every target type', () => {
        for (const type of [
            'SCENARIO',
            'SCENE',
            'COMMENT',
            'DISCUSSION',
            'USER_PROFILE',
            'UPLOADED_IMAGE',
            'UPLOADED_VIDEO',
            'EXTERNAL_LINK',
            'CROWDSOURCE_REPORT',
            'CAPTURED_CONTENT',
        ] as const) {
            expect(TARGET_TYPE_LABEL[type]).toBeTruthy();
        }
    });

    it('names every report reason, including the ones added for moderation', () => {
        for (const reason of [
            'SCAM',
            'HATE_SPEECH',
            'VIOLENCE',
            'FALSE_INFO',
            'OTHER',
            'SPAM',
            'HARASSMENT',
            'GRAPHIC_CONTENT',
            'IMPERSONATION',
            'COPYRIGHT',
            'UNSAFE_LINK',
            'LOW_QUALITY',
            'DUPLICATE',
            'EDUCATIONAL_CONCERN',
        ] as const) {
            expect(REPORT_REASON_LABEL[reason]).toBeTruthy();
        }
    });
});
