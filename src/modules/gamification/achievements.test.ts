import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS, evaluateAll, unlockedCount, ACHIEVEMENT_CATEGORIES } from './achievements';
import type { AchievementContext } from './achievements';
import { EMPTY_CALIBRATION } from './confidence';
import { MASTERY_TIERS } from './mastery';
import { SKILLS } from './skills';

const ctx = (over: Partial<AchievementContext> = {}): AchievementContext => ({
    missionsCompleted: 0,