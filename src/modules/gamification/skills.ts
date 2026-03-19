/**
 * Measurable media-literacy competencies (Phase 7 — skill graph).
 *
 * Every decision the player makes is attributed to one skill via the
 * manipulation-technique key of the chosen option (see learning-content.ts).
 * Skill progress is tracked client-side in the game store; the shapes here
 * are designed to serialize directly if/when a backend table is added.
 */

export interface Skill {
    key: string;
    name: string;
    /** What this competency means, shown in the skills panel. */
    description: string;
    /** Tailwind text color class for accents. */
    color: string;
    /** Tailwind bg class for progress bars. */
    bar: string;
    emoji: string;
}

export const SKILLS: Skill[] = [
    {
        key: 'source-verification',
        name: 'Source Verification',
        description: 'Checking who is speaking — real experts, real outlets, real accounts.',
        color: 'text-blue-600 dark:text-blue-400',
        bar: 'bg-blue-500',
        emoji: '🔍',
    },
    {
        key: 'emotional-defense',
        name: 'Emotional Defense',
        description: 'Noticing when fear, outrage, or urgency is being used against you.',
        color: 'text-rose-600 dark:text-rose-400',
        bar: 'bg-rose-500',
        emoji: '🧘',
    },
    {
        key: 'media-analysis',
        name: 'Media Analysis',
        description: 'Spotting recycled, miscaptioned, or AI-generated images and video.',
        color: 'text-violet-600 dark:text-violet-400',
        bar: 'bg-violet-500',
        emoji: '🖼️',
    },
    {
        key: 'data-literacy',
        name: 'Data Literacy',
        description: 'Reading numbers, charts, and statistics without being misled.',
        color: 'text-amber-600 dark:text-amber-400',
        bar: 'bg-amber-500',
        emoji: '📊',
    },
    {
        key: 'network-awareness',
        name: 'Network Awareness',
        description: 'Recognizing bots, manufactured consensus, and echo chambers.',
        color: 'text-cyan-600 dark:text-cyan-400',
        bar: 'bg-cyan-500',
        emoji: '🕸️',
    },
    {
        key: 'critical-thinking',
        name: 'Critical Thinking',
        description: 'The general habit of pausing, questioning, and verifying claims.',
        color: 'text-emerald-600 dark:text-emerald-400',
        bar: 'bg-emerald-500',
        emoji: '🧠',
    },
];

/** Technique key (learning-content.ts) → skill key. Unmatched → critical-thinking. */
const TECHNIQUE_TO_SKILL: Record<string, string> = {
    authority: 'source-verification',
    impersonation: 'source-verification',
    emotional: 'emotional-defense',
    urgency: 'emotional-defense',
    clickbait: 'emotional-defense',
    context: 'media-analysis',
    deepfake: 'media-analysis',
    statistics: 'data-literacy',
    'cherry-picking': 'data-literacy',
    'social-proof': 'network-awareness',
    conspiracy: 'network-awareness',
};

export function skillForTechnique(techniqueKey?: string | null): Skill {
    const key = techniqueKey ? TECHNIQUE_TO_SKILL[techniqueKey] : undefined;
    return SKILLS.find(s => s.key === (key ?? 'critical-thinking')) ?? SKILLS[SKILLS.length - 1];
}

/** Per-skill accumulated progress, persisted in the game store. */
export interface SkillProgress {
    xp: number;
    correct: number;
    total: number;
}

export const XP_PER_CORRECT_DECISION = 12;
/** Wrong answers still teach — smaller XP so effort is never zeroed out. */
export const XP_PER_INCORRECT_DECISION = 3;

/** Skill level 1–10 on a gentle quadratic curve (level 2 at 50 XP). */
export function skillLevel(xp: number): number {
    return Math.min(10, Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1));
}

export function skillLevelProgress(xp: number): number {
    const level = skillLevel(xp);
    if (level >= 10) return 100;
    const start = Math.pow(level - 1, 2) * 50;
    const end = Math.pow(level, 2) * 50;
    return Math.min(100, Math.max(0, Math.round(((xp - start) / (end - start)) * 100)));
}

export function skillAccuracy(progress: SkillProgress): number | null {
    if (!progress.total) return null;
    return Math.round((progress.correct / progress.total) * 100);
}

/**
 * The skill that most needs work: lowest accuracy among skills with enough
 * attempts to judge (≥3), falling back to the least-practiced skill.
 */
export function weakestSkill(book: Record<string, SkillProgress>): Skill | null {
    const attempted = SKILLS.filter(s => (book[s.key]?.total ?? 0) >= 3);
    if (attempted.length === 0) return null;
    let weakest = attempted[0];
    for (const s of attempted) {
        const a = skillAccuracy(book[s.key]!) ?? 100;
        const w = skillAccuracy(book[weakest.key]!) ?? 100;
        if (a < w) weakest = s;
    }
    // Only call it a focus area if it's actually below a solid bar.
    return (skillAccuracy(book[weakest.key]!) ?? 100) < 80 ? weakest : null;
}
