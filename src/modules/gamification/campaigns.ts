/**
 * Campaign story arcs (Phase 3).
 *
 * Scenarios sharing a `campaignTag` form a connected arc. Grouping and the
 * campaign's "world state" are both derived client-side from data the API
 * already returns (`campaignTag`, `order`, `userRecord` bests), so no backend
 * change is required: the world state is the story-level consequence of how
 * well the player has handled the campaign's missions so far.
 */
