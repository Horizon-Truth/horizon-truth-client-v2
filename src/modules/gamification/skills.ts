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
    /** Tailwind text color class for accents. */
    color: string;
    /** Tailwind bg class for progress bars. */
    bar: string;
    emoji: string;
}

export const SKILLS: Skill[] = [
    {
        key: 'source-verification',
        name: 'Source Verification',
        description: 'Checking who is speaking — real experts, real outlets, real accounts.',
        color: 'text-blue-600 dark:text-blue-400',
        bar: 'bg-blue-500',