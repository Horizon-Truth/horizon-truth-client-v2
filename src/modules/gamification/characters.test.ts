import { describe, it, expect } from 'vitest';
import { CHARACTERS, castState, DISPOSITIONS, skillsWithoutCharacter } from './characters';
import { SKILLS } from './skills';

describe('cast integrity', () => {
    it('has unique keys and lines for every disposition', () => {