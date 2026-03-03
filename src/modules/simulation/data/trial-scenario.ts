/**
 * Local demo mission for the public /simulation trial (no account needed).
 *
 * Redesigned alongside the 2026-07 gamification overhaul: one scene per
 * manipulation technique in `modules/gamification/learning-content.ts`, with
 * per-choice `trap` strings that `matchTechnique()` resolves into full
 * technique explainers inside the LearningMomentCard.
 */

export interface Choice {
    id: string;
    text: string;
    /** Positive = good decision, negative = fell for the manipulation. */
    trustImpact: number;
    feedback: string;
    /** Manipulation trap this choice falls into; matched by matchTechnique(). */
    trap?: string;
    /** The single best decision of the scene (drives accuracy). */
    isBest?: boolean;
}

export interface Scene {
    id: string;
    type: 'SOCIAL_POST' | 'CHAT_CONVERSATION';
    author: string;
    handle?: string;
    content: string;
    mediaUrl?: string;
    timestamp: string;
    /** Technique key from learning-content.ts this scene teaches. */
    techniqueKey: string;
    choices: Choice[];
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    learningObjective: string;
    psychologicalTrigger: string;
    preventionLesson: string;
    scenes: Scene[];
}

export const TRIAL_SCENARIO: Scenario = {
    id: 'trial-002',
    title: 'One Day in the Feed',
    description: 'A normal day online — except every post is trying to fool you in a different way. Spot all seven manipulation techniques to protect your community.',
    learningObjective: 'Recognize the seven most common manipulation techniques — emotional manipulation, false urgency, fake authority, context manipulation, manufactured consensus, misleading statistics, and impersonation — before you react.',
    psychologicalTrigger: 'Misinformation rarely lies to your logic first. It targets your emotions, your trust in experts, and your instinct to follow the crowd — and pressures you to act before you think.',
    preventionLesson: 'One habit defeats most techniques: pause, then verify. Check the original source, the date, the account, and the numbers before you share, reply, or believe.',
    scenes: [
        {
            id: 'scene-emotional',
            type: 'SOCIAL_POST',