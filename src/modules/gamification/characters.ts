/**
 * Recurring characters (Phase 11).
 *
 * The cast gives the player's statistics a human face. Each character cares
 * about one specific competency (or about the player's overall conduct), and
 * their disposition is *derived* from the player's real record in that area —
 * never from separate hidden state. That keeps relationships honest: a
 * character warms up exactly because the player demonstrably improved.
 *
 * Scenario writers can reference these characters by key in scene content so
 * the same faces recur across a campaign.
 */

import { SKILLS, skillAccuracy } from './skills';
import type { SkillProgress } from './skills';

export type Disposition = 'wary' | 'neutral' | 'warm' | 'devoted';
