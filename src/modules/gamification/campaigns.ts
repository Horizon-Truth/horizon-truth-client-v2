/**
 * Campaign story arcs (Phase 3).
 *
 * Scenarios sharing a `campaignTag` form a connected arc. Grouping and the
 * campaign's "world state" are both derived client-side from data the API
 * already returns (`campaignTag`, `order`, `userRecord` bests), so no backend
 * change is required: the world state is the story-level consequence of how
 * well the player has handled the campaign's missions so far.
 */

import type { Scenario } from '@/services/engine.service';

export interface CampaignWorldState {
    completed: number;
    total: number;
    /** 0–100 completion of the arc. */
    pct: number;
    /** Average best accuracy across completed missions, or null before any. */
    avgAccuracy: number | null;
    /** Narrative summary of how the campaign's community is doing. */
    narrative: string;
    tone: 'neutral' | 'thriving' | 'contested' | 'crisis';
}

export interface CampaignGroup {
    /** Raw campaign tag, or null for standalone missions. */
    tag: string | null;
    /** Human-readable arc name derived from the tag. */
    title: string | null;
    scenarios: Scenario[];
}

/** "ELECTION_CAMPAIGN" / "election-campaign" → "Election Campaign". */
export function campaignTitle(tag: string): string {
    return tag
        .split(/[_\-\s]+/)
        .filter(Boolean)
        .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Split an ordered scenario list into consecutive runs that share a campaign
 * tag. Order is preserved exactly as the learning path delivers it, so
 * standalone missions keep flowing between arcs.
 */
export function groupByCampaign(scenarios: Scenario[]): CampaignGroup[] {
    const groups: CampaignGroup[] = [];
    for (const scenario of scenarios) {
        const tag = scenario.campaignTag ?? null;
        const last = groups[groups.length - 1];
        if (last && last.tag === tag) {
            last.scenarios.push(scenario);
        } else {
            groups.push({ tag, title: tag ? campaignTitle(tag) : null, scenarios: [scenario] });
        }
    }
    return groups;
}

/** All scenarios anywhere in the list sharing this tag (for accurate arc totals). */
export function campaignWorldState(campaignScenarios: Scenario[]): CampaignWorldState {
    const total = campaignScenarios.length;
    const completedRecords = campaignScenarios
        .map(s => s.userRecord)
        .filter((r): r is NonNullable<Scenario['userRecord']> => !!r?.isCompleted);
    const completed = completedRecords.length;
    const avgAccuracy = completed > 0
        ? Math.round(completedRecords.reduce((sum, r) => sum + (r.bestAccuracyRate ?? 0), 0) / completed)
        : null;

    let tone: CampaignWorldState['tone'];
    let narrative: string;
    if (completed === 0) {
        tone = 'neutral';
        narrative = 'The story begins — a false post is starting to spread.';
    } else if ((avgAccuracy ?? 0) >= 85) {
        tone = 'thriving';
        narrative = 'Your community trusts you. Misinformation is struggling to take root here.';
    } else if ((avgAccuracy ?? 0) >= 70) {
        tone = 'contested';
        narrative = "You're holding the line — but rumors keep slipping through the cracks.";
    } else {
        tone = 'crisis';
        narrative = 'Falsehoods are outpacing the truth. The community is growing uneasy.';
    }

    return {
        completed,
        total,
        pct: total > 0 ? Math.round((completed / total) * 100) : 0,
        avgAccuracy,
        narrative,
        tone,
    };
}
