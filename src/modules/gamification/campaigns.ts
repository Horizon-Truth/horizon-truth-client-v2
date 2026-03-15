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