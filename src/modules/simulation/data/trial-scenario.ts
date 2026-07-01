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
                    id: 'c3a',
                    text: 'Trust it — a doctor said it, after all',
                    trustImpact: -15,
                    trap: 'Fake authority: an unnamed, unverifiable “doctor” borrowed credibility without any evidence.',
                    feedback: 'Which doctor? Where? Vague experts (“my cousin\'s friend”) are unfalsifiable — that\'s the point. Real medical claims name checkable people, institutions, and studies. Your friend may now skip a vaccine over a rumor.',
                },
                {
                    id: 'c3b',
                    text: 'Suggest checking what health authorities and named experts actually say',
                    trustImpact: 15,
                    isBest: true,
                    feedback: 'Well done. You didn\'t mock your friend — you redirected them to named, accountable sources. Public health bodies publish exactly this information, reviewed by hundreds of identifiable experts.',
                },
                {
                    id: 'c3c',
                    text: 'Tell them to just decide for themselves',
                    trustImpact: -5,
                    feedback: 'Staying neutral feels polite, but your friend asked for help while frightened by a false claim. Silence lets the rumor win by default.',
                },
            ],
        },
        {
            id: 'scene-context',
            type: 'SOCIAL_POST',
            author: 'CityWatch24',
            handle: '@citywatch24',
            content: 'HAPPENING NOW: Downtown completely underwater after tonight\'s storm!! Authorities silent as usual. Stay away from the city center!! 😱',
            mediaUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
            timestamp: '20 mins ago',
            techniqueKey: 'context',
            choices: [
                {
                    id: 'c4a',
                    text: 'Repost it — people need to stay away from downtown',
                    trustImpact: -15,
                    trap: 'Context manipulation: a real photo from a different flood, years ago, reframed as tonight\'s storm.',
                    feedback: 'The photo is real — the story isn\'t. It\'s from a flood in another city years ago. Recycled disaster footage is one of the most common forms of misinformation because the image itself is genuine.',
                },
                {
                    id: 'c4b',
                    text: 'Reverse-image search the photo before doing anything',
                    trustImpact: 15,
                    isBest: true,
                    feedback: 'Exactly the right tool. A reverse-image search would show this photo attached to older, unrelated stories. Always ask: is this content really from this time and this place?',
                },
                {
                    id: 'c4c',
                    text: 'Check local news and official emergency channels',
                    trustImpact: 10,
                    feedback: 'Good instinct — if downtown were truly underwater, local media and emergency services would confirm it. Pair this with a reverse-image search to also expose where the photo actually came from.',
                },
            ],
        },
        {
            id: 'scene-social-proof',
            type: 'SOCIAL_POST',
            author: 'TrendWatcher',
            handle: '@trendwatcher',
            content: '#BankCollapse is the top trend right now — 40,000 posts! EVERYONE is saying NationalBank is out of money. Where there\'s smoke, there\'s fire… withdraw your savings while you still can.',
            timestamp: '32 mins ago',
            techniqueKey: 'social-proof',
            choices: [
                {
                    id: 'c5a',
                    text: 'So many people can\'t be wrong — warn your family to withdraw cash',
                    trustImpact: -15,
                    trap: 'Manufactured consensus: bot networks made a false rumor look like what “everyone” believes.',
                    feedback: 'Volume is not evidence. A closer look shows thousands of identical posts from week-old accounts — a coordinated bot campaign. Ironically, panic withdrawals can damage a healthy bank, making the lie true. That\'s the goal.',
                },
                {
                    id: 'c5b',
                    text: 'Inspect the accounts behind the trend before believing it',
                    trustImpact: 15,
                    isBest: true,
                    feedback: 'Sharp. Creation dates, copy-pasted wording, and no personal history reveal a bot network. A trend tells you something is being pushed — not that it\'s true.',
                },
                {
                    id: 'c5c',
                    text: 'Look for statements from the bank or financial regulator',
                    trustImpact: 10,
                    feedback: 'Good — regulators and the bank itself are the accountable sources here. Combine this with checking the accounts pushing the hashtag and the whole operation falls apart.',
                },
            ],
        },
        {
            id: 'scene-statistics',
            type: 'SOCIAL_POST',
            author: 'DataTruthers',
            handle: '@datatruthers',
            content: 'The numbers DON\'T lie: city crime is up 200% under the new mayor!! 📈 (Chart shows it going through the roof.) Share the TRUTH they hide from you.',
            mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            timestamp: '1 hr ago',
            techniqueKey: 'statistics',
            choices: [
                {
                    id: 'c6a',
                    text: 'Share it — you can\'t argue with numbers',
                    trustImpact: -15,
                    trap: 'Misleading statistics: a truncated axis and cherry-picked window turned real numbers into a false story.',
                    feedback: 'You can argue with charts. The y-axis starts at 90%, the “200% rise” is from 1 incident to 3 in a hand-picked month, and the long-term trend is actually flat. Numbers can be real and the story still false.',
                },
                {
                    id: 'c6b',
                    text: 'Check the axes, the baseline, and the full-year data first',
                    trustImpact: 15,
                    isBest: true,
                    feedback: 'Exactly. Three questions defuse most chart manipulation: Where does the axis start? Percent of what? What does the full time window show? Official statistics offices publish the complete series.',
                },
                {
                    id: 'c6c',
                    text: 'Dismiss it — statistics are always manipulated anyway',
                    trustImpact: -5,
                    feedback: 'Total cynicism is its own trap: if “all numbers are fake”, manipulators win because evidence stops mattering. The skill isn\'t distrusting all data — it\'s reading it carefully.',
                },
            ],
        },
        {
            id: 'scene-impersonation',
            type: 'SOCIAL_POST',
            author: 'BBC News Live',
            handle: '@bbc_news24_live',
            content: 'BREAKING: Election commission announces vote is POSTPONED nationwide due to “technical issues”. More to follow. RT to inform voters.',
            timestamp: '3 mins ago',
            techniqueKey: 'impersonation',
            choices: [
                {
                    id: 'c7a',
                    text: 'Retweet — it\'s the BBC, this is important',
                    trustImpact: -15,
                    trap: 'Impersonation: a lookalike account borrowed a trusted brand to launder a fake announcement.',
                    feedback: 'Look again at the handle: @bbc_news24_live is not the BBC. Impersonators copy the logo and name style of trusted outlets to make lies travel. Election-timing hoaxes like this are designed to suppress votes.',
                },
                {
                    id: 'c7b',
                    text: 'Check the handle character-by-character and visit the real outlet',
                    trustImpact: 15,
                    isBest: true,
                    feedback: 'That\'s the habit. Verify the exact handle and domain, then check the outlet\'s real site — a genuine nationwide announcement would be their top story and confirmed by the election commission itself.',
                },
                {
                    id: 'c7c',
                    text: 'Screenshot it and share asking “is this real?”',
                    trustImpact: -10,
                    feedback: 'Even framed as a question, your share spreads the screenshot — and screenshots detach content from its source, making the fake harder to debunk. Verify first; share only what you\'ve confirmed.',
                },
            ],
        },
    ],
};
