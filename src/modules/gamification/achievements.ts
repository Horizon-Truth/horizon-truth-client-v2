/**
 * Achievement catalog (Phase 13).
 *
 * These are *derived* achievements: every one is evaluated from data the game
 * already tracks (player stats, the skill book, confidence calibration, the
 * community-impact ledger, daily quests, and per-scenario mastery records).
 * Nothing is minted or stored separately, so an achievement can never claim
 * something the underlying record doesn't support.
 *
 * Server-awarded badges (gamification module) remain the authoritative,
 * tamper-proof awards; these complement them with fine-grained goals.
 */

import { SKILLS, skillLevel, skillAccuracy } from './skills';
import type { SkillProgress } from './skills';
import { bucketAccuracy } from './confidence';
import type { CalibrationLedger } from './confidence';
import { MASTERY_TIERS } from './mastery';
import type { MasteryTier } from './mastery';
import type { DailyLedger } from './daily';
