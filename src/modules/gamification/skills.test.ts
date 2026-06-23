import { describe, it, expect } from 'vitest';
import {
    SKILLS,
    skillForTechnique,
    skillLevel,
    skillLevelProgress,
    skillAccuracy,
    weakestSkill,
} from './skills';
import { TECHNIQUES } from './learning-content';

describe('skillForTechnique', () => {
    it('maps every known technique to a defined skill', () => {
        for (const technique of TECHNIQUES) {
            const skill = skillForTechnique(technique.key);
            expect(SKILLS.map(s => s.key)).toContain(skill.key);
        }
    });

    it('falls back to critical thinking for unknown or missing techniques', () => {
        expect(skillForTechnique(null).key).toBe('critical-thinking');
        expect(skillForTechnique('made-up').key).toBe('critical-thinking');
    });

    it('maps representative techniques sensibly', () => {
        expect(skillForTechnique('authority').key).toBe('source-verification');
        expect(skillForTechnique('deepfake').key).toBe('media-analysis');
        expect(skillForTechnique('statistics').key).toBe('data-literacy');
        expect(skillForTechnique('social-proof').key).toBe('network-awareness');
        expect(skillForTechnique('emotional').key).toBe('emotional-defense');
    });
});

describe('skill level math', () => {
    it('starts at level 1 and grows monotonically to a cap of 10', () => {
        expect(skillLevel(0)).toBe(1);
        expect(skillLevel(49)).toBe(1);
        expect(skillLevel(50)).toBe(2);
        expect(skillLevel(1_000_000)).toBe(10);
    });

    it('reports progress within a level between 0 and 100', () => {
        expect(skillLevelProgress(0)).toBe(0);
        expect(skillLevelProgress(25)).toBe(50);
        expect(skillLevelProgress(1_000_000)).toBe(100);
    });
});

describe('skillAccuracy / weakestSkill', () => {
    it('returns null accuracy with no attempts', () => {
        expect(skillAccuracy({ xp: 0, correct: 0, total: 0 })).toBeNull();
    });

    it('needs at least 3 attempts before naming a focus area', () => {
        expect(weakestSkill({ 'data-literacy': { xp: 10, correct: 0, total: 2 } })).toBeNull();
    });

    it('picks the lowest-accuracy skill below the 80% bar', () => {
        const focus = weakestSkill({
            'data-literacy': { xp: 30, correct: 1, total: 4 },
            'source-verification': { xp: 60, correct: 5, total: 5 },
        });
        expect(focus?.key).toBe('data-literacy');
    });

    it('names no focus area when everything is strong', () => {
        expect(weakestSkill({
            'source-verification': { xp: 60, correct: 5, total: 5 },
        })).toBeNull();
    });
});
