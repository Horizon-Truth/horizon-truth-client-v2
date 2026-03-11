/**
 * Confidence tracking (Phase 15).
 *
 * Before each decision is submitted the player states how sure they are.
 * The value flows into the existing telemetry field `decision_confidence_level`
 * and into a persisted calibration ledger (confidence vs. actual accuracy),
 * which powers overconfidence coaching in learning moments and on the hub.
 */
