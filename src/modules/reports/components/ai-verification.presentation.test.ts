import { describe, expect, it } from 'vitest';
import {
    formatRelevance,
    getConfidenceLabel,
    getRenderableSources,
    getSourceDomain,
    getVerdictPresentation,
    getVerificationView,
    isSafeExternalUrl,
    toExcerpt,
} from './ai-verification.presentation';
import type { AiVerification } from '@/services/ai-verification.service';

/**
 * These rules decide what a reader is told about a machine assessment, so they
 * are checked for accessibility (never colour alone), for not overstating the
 * result, and for refusing unsafe links.
 */
describe('getVerdictPresentation', () => {
    it('labels each supported verdict in text, not only colour', () => {
        expect(getVerdictPresentation('TRUE').label).toBe('True');
        expect(getVerdictPresentation('FALSE').label).toBe('False');
        expect(getVerdictPresentation('MIXED').label).toBe('Mixed');
        expect(getVerdictPresentation('UNVERIFIED').label).toBe('Unverified');
    });

    it('gives each verdict a distinct tone', () => {
        expect(getVerdictPresentation('TRUE').tone).toBe('positive');
        expect(getVerdictPresentation('FALSE').tone).toBe('negative');
        expect(getVerdictPresentation('MIXED').tone).toBe('caution');
        expect(getVerdictPresentation('UNVERIFIED').tone).toBe('neutral');
    });

    it('never presents a verdict as absolute truth', () => {
        expect(getVerdictPresentation('TRUE').meaning).toMatch(/^The AI found/);
        expect(getVerdictPresentation('TRUE').label).not.toMatch(/truth/i);
    });

    it('renders an unknown verdict neutrally instead of forcing it to TRUE/FALSE', () => {
        const presentation = getVerdictPresentation('SATIRE');

        expect(presentation.label).toBe('Satire');
        expect(presentation.tone).toBe('neutral');
    });

    it('falls back to Unverified for a missing verdict', () => {
        expect(getVerdictPresentation(undefined).label).toBe('Unverified');
        expect(getVerdictPresentation('').label).toBe('Unverified');
    });
});

describe('getConfidenceLabel', () => {
    it('normalises the API label', () => {
        expect(getConfidenceLabel('HIGH')).toBe('High');
        expect(getConfidenceLabel('medium')).toBe('Medium');
    });

    it('returns null when absent so no confidence is implied', () => {
        expect(getConfidenceLabel(undefined)).toBeNull();
        expect(getConfidenceLabel('  ')).toBeNull();
    });
});

describe('isSafeExternalUrl', () => {
    it('accepts only http(s)', () => {
        expect(isSafeExternalUrl('https://example.com')).toBe(true);
        expect(isSafeExternalUrl('http://example.com')).toBe(true);
    });

    it('rejects script and data URLs from the AI response', () => {
        expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
        expect(isSafeExternalUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
        expect(isSafeExternalUrl('not a url')).toBe(false);
        expect(isSafeExternalUrl(undefined)).toBe(false);
    });
});

describe('getSourceDomain', () => {
    it('shows the site name without the www prefix', () => {
        expect(getSourceDomain('https://www.aap.org/en/news-room/x')).toBe('aap.org');
    });

    it('returns an empty string for unparseable input', () => {
        expect(getSourceDomain('garbage')).toBe('');
    });
});

describe('formatRelevance', () => {
    it('renders a 0–1 score as a percentage', () => {
        expect(formatRelevance(0.74004334)).toBe('74%');
    });

    it('returns null when the API gave no score, rather than inventing one', () => {
        expect(formatRelevance(undefined)).toBeNull();
        expect(formatRelevance(Number.NaN)).toBeNull();
    });
});

describe('toExcerpt', () => {
    it('truncates long source content on a word boundary', () => {
        const excerpt = toExcerpt('word '.repeat(200), 50);

        expect(excerpt!.length).toBeLessThanOrEqual(51);
        expect(excerpt!.endsWith('…')).toBe(true);
    });

    it('leaves short content intact', () => {
        expect(toExcerpt('A short excerpt.')).toBe('A short excerpt.');
    });

    it('returns null for empty content', () => {
        expect(toExcerpt(undefined)).toBeNull();
        expect(toExcerpt('   ')).toBeNull();
    });
});

describe('getRenderableSources', () => {
    it('drops sources whose URL is unsafe', () => {
        const verification = {
            sources: [
                { title: 'Good', url: 'https://example.com/a' },
                { title: 'Bad', url: 'javascript:alert(1)' },
            ],
        } as AiVerification;

        expect(getRenderableSources(verification)).toHaveLength(1);
    });

    it('handles a verification with no sources field', () => {
        expect(getRenderableSources({} as AiVerification)).toEqual([]);
        expect(getRenderableSources(null)).toEqual([]);
    });
});

describe('getVerificationView', () => {
    it('treats a missing record as "never analysed"', () => {
        expect(getVerificationView(null)).toBe('none');
        expect(getVerificationView(undefined)).toBe('none');
    });

    it('keeps in-progress attempts in the loading view', () => {
        expect(getVerificationView({ status: 'PENDING' } as AiVerification)).toBe('loading');
        expect(getVerificationView({ status: 'PROCESSING' } as AiVerification)).toBe('loading');
    });

    it('separates completed from failed', () => {
        expect(getVerificationView({ status: 'COMPLETED' } as AiVerification)).toBe('result');
        expect(getVerificationView({ status: 'FAILED' } as AiVerification)).toBe('failed');
    });
});
