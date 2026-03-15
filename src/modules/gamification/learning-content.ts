/**
 * Curated educational content for learning moments.
 *
 * Scenario-authored fields (psychologicalTrap, preventionLesson, …) always
 * take priority; this library provides the technique explanations and
 * verification tips that turn a right/wrong verdict into a lesson.
 */

export interface ManipulationTechnique {
    key: string;
    title: string;
    description: string;
    howToSpot: string;
    example: string;
}

/** Known manipulation techniques, keyed loosely so scenario-provided trap
 *  strings can be matched against them. */
export const TECHNIQUES: ManipulationTechnique[] = [
    {
        key: 'emotional',
        title: 'Emotional Manipulation',
        description: 'Content engineered to trigger fear, anger, or outrage. Strong emotions switch off critical thinking and make you share before you verify.',
        howToSpot: 'Notice your own reaction. If a post makes you furious or terrified instantly, that reaction may be the product — pause before acting.',
        example: '“SHOCKING: They don\'t want you to see this!” headlines that promise outrage but never cite a source.',
    },
    {
        key: 'urgency',
        title: 'False Urgency',
        description: 'Pressure to act NOW — “share before it gets deleted!” Urgency prevents verification, which is exactly the point.',
        howToSpot: 'Real information survives scrutiny. Anything that punishes you for taking 5 minutes to check is suspect.',
        example: 'Chain messages claiming a law changes “at midnight tonight” that have circulated for years.',
    },
    {
        key: 'authority',
        title: 'Fake Authority',
        description: 'Citing vague or invented experts (“scientists say”, “a doctor friend”) to borrow credibility without evidence.',
        howToSpot: 'Ask: which scientist? Which study? A real claim names checkable sources; a fake one stays vague.',
        example: '“Top doctors confirm…” posts where no doctor, hospital, or paper is ever named.',
    },
    {
        key: 'context',
        title: 'Context Manipulation',
        description: 'Real photos, videos, or quotes presented with a false time, place, or story. The content is genuine — the framing is the lie.',
        howToSpot: 'Reverse-image search photos and check the original date. Old disaster footage is constantly recycled for new events.',
        example: 'A 2015 flood video re-shared as “yesterday\'s storm” in a different country.',
    },