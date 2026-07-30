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

| # | Issue |
|---|-------|
| H1 | Cryptic spy-jargon copy everywhere ("Select Response Node", "System Directive Alpha", "Decrypting Uplink", "Intercepted") obscured the educational mission and confused non-expert players. |
| H2 | No progression identity: no named rank ladder, no "XP to next rank", no reason to come back tomorrow. |
| H3 | No onboarding for the game — new players landed on a scenario list with zero explanation of trust, influence, accuracy, or streaks. |
| H4 | Result screen had no celebration, no XP breakdown, no "what you learned", no rank progress. |
| H5 | Timer expiry silently auto-submitted "the worst choice (the first one)" — an unproven assumption, with no explanation to the player. |
| H6 | Number-key hotkeys (1–9) fired even while typing in inputs or holding modifiers. |
| H7 | New scenes scrolled the feed to the **bottom** instead of the top. |
| H8 | Invisible "Exit Mission" button (white text/white glass on white background). |
| H9 | `ScenarioList`: stale-closure pagination bug, artificial 800 ms loading delay. |
| H10 | `custom-scrollbar` class referenced across every game screen but never defined in CSS. |

### Medium (polish / a11y)

- 7–10 px uppercase text used for primary information; low-contrast slate-on-white labels.
- Icon-only buttons without `aria-label`; progress bars without `role="progressbar"`.
- `useReducedMotion` consulted once, then ignored by dozens of pulse/bounce/confetti-style animations.
- Leftover `console.log` in `GameOutcome`; broad `as any` casts.
- Empty `gamification` module directory despite gamification being the product's core loop.

---

## 2. What was redesigned (this pass)

### New gamification core — `src/modules/gamification/`

- **`progression.ts`** — single source of truth for XP → level → rank. Eleven named ranks (🎓 Recruit → 🌱 Beginner → 🧭 Explorer → 🔍 Fact Checker → 💡 Truth Seeker → 🕵️ Investigator → 📊 Analyst → 🎯 Expert → 🛡️ Guardian → ⚔️ Master Defender → 👑 Legend), each with a tagline and color identity. Level math kept compatible with persisted store data. Fully unit-tested (`progression.test.ts`).
- **`learning-content.ts`** — curated educational library: 7 manipulation techniques (emotional manipulation, false urgency, fake authority, context manipulation, manufactured consensus, misleading statistics, impersonation) each with *what it is / how to spot it / real-world example*, plus 9 rotating verification habits. Includes a matcher so scenario-authored `psychologicalTrap` strings map to full technique explainers.
- **`components/LearningMomentCard.tsx`** — structured post-choice feedback: verdict (Good call / Not quite / Noted) → why → expandable "Technique spotted" explainer → verification habit. Every interaction now teaches.
- **`components/HowToPlayDialog.tsx`** — 4-step onboarding (mission → how to play → trust/XP/ranks → streaks), auto-shown on first visit, re-openable from the hub.
- **`components/Confetti.tsx`** — dependency-free celebration confetti that renders nothing under `prefers-reduced-motion`.

### Mission hub (`GamePage`)

- Full theme-token redesign — works in light *and* dark mode.
- Player identity card: avatar + rank badge + tagline + animated XP bar with "N XP to next rank".
- **Daily goal** ("complete 1 mission today") derived from real history, tied to the streak.
- Stat cards renamed to plain language with explanatory hints: Trust Score, Accuracy, Missions Completed, Day Streak.
- "How to play" always one click away; removed forced page reload on exit.

### Game session (`GameSession`)

- Learning Moment card after every choice (replaces the one-line "Mission Intel" quote).
- Right panel is now an honest **Field Guide**: current mission briefing, live session stats (score/accuracy/influence), and a scene-specific verification habit — all real data, no fake notifications.
- Timer expiry now shows a clear "Time ran out — the network reacted before you did" notice instead of silently punishing.
- Back button asks for confirmation and exits gracefully instead of being trapped.
- Hotkeys ignore typing and modifier keys; new scenes scroll to the top; plain-language copy ("What do you do?", "Scene 2 of 5"); aria labels, `role="progressbar"`, `role="timer"`; reduced-motion respected on pulses, flashes and floating numbers.

### Results (`GameOutcome` + `InvestigationReveal`)

- Confetti celebration on success (reduced-motion safe).
- **XP earned + animated rank progress** with next-rank target.
- **"What you learned"** section built from the scenario's `learningObjective`, `psychologicalTrigger`, and `preventionLesson` (fetched on demand; falls back to a verification habit).
- Decision review rewritten in plain language ("Your choice" vs "What actually happened", "The better move") and converted to theme tokens.

### Foundation fixes

- `game.store`: trust clamped 0–100; new `lastChoiceCorrect` / `lastTrustDelta` / `lastChoiceTrap` state feeding the learning UI.
- `ScenarioList`: pagination stale-closure fixed, artificial delay removed, token colors, encouraging copy.
- `index.css`: `custom-scrollbar` finally defined (light+dark), global `prefers-reduced-motion` kill-switch.
- `TrustMeter`: track visible in both themes.

Verification: `tsc -b` clean, `vite build` clean, 27/27 tests pass (20 existing + 7 new).

---

## 3. Recommended next steps (not in this pass)

1. **i18n of game UI copy** — new components keep copy in one place but are English-only; wire them into the existing en/am/om translation system next.
2. **Backend-driven streak & daily goal** — the streak comes from the completion response today; a dedicated `GET /players/me/streak` would make the hub bulletproof across devices.
3. **Learning analytics page** — accuracy by manipulation technique over time (telemetry service already records decision timing; needs an aggregation endpoint + a recharts view).
4. **Challenge variety** — the engine supports TEXT/CHAT/FEED/IMAGE/VIDEO/PROPAGATION scenes; add new scene contracts for timeline-ordering, evidence drag-and-drop, and confidence rating.
5. **Trophy cabinet** — badges currently appear once in an overlay and vanish; persist and display them on a profile/achievements page.
6. **Bundle splitting** — the main chunk is 2.3 MB (638 kB gzip); route-level `manualChunks` would cut initial load significantly.
7. **Guest flow parity** — `GuestGamePage` still uses the old visual language; port the Learning Moment + token design there.
