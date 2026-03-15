/**
 * Recurring characters (Phase 11).
 *
 * The cast gives the player's statistics a human face. Each character cares
 * about one specific competency (or about the player's overall conduct), and
 * their disposition is *derived* from the player's real record in that area —
 * never from separate hidden state. That keeps relationships honest: a
 * character warms up exactly because the player demonstrably improved.
 *
 * Scenario writers can reference these characters by key in scene content so
 * the same faces recur across a campaign.
 */

import { SKILLS, skillAccuracy } from './skills';
import type { SkillProgress } from './skills';

export type Disposition = 'wary' | 'neutral' | 'warm' | 'devoted';

export const DISPOSITIONS: Record<Disposition, { label: string; color: string; chip: string; emoji: string }> = {
    wary: { label: 'Wary', color: 'text-red-600 dark:text-red-400', chip: 'bg-red-500/10 border-red-500/25', emoji: '😟' },
    neutral: { label: 'Neutral', color: 'text-muted-foreground', chip: 'bg-muted border-border', emoji: '😐' },
    warm: { label: 'Warm', color: 'text-emerald-600 dark:text-emerald-400', chip: 'bg-emerald-500/10 border-emerald-500/25', emoji: '🙂' },
    devoted: { label: 'Devoted', color: 'text-violet-600 dark:text-violet-400', chip: 'bg-violet-500/10 border-violet-500/25', emoji: '🤝' },
};

export interface Character {
    key: string;
    name: string;
    role: string;
    emoji: string;
    /** Why this person is in the player's life. */
    bio: string;
    /** The skill whose accuracy drives their disposition; null = overall conduct. */
    skillKey: string | null;
    /** What they say at each disposition. */