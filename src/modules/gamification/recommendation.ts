/**
 * Adaptive mission recommendation (Phase 9).
 *
 * Picks the next best scenario for a player from data that already exists:
 * the scenario's authored `psychologicalTrigger`/`theme` resolves to a
 * manipulation technique (learning-content.ts) and thus to a trainable skill
 * (skills.ts); the player's skill book and per-scenario mastery records say
 * where practice is most needed.
 *
 * Priorities, in order:
 *   1. Resume an in-progress mission.
 *   2. Train the player's weakest skill.
 *   3. Cover new ground (never-completed scenarios, low mastery tiers).