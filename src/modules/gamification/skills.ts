/**
 * Measurable media-literacy competencies (Phase 7 — skill graph).
 *
 * Every decision the player makes is attributed to one skill via the
 * manipulation-technique key of the chosen option (see learning-content.ts).
 * Skill progress is tracked client-side in the game store; the shapes here
 * are designed to serialize directly if/when a backend table is added.
 */

export interface Skill {
    key: string;
    name: string;
    /** What this competency means, shown in the skills panel. */
    description: string;