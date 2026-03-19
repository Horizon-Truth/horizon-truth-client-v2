/**
 * Adaptive mission recommendation (Phase 9).
 *
 * Picks the next best scenario for a player from data that already exists:
 * the scenario's authored `psychologicalTrigger`/`theme` resolves to a
 * manipulation technique (learning-content.ts) and thus to a trainable skill
 * (skills.ts); the player's skill book and per-scenario mastery records say
 * where practice is most needed.
 *
 * Priorities, in order:
 *   1. Resume an in-progress mission.
 *   2. Train the player's weakest skill.
 *   3. Cover new ground (never-completed scenarios, low mastery tiers).
 *   4. Match difficulty to the player's demonstrated accuracy.
 */

import type { Scenario } from '@/services/engine.service';
import { matchTechnique } from './learning-content';
import { SKILLS, skillForTechnique, weakestSkill } from './skills';
import type { Skill, SkillProgress } from './skills';
import { masteryFor } from './mastery';

/** The skill a scenario trains, resolved from its authored metadata. Null when unknown. */
export function scenarioSkill(scenario: Pick<Scenario, 'psychologicalTrigger' | 'theme'>): Skill | null {
    const technique = matchTechnique(scenario.psychologicalTrigger) ?? matchTechnique(scenario.theme);