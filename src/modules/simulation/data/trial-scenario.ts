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