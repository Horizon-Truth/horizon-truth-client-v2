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