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
        reached: 0,
        reshares: 0,
        credibilityLoss: 0,
        preventedReach: 0,
        misinfoChoices: 0,
        protectiveChoices: 0,
    };
}

const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : 0);

/** The worst spread any choice on the scene could have caused. */
export function maxSceneSpread(choices?: { spreadSimulation?: SpreadSimulation | null }[] | null): number {
    if (!choices) return 0;
    return choices.reduce((max, c) => Math.max(max, num(c.spreadSimulation?.reach)), 0);
}

/**
 * Fold one resolved decision into the ledger.
 *
 * @param chosenSpread the spread simulation of the chosen option, if any
 * @param correct      whether the decision was correct (null = neutral)
 * @param sceneChoices all choices of the scene, for the counterfactual spread
 */
export function applyDecisionImpact(
    impact: MissionImpact,
    chosenSpread: SpreadSimulation | null | undefined,
    correct: boolean | null,
    sceneChoices?: { spreadSimulation?: SpreadSimulation | null }[] | null,
): MissionImpact {
    if (chosenSpread) {
        return {
            ...impact,
            reached: impact.reached + num(chosenSpread.reach),
            reshares: impact.reshares + num(chosenSpread.reshares),
            credibilityLoss: impact.credibilityLoss + num(chosenSpread.credibility_loss),
            misinfoChoices: impact.misinfoChoices + 1,
        };
    }
    if (correct === true) {
        return {
            ...impact,
            preventedReach: impact.preventedReach + maxSceneSpread(sceneChoices),
            protectiveChoices: impact.protectiveChoices + 1,
        };
    }
    return impact;
}

export function hasImpact(impact: MissionImpact | null | undefined): boolean {
    return !!impact && (impact.reached > 0 || impact.preventedReach > 0);
}

/** One-line narrative verdict for the outcome screen. */
export function impactVerdict(impact: MissionImpact): { tone: 'good' | 'mixed' | 'bad'; text: string } {
    if (impact.reached === 0 && impact.preventedReach > 0) {
        return {
            tone: 'good',
            text: `You spread nothing false and shielded roughly ${formatPeople(impact.preventedReach)} people from misinformation. This is what a community guardian looks like.`,
        };
    }
    if (impact.reached > 0 && impact.preventedReach >= impact.reached) {
        return {
            tone: 'mixed',
            text: `Some misinformation got through you — about ${formatPeople(impact.reached)} people saw it — but your good calls shielded more (${formatPeople(impact.preventedReach)}).`,
        };
    }
    if (impact.reached > 0) {
        return {
            tone: 'bad',
            text: `Misinformation you amplified reached roughly ${formatPeople(impact.reached)} people${impact.reshares > 0 ? ` and was reshared ${impact.reshares.toLocaleString()} times` : ''}. Every share was a person deciding to trust it.`,
        };
    }
    return { tone: 'mixed', text: 'A quiet mission — no measurable spread either way.' };
}

/** 12800 → "12.8K", 950 → "950". */
export function formatPeople(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
    return `${n}`;
}
