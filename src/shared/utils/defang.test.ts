import { describe, expect, it } from 'vitest';
import { containsUrl, defangText, defangUrl } from './defang';

/**
 * Reported URLs point at the very content being reported, so the guarantee
 * under test is that nothing survives defanging in a state a browser would
 * treat as a link.
 */
describe('defangUrl', () => {
    it('neutralises the scheme and the host', () => {
        expect(defangUrl('https://evil.com/free-crypto')).toBe('hxxps://evil[.]com/free-crypto');
        expect(defangUrl('http://phish.example.co.uk')).toBe('hxxp://phish[.]example[.]co[.]uk');
    });

    it('leaves the path, query and fragment readable', () => {
        expect(defangUrl('https://evil.com/a/b?ref=x&id=2#top')).toBe(
            'hxxps://evil[.]com/a/b?ref=x&id=2#top',
        );
    });

    it('brackets dots in the host only, leaving the path readable', () => {
        expect(defangUrl('https://evil.com/download/setup.exe')).toBe(
            'hxxps://evil[.]com/download/setup.exe',
        );
    });

    it('handles a bare host with no scheme', () => {
        expect(defangUrl('evil.com/path')).toBe('evil[.]com/path');
    });

    it('handles subdomains and ports', () => {
        expect(defangUrl('https://login.secure.evil.com:8080/x')).toBe(
            'hxxps://login[.]secure[.]evil[.]com:8080/x',
        );
    });

    it('never produces a string starting with a usable scheme', () => {
        for (const url of [
            'https://evil.com',
            'HTTP://EVIL.COM',
            'https://evil.com/#/x',
        ]) {
            expect(defangUrl(url).toLowerCase()).not.toMatch(/^https?:\/\//);
        }
    });

    it('returns an empty string for empty input', () => {
        expect(defangUrl(undefined)).toBe('');
        expect(defangUrl('   ')).toBe('');
    });
});

describe('defangText', () => {
    it('defangs a link pasted into a report description', () => {
        expect(defangText('Someone sent me https://scam.example/win to claim a prize.')).toBe(
            'Someone sent me hxxps://scam[.]example/win to claim a prize.',
        );
    });

    it('defangs bare www hosts', () => {
        expect(defangText('Check www.scam.example please')).toBe(
            'Check www[.]scam[.]example please',
        );
    });

    it('defangs every link in the text, not just the first', () => {
        const result = defangText('First https://a.example and then https://b.example');

        expect(result).toBe('First hxxps://a[.]example and then hxxps://b[.]example');
        expect(result).not.toContain('https://');
    });

    it('keeps sentence punctuation outside the link', () => {
        expect(defangText('It links to https://scam.example.')).toBe(
            'It links to hxxps://scam[.]example.',
        );
    });

    it('leaves ordinary prose untouched', () => {
        // A sentence boundary with no space must not be mistaken for a domain.
        const prose = 'No medical evidence.The post claims otherwise. Reported by a member.';
        expect(defangText(prose)).toBe(prose);
    });

    it('handles empty input', () => {
        expect(defangText(undefined)).toBe('');
        expect(defangText('')).toBe('');
    });
});

describe('containsUrl', () => {
    it('detects schemed and www links', () => {
        expect(containsUrl('go to https://x.example')).toBe(true);
        expect(containsUrl('go to www.x.example')).toBe(true);
    });

    it('is false for plain prose', () => {
        expect(containsUrl('no links here at all')).toBe(false);
        expect(containsUrl(undefined)).toBe(false);
    });

    it('is repeatable despite the shared global regex', () => {
        // A global regex keeps lastIndex between calls; this would flap if the
        // implementation did not reset it.
        expect(containsUrl('https://x.example')).toBe(true);
        expect(containsUrl('https://x.example')).toBe(true);
    });
});
