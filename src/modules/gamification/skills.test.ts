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