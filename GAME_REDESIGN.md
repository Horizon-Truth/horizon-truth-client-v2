# Horizon Truth — Game Redesign & Gamification Overhaul

Date: 2026-07-30
Scope: player-facing game experience (mission hub, game session, learning feedback, results, progression).

---

## 1. Assessment of the previous implementation

### Critical (broken or misleading)

| # | Issue | Where |
|---|-------|-------|
| C1 | **Split theme identity.** The app follows system light/dark, but the mission dashboard was styled dark-only (`border-white/10` glass — invisible in light mode) while the in-game session was hardcoded light (`bg-white`, `text-slate-*` — blinding in dark mode). | `GamePage`, `GameSession`, `GameOutcome`, `InvestigationReveal` |
| C2 | **The game never taught.** The backend ships `learningObjective`, `preventionLesson`, `psychologicalTrigger` per scenario and `psychologicalTrap` per choice — none of it was ever shown to the player. Feedback was a one-line quote. | `GameSession`, `GameOutcome` |
| C3 | **Fake UI data.** The right sidebar showed hardcoded fake notifications ("Badge Earned · 15m ago", "Node Strength 84%") on every scene, forever. | `GameSession` |
| C4 | **XP math inconsistency.** The store computed level as `sqrt(xp/100)+1` while the dashboard displayed `xp / (level*100)` — the XP bar could exceed 100%. | `game.store`, `GamePage` |
| C5 | **Trust score unbounded.** Deltas were accumulated without clamping to 0–100. | `game.store` |
| C6 | **Hostile navigation.** Back button was silently hijacked (popstate trap with no way out); exiting a mission forced `window.location.reload()`. | `GameSession`, `GamePage` |

### High (UX / gameplay)
