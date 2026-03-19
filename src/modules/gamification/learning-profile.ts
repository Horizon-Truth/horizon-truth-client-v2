/**
 * Client-side merge for the server-synced learning ledgers (skill book +
 * confidence calibration). Mirrors backend/src/players/learning-profile.util.ts:
 * counters are monotonic, so divergent copies reconcile via element-wise max —
 * progress can never be lost, whichever side is stale.