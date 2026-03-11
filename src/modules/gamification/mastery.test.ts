import { describe, it, expect } from 'vitest';
import { masteryFor, nextMasteryGoal } from './mastery';

const record = (over: Partial<Parameters<typeof masteryFor>[0] & object> = {}) => ({
    isCompleted: true,