/**
 * Living-world mission impact (Phase 4).
 *
 * Scenario authors attach `spreadSimulation` data ({ reach, reshares,
 * credibility_loss }) to choices that spread misinformation. This module
 * accumulates those numbers across a whole mission into a community-impact
 * ledger, so the outcome screen can show consequences as people, not points:
 *
 * - Choosing a spreading option adds its reach/reshares to the harm side.
 * - Choosing well "shields" the community: the largest spread any other
 *   option on that scene would have caused is counted as exposure prevented.
 */

export interface SpreadSimulation {
    reach: number;
    reshares: number;
    credibility_loss: number;
}

export interface MissionImpact {
    /** The game progress this ledger belongs to. */
    progressId: string;
    /** People reached by misinformation the player spread or amplified. */
    reached: number;
    /** Reshares triggered by the player's spreading choices. */
    reshares: number;
    /** Credibility lost across spreading choices. */
    credibilityLoss: number;
    /** Exposure prevented by good calls (max alternative spread per scene). */
    preventedReach: number;
    /** Number of decisions that spread misinformation. */
    misinfoChoices: number;
    /** Number of decisions that protected the community. */
    protectiveChoices: number;
}

export function emptyImpact(progressId: string): MissionImpact {
    return {
        progressId,