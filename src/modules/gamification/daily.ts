/**
 * Daily engagement (Phase 14) — "Today's briefing".
 *
 * A deterministic mission-of-the-day (same date → same pick, given the same
 * content set) plus a small set of daily quests whose progress is tracked in
 * a per-day ledger in the game store. The ledger rolls over automatically at
 * local midnight; quests reinforce the existing streak loop rather than
 * granting client-side rewards.