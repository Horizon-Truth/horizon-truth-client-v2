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
    return technique ? skillForTechnique(technique.key) : null;
}

/** Overall decision accuracy (0–100) across the whole skill book, or null with no data. */
export function overallAccuracy(book: Record<string, SkillProgress>): number | null {
    let correct = 0;
    let total = 0;
    for (const skill of SKILLS) {
        const p = book[skill.key];
        if (p) {
            correct += p.correct;
            total += p.total;
        }
    }
    return total > 0 ? Math.round((correct / total) * 100) : null;
}

export interface Recommendation {
    scenario: Scenario;
    /** Short human-readable reasons, strongest first (max ~3 shown in UI). */
    reasons: string[];
    /** True when this is a resume of an in-progress mission. */
    resume: boolean;
}

const MASTERY_GAP_SCORE: Record<string, number> = {
    bronze: 20,
    silver: 15,
    gold: 10,
    platinum: 5,
    master: 0,
    legendary: 0,
};

export function recommendScenario(
    scenarios: Scenario[],
    skillBook: Record<string, SkillProgress>,
): Recommendation | null {
    const playable = scenarios.filter(s => s.lockStatus !== 'LOCKED');
    if (playable.length === 0) return null;

    // 1. An unfinished mission always comes first.
    const inProgress = playable.find(s => s.activeProgressId);
    if (inProgress) {
        return {
            scenario: inProgress,
            reasons: ['Pick up where you left off'],
            resume: true,
        };
    }

    const focus = weakestSkill(skillBook);
    const accuracy = overallAccuracy(skillBook);
    const preferredDifficulty = accuracy === null ? null : accuracy >= 85 ? 'HARD' : accuracy >= 70 ? 'MEDIUM' : 'EASY';

    let best: { scenario: Scenario; score: number; reasons: string[] } | null = null;

    for (const scenario of playable) {
        const record = scenario.userRecord
            ? { ...scenario.userRecord, totalPossibleScore: scenario.totalPossibleScore }
            : null;
        const mastery = masteryFor(record);

        // Nothing left to gain from fully mastered scenarios.
        if (mastery?.key === 'legendary') continue;

        let score = 0;
        const reasons: string[] = [];

        const trains = scenarioSkill(scenario);
        if (focus && trains && trains.key === focus.key) {
            score += 50;
            reasons.push(`Trains your focus area: ${trains.emoji} ${trains.name}`);
        }

        if (!record?.isCompleted) {
            score += 25;
            reasons.push((scenario.userRecord?.attempts ?? 0) > 0 ? 'Unfinished business — you haven\'t beaten this one yet' : 'New territory for you');
        } else if (mastery) {
            score += MASTERY_GAP_SCORE[mastery.key] ?? 0;
            if ((MASTERY_GAP_SCORE[mastery.key] ?? 0) > 0) {
                reasons.push(`Room to grow past ${mastery.emoji} ${mastery.name}`);
            }
        }

        if (preferredDifficulty && scenario.difficulty === preferredDifficulty) {
            score += 10;
            reasons.push(`Matched to your current level (${scenario.difficulty.toLowerCase()})`);
        }

        // Stable ordering: earlier scenarios win ties so the learning path
        // still reads front-to-back.
        const order = scenario.order ?? 0;
        if (!best || score > best.score || (score === best.score && order < (best.scenario.order ?? 0))) {
            best = { scenario, score, reasons };
        }
    }

    if (!best || best.score <= 0) return null;
    return { scenario: best.scenario, reasons: best.reasons, resume: false };
}
