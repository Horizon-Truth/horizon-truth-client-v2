/**
 * Local demo mission for the public /simulation trial (no account needed).
 *
 * Redesigned alongside the 2026-07 gamification overhaul: one scene per
 * manipulation technique in `modules/gamification/learning-content.ts`, with
 * per-choice `trap` strings that `matchTechnique()` resolves into full
 * technique explainers inside the LearningMomentCard.
 */

export interface Choice {
    id: string;
    text: string;
    /** Positive = good decision, negative = fell for the manipulation. */
    trustImpact: number;
    feedback: string;
    /** Manipulation trap this choice falls into; matched by matchTechnique(). */
    trap?: string;
    /** The single best decision of the scene (drives accuracy). */
    isBest?: boolean;
}

export interface Scene {
    id: string;
    type: 'SOCIAL_POST' | 'CHAT_CONVERSATION';
    author: string;
    handle?: string;
    content: string;
    mediaUrl?: string;
    timestamp: string;
    /** Technique key from learning-content.ts this scene teaches. */
    techniqueKey: string;
    choices: Choice[];
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    learningObjective: string;
    psychologicalTrigger: string;
    preventionLesson: string;
    scenes: Scene[];
}

export const TRIAL_SCENARIO: Scenario = {
    id: 'trial-002',
    title: 'One Day in the Feed',
    description: 'A normal day online — except every post is trying to fool you in a different way. Spot all seven manipulation techniques to protect your community.',
    learningObjective: 'Recognize the seven most common manipulation techniques — emotional manipulation, false urgency, fake authority, context manipulation, manufactured consensus, misleading statistics, and impersonation — before you react.',
    psychologicalTrigger: 'Misinformation rarely lies to your logic first. It targets your emotions, your trust in experts, and your instinct to follow the crowd — and pressures you to act before you think.',
    preventionLesson: 'One habit defeats most techniques: pause, then verify. Check the original source, the date, the account, and the numbers before you share, reply, or believe.',
    scenes: [
        {
            id: 'scene-emotional',
            type: 'SOCIAL_POST',
            author: 'TechGuru_99',
            handle: '@techguru_99',
            content: '🚨 BREAKING: Scientists discovered a way to DOUBLE human lifespan using common salt! Big Pharma is FURIOUS and wants this DELETED. Share before it\'s taken down! #SecretCure',
            mediaUrl: 'https://images.unsplash.com/photo-1532187863486-abf51ad4b693?auto=format&fit=crop&q=80&w=800',
            timestamp: '2 mins ago',
            techniqueKey: 'emotional',
            choices: [
                {
                    id: 'c1a',
                    text: 'Share it immediately to warn friends',
                    trustImpact: -15,
                    trap: 'Emotional manipulation and fear of missing the “hidden truth” pushed you to share before thinking.',
                    feedback: 'This post is engineered to bypass your judgment: outrage (“Big Pharma is FURIOUS”), a miracle promise, and zero sources. Sharing it spread a health hoax to everyone who trusts you.',
                },
                {
                    id: 'c1b',
                    text: 'Search for the study in reputable science outlets first',
                    trustImpact: 15,
                    isBest: true,
                    feedback: 'Exactly right. A discovery this big would be everywhere in the scientific press. When only anonymous accounts carry a “breakthrough”, that absence is your answer.',
                },
                {
                    id: 'c1c',
                    text: 'Reply angrily that it\'s obviously fake',
                    trustImpact: 0,
                    feedback: 'Your instinct was correct, but angry replies boost a post\'s engagement — the algorithm shows it to more people. Verify, report, and don\'t feed the fire.',
                },
            ],
        },
        {
            id: 'scene-urgency',
            type: 'CHAT_CONVERSATION',
            author: 'Family Group',
            content: '⚠️ FORWARDED: New law starts at MIDNIGHT TONIGHT — everyone must re-register their SIM card in 24 hours or lose their number forever! Send to 10 people NOW so nobody gets cut off!',
            timestamp: 'Just now',
            techniqueKey: 'urgency',
            choices: [
                {
                    id: 'c2a',
                    text: 'Forward it to your other groups — better safe than sorry',
                    trustImpact: -15,
                    trap: 'False urgency: the “midnight deadline” was designed to make you act before checking.',
                    feedback: '“Better safe than sorry” is exactly the reflex chain messages exploit. This hoax has circulated for years with the deadline always set to “tonight”. Real regulations come with official notice periods, not chain letters.',
                },
                {
                    id: 'c2b',
                    text: 'Check the telecom regulator\'s official channels before responding',
                    trustImpact: 15,
                    isBest: true,
                    feedback: 'Perfect. Real policy changes are published by the authority itself. Thirty seconds on an official site beats forwarding a years-old hoax — and anything that punishes you for taking 5 minutes to check is suspect by design.',
                },
                {
                    id: 'c2c',
                    text: 'Ignore it completely',
                    trustImpact: 5,
                    feedback: 'Not spreading it is good — but your family group is still panicking. The strongest move is to check the official source and reply with what you find, so the rumor dies in the group.',
                },
            ],
        },
        {
            id: 'scene-authority',
            type: 'CHAT_CONVERSATION',
            author: 'Best Friend',
            content: 'My cousin\'s friend is a doctor and she says the new vaccine changes your DNA 😳 She\'s a real doctor so it must be true, right? Should I cancel my appointment?',
            timestamp: '5 mins ago',
            techniqueKey: 'authority',
            choices: [
                {