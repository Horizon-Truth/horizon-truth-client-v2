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