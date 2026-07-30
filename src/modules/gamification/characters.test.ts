import { describe, it, expect } from 'vitest';
import { CHARACTERS, castState, DISPOSITIONS, skillsWithoutCharacter } from './characters';
import { SKILLS } from './skills';

describe('cast integrity', () => {
    it('has unique keys and lines for every disposition', () => {
        const keys = CHARACTERS.map(c => c.key);
        expect(new Set(keys).size).toBe(keys.length);
        for (const character of CHARACTERS) {
            for (const disposition of Object.keys(DISPOSITIONS)) {
                expect(character.lines[disposition as keyof typeof character.lines]).toBeTruthy();
            }
        }
    });

    it('only references real skills', () => {
        const skillKeys = new Set(SKILLS.map(s => s.key));
        for (const character of CHARACTERS) {
            if (character.skillKey) expect(skillKeys.has(character.skillKey)).toBe(true);
        }
        // The helper is the documented way to see which skills still need a face.
        expect(Array.isArray(skillsWithoutCharacter())).toBe(true);
    });
});

describe('castState', () => {
    it('stays neutral until enough decisions exist', () => {
        const states = castState({ 'source-verification': { xp: 24, correct: 2, total: 2 } }, null, 2);
        expect(states.every(s => s.disposition === 'neutral')).toBe(true);
    });

    it('maps accuracy bands to dispositions', () => {
        const at = (correct: number, total: number) =>
            castState({ 'source-verification': { xp: 0, correct, total } }, null, 0)
                .find(s => s.character.skillKey === 'source-verification')!.disposition;
        expect(at(10, 10)).toBe('devoted');   // 100%
        expect(at(8, 10)).toBe('warm');       // 80%
        expect(at(6, 10)).toBe('neutral');    // 60%
        expect(at(2, 10)).toBe('wary');       // 20%
    });

    it('drives skill-less characters from overall conduct', () => {
        const neighbour = castState({}, 95, 20).find(s => s.character.skillKey === null)!;
        expect(neighbour.disposition).toBe('devoted');
        expect(neighbour.accuracy).toBe(95);
        expect(neighbour.line).toBe(neighbour.character.lines.devoted);
    });

    it('returns one state per character with its matching line', () => {
        const states = castState({}, null, 0);
        expect(states).toHaveLength(CHARACTERS.length);
        for (const state of states) {
            expect(state.line).toBe(state.character.lines[state.disposition]);
        }
    });
});
