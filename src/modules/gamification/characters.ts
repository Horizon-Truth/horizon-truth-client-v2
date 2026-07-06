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
    lines: Record<Disposition, string>;
}

export const CHARACTERS: Character[] = [
    {
        key: 'meron',
        name: 'Meron',
        role: 'Local journalist',
        emoji: '📰',
        bio: 'Runs a two-person newsroom and checks every claim twice. She notices who else does.',
        skillKey: 'source-verification',
        lines: {
            wary: "You pass things along without asking who's behind them. In my job, that's how careers end.",
            neutral: "You're careful sometimes. Make it a habit and I'll start sending you tips.",
            warm: 'You check your sources. That puts you ahead of most people with a newsroom badge.',
            devoted: "When something big breaks, you're the first person I want a second opinion from.",
        },
    },
    {
        key: 'tsehay',
        name: 'Tsehay',
        role: 'Schoolteacher',
        emoji: '🧑‍🏫',
        bio: 'Teaches teenagers to think before they share. Watches how adults handle outrage bait.',
        skillKey: 'emotional-defense',
        lines: {
            wary: 'Anger travels faster than truth, and lately it travels through you.',
            neutral: "You're learning to pause. That pause is the whole lesson.",
            warm: "You don't take the bait anymore. I use your example in class.",
            devoted: 'My students should learn to read a feed the way you do. Would you talk to them?',
        },
    },
    {
        key: 'dawit',
        name: 'Dawit',
        role: 'Photo editor',
        emoji: '🖼️',
        bio: 'Spent fifteen years spotting doctored images. Now the fakes are generated, not edited.',
        skillKey: 'media-analysis',
        lines: {
            wary: "You believe pictures. Pictures have been lying since long before the AI showed up.",
            neutral: "You're starting to look twice at images. Keep going — the fakes are getting better.",
            warm: 'You catch the recycled and the synthetic. Good instincts, well trained.',
            devoted: "You spot things I miss now. That's not flattery — that's a job offer.",
        },
    },
    {
        key: 'sara',
        name: 'Dr. Sara',
        role: 'Public health researcher',
        emoji: '🔬',
        bio: 'Fights health misinformation with data — and knows how easily data can be twisted.',
        skillKey: 'data-literacy',
        lines: {
            wary: 'A number in a graphic convinced you. That graphic had no axis labels.',
            neutral: "You're asking better questions about the numbers. Keep asking 'percent of what?'",
            warm: "You read the axes and the sample size. Do you know how rare that is?",
            devoted: 'I send you my drafts before publication. You catch the framing problems I miss.',
        },
    },
    {
        key: 'kaleb',
        name: 'Kaleb',
        role: 'Community organizer',
        emoji: '🕸️',
        bio: 'Watches how rumors move through neighborhoods, group chats, and hashtags.',
        skillKey: 'network-awareness',
        lines: {
            wary: 'You mistake a crowd for a consensus. Half that crowd was bought.',
            neutral: "You're starting to notice when a trend is manufactured. Look at the accounts.",
            warm: 'You can tell an authentic wave from a coordinated one. That takes real attention.',
            devoted: "When our community gets swarmed, you're who I call to map it out.",
        },
    },
    {
        key: 'almaz',
        name: 'Almaz',
        role: 'Your neighbor',
        emoji: '🏡',
        bio: "Forwards everything to the family group chat. Whether that's a problem depends on you.",
        skillKey: null,
        lines: {
            wary: "You sent me that story about the water supply. My sister still believes it.",
            neutral: "You're more careful than most in the group chat. That counts for something.",
            warm: 'I check with you before I forward things now. You saved me some embarrassment.',
            devoted: "The whole building asks you first. You've made this a harder place to fool.",
        },
    },
];

export interface CharacterState {
    character: Character;
    disposition: Disposition;
    line: string;
    /** Accuracy driving the disposition, or null when there isn't enough data. */
    accuracy: number | null;
    /** Decisions recorded in this character's area. */
    decisions: number;
}

/** Minimum decisions before a character forms an opinion. */
export const OPINION_THRESHOLD = 3;

function dispositionFor(accuracy: number | null, decisions: number): Disposition {
    if (accuracy === null || decisions < OPINION_THRESHOLD) return 'neutral';
    if (accuracy >= 90) return 'devoted';
    if (accuracy >= 70) return 'warm';
    if (accuracy >= 50) return 'neutral';
    return 'wary';
}

/**
 * Resolve the cast's current feelings toward the player.
 *
 * @param skillBook   per-skill accuracy record
 * @param overall     overall accuracy 0–100 (drives characters with no skill)
 * @param totalDecisions overall decision count, for the opinion threshold
 */
export function castState(
    skillBook: Record<string, SkillProgress>,
    overall: number | null,
    totalDecisions: number,
): CharacterState[] {
    return CHARACTERS.map(character => {
        if (character.skillKey === null) {
            const disposition = dispositionFor(overall, totalDecisions);
            return { character, disposition, line: character.lines[disposition], accuracy: overall, decisions: totalDecisions };
        }
        const progress = skillBook[character.skillKey];
        const accuracy = progress ? skillAccuracy(progress) : null;
        const decisions = progress?.total ?? 0;
        const disposition = dispositionFor(accuracy, decisions);
        return { character, disposition, line: character.lines[disposition], accuracy, decisions };
    });
}

/** Skills that have no character attached — useful when extending the cast. */
export function skillsWithoutCharacter(): string[] {
    const covered = new Set(CHARACTERS.map(c => c.skillKey).filter(Boolean));
    return SKILLS.filter(s => !covered.has(s.key)).map(s => s.key);
}
