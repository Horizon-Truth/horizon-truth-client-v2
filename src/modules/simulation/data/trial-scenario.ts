export interface Choice {
    id: string;
    text: string;
    trustImpact: number;
    feedback: string;
}

export interface Scene {
    id: string;
    type: 'SOCIAL_POST' | 'CHAT_CONVERSATION';
    author: string;
    avatar?: string;
    content: string;
    mediaUrl?: string;
    timestamp: string;
    choices: Choice[];
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    scenes: Scene[];
}

export const TRIAL_SCENARIO: Scenario = {
    id: 'trial-001',
    title: 'The Viral Breakthrough',
    description: 'A mysterious scientific discovery is trending. Can you separate truth from hype?',
    scenes: [
        {
            id: 'scene-1',
            type: 'SOCIAL_POST',
            author: 'TechGuru_99',
            content: '🚨 BREAKING: Scientists just discovered a way to double human lifespan using common salt! Big Pharma doesn\'t want you to know this. Share before it gets taken down! #Longevity #SecretCure',
            mediaUrl: 'https://images.unsplash.com/photo-1532187863486-abf51ad4b693?auto=format&fit=crop&q=80&w=800',
            timestamp: '2 mins ago',
            choices: [
                {
                    id: 'c1',
                    text: 'Share it immediately to warn friends',
                    trustImpact: -15,
                    feedback: 'Sharing unverified sensationalist claims reduces your Trust Score. "Big Pharma" conspiracies are common red flags.'
                },
                {
                    id: 'c2',
                    text: 'Check reputable science journals for confirmation',
                    trustImpact: 10,
                    feedback: 'Great! Cross-referencing with credible sources is the best way to verify scientific claims.'
                },
                {
                    id: 'c3',
                    text: 'Report the post for misinformation',
                    trustImpact: 5,
                    feedback: 'Reporting helps platforms clean up junk content, though verification should come first.'
                }
            ]
        },
        {
            id: 'scene-2',
            type: 'CHAT_CONVERSATION',
            author: 'Best Friend',
            content: 'Hey, did you see that post about the salt cure? My grandma just sent it to me and she\'s starting to eat spoonfuls of salt! Is this legit?',
            timestamp: 'Just now',
            choices: [
                {
                    id: 'c4',
                    text: 'Tell them it\'s definitely true, you saw it on TechGuru',
                    trustImpact: -20,
                    feedback: 'Confirming false information to friends causes direct harm in the simulation.'
                },
                {
                    id: 'c5',
                    text: 'Advise them to wait for real medical advice',
                    trustImpact: 15,
                    feedback: 'Responsible advice! Preventing the spread of harmful health hoaxes is a major win.'
                }
            ]
        }
    ]
};
