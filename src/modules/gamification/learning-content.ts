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