import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@/services/engine.service', () => ({
    engineService: {
        getMyGameHistory: vi.fn(),
        startGame: vi.fn(),
        getGameProgress: vi.fn(),
        submitChoice: vi.fn(),
    },
}));

vi.mock('@/services/user.service', () => ({
    userService: {
        getMyStats: vi.fn(),
        getMyLearningProfile: vi.fn(),
        saveMyLearningProfile: vi.fn(),
    },
}));

import { useGameStore } from './game.store';
import { engineService } from '@/services/engine.service';
import { userService } from '@/services/user.service';

const engine = engineService as unknown as Record<string, ReturnType<typeof vi.fn>>;
const user = userService as unknown as Record<string, ReturnType<typeof vi.fn>>;

const initialState = useGameStore.getState();
const get = () => useGameStore.getState();

/** A minimal in-flight mission with one scene and two choices. */
const activeProgress = (overrides: Record<string, unknown> = {}) => ({
    id: 'prog-1',
    currentScene: {
        id: 'scene-1',
        choices: [
            {
                id: 'c1',
                label: 'Share it',
                scoreImpact: -5,
                psychologicalTrap: 'emotional',
                spreadSimulation: { reach: 1000, reshares: 40, credibility_loss: 3 },
            },
            { id: 'c2', label: 'Verify first', scoreImpact: 5 },
        ],
    },
    ...overrides,
});

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useGameStore.setState(initialState, true);

    engine.getMyGameHistory.mockResolvedValue([]);
    user.getMyStats.mockResolvedValue(null);
    user.getMyLearningProfile.mockResolvedValue(null);
    user.saveMyLearningProfile.mockResolvedValue({});
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('prefetchAssets', () => {
    it('ignores a null scene', () => {
        expect(() => get().prefetchAssets(null)).not.toThrow();
    });

    it('ignores a scene with no content', () => {
        expect(() => get().prefetchAssets({ id: 's' })).not.toThrow();
    });

    it('preloads images with an Image element', () => {
        const before = document.head.querySelectorAll('link[rel="prefetch"]').length;

        get().prefetchAssets({ content: { imageUrl: 'https://cdn.test/a.png' } });

        // Images do not add a <link>; only video assets do.
        expect(document.head.querySelectorAll('link[rel="prefetch"]').length).toBe(before);
    });

    it('adds a video prefetch link for .mp4 and .webm', () => {
        get().prefetchAssets({
            content: { videoUrl: 'https://cdn.test/a.mp4', mediaUrl: 'https://cdn.test/b.webm' },
        });

        const hrefs = Array.from(document.head.querySelectorAll('link[rel="prefetch"]')).map(
            (l) => l.getAttribute('href'),
        );
        expect(hrefs).toContain('https://cdn.test/a.mp4');
        expect(hrefs).toContain('https://cdn.test/b.webm');
    });

    it('walks feedItems for media urls', () => {
        get().prefetchAssets({
            content: {
                feedItems: [
                    { mediaUrl: 'https://cdn.test/feed.mp4' },
                    { mediaUrl: 'https://cdn.test/feed.png' },
                    { noMedia: true },
                ],
            },
        });

        const hrefs = Array.from(document.head.querySelectorAll('link[rel="prefetch"]')).map(
            (l) => l.getAttribute('href'),
        );
        expect(hrefs).toContain('https://cdn.test/feed.mp4');
    });
});

describe('fetchGameHistory', () => {
    it('averages accuracy across completed games only', async () => {
        engine.getMyGameHistory.mockResolvedValue([
            { status: 'COMPLETED', accuracyRate: 80 },
            { status: 'COMPLETED', accuracyRate: 60 },
            { status: 'IN_PROGRESS', accuracyRate: 10 },
        ]);

        await get().fetchGameHistory();

        expect(get().stats.accuracyRate).toBe(70);
        expect(get().stats.missionsCompleted).toBe(2);
    });

    it('leaves accuracy at 0 when nothing is completed', async () => {
        engine.getMyGameHistory.mockResolvedValue([{ status: 'IN_PROGRESS' }]);

        await get().fetchGameHistory();

        expect(get().stats.accuracyRate).toBe(0);
    });

    it('sums influence across all games', async () => {
        engine.getMyGameHistory.mockResolvedValue([
            { status: 'COMPLETED', influenceScore: 30 },
            { status: 'COMPLETED', influenceScore: 12 },
            { status: 'COMPLETED' },
        ]);

        await get().fetchGameHistory();

        expect(get().stats.influence).toBe(42);
    });

    it('prefers server player stats when available', async () => {
        engine.getMyGameHistory.mockResolvedValue([{ status: 'COMPLETED', totalScore: 10 }]);
        user.getMyStats.mockResolvedValue({
            totalScore: 400,
            gamesCompleted: 9,
            trustScore: 77,
        });

        await get().fetchGameHistory();

        expect(get().stats.experience).toBe(400);
        expect(get().stats.missionsCompleted).toBe(9);
        expect(get().stats.trustScore).toBe(77);
        expect(get().stats.level).toBe(3); // floor(sqrt(400/100)) + 1
    });

    it('falls back to summing history when the stats call fails', async () => {
        engine.getMyGameHistory.mockResolvedValue([
            { status: 'COMPLETED', totalScore: 100 },
            { status: 'COMPLETED', totalScore: 200 },
        ]);
        user.getMyStats.mockRejectedValue(new Error('no stats'));

        await get().fetchGameHistory();

        expect(get().stats.experience).toBe(300);
        expect(get().stats.trustScore).toBe(50);
    });

    it('never drops below level 1', async () => {
        engine.getMyGameHistory.mockResolvedValue([]);

        await get().fetchGameHistory();

        expect(get().stats.level).toBe(1);
    });

    it('merges the server learning profile into local ledgers', async () => {
        useGameStore.setState({ skillBook: { sourcing: { xp: 30, correct: 1, total: 2 } } });
        user.getMyLearningProfile.mockResolvedValue({
            skillBook: { sourcing: { xp: 10, correct: 5, total: 5 } },
            calibration: { certain: { correct: 2, total: 3 } },
        });

        await get().fetchGameHistory();

        // element-wise max, so neither side loses
        expect(get().skillBook.sourcing).toEqual({ xp: 30, correct: 5, total: 5 });
        expect(get().calibration.certain).toEqual({ correct: 2, total: 3 });
    });

    it('keeps local ledgers when the profile call fails', async () => {
        useGameStore.setState({ skillBook: { sourcing: { xp: 7, correct: 1, total: 1 } } });
        user.getMyLearningProfile.mockRejectedValue(new Error('older server'));

        await get().fetchGameHistory();

        expect(get().skillBook.sourcing).toEqual({ xp: 7, correct: 1, total: 1 });
    });

    it('records an error and stops loading when history fails', async () => {
        engine.getMyGameHistory.mockRejectedValue(new Error('boom'));

        await get().fetchGameHistory();

        expect(get().error).toBe('boom');
        expect(get().isLoading).toBe(false);
    });
});

describe('startGame', () => {
    it('stores the progress and opens an empty impact ledger', async () => {
        engine.startGame.mockResolvedValue({ id: 'prog-9' });

        await get().startGame('scenario-1');

        expect(get().activeProgress).toEqual({ id: 'prog-9' });
        expect(get().missionImpact).toMatchObject({ progressId: 'prog-9', reached: 0 });
        expect(get().isLoading).toBe(false);
    });

    it('surfaces a failure as an error', async () => {
        engine.startGame.mockRejectedValue(new Error('cannot start'));

        await get().startGame('scenario-1');

        expect(get().error).toBe('cannot start');
        expect(get().activeProgress).toBeNull();
    });
});

describe('loadProgress', () => {
    it('keeps the impact ledger when it belongs to the same mission', async () => {
        useGameStore.setState({
            missionImpact: { progressId: 'prog-1', reached: 500 } as never,
        });
        engine.getGameProgress.mockResolvedValue({ id: 'prog-1' });

        await get().loadProgress('prog-1');

        expect(get().missionImpact?.reached).toBe(500);
    });

    it('resets the ledger when loading a different mission', async () => {
        useGameStore.setState({
            missionImpact: { progressId: 'other', reached: 500 } as never,
        });
        engine.getGameProgress.mockResolvedValue({ id: 'prog-1' });

        await get().loadProgress('prog-1');

        expect(get().missionImpact).toMatchObject({ progressId: 'prog-1', reached: 0 });
    });

    it('surfaces a failure as an error', async () => {
        engine.getGameProgress.mockRejectedValue(new Error('gone'));

        await get().loadProgress('prog-1');

        expect(get().error).toBe('gone');
    });
});

describe('submitChoice', () => {
    it('does nothing without an active mission', async () => {
        await get().submitChoice('scene-1', 'c1');

        expect(engine.submitChoice).not.toHaveBeenCalled();
    });

    it('does nothing while a previous submit is in flight', async () => {
        useGameStore.setState({ activeProgress: activeProgress() as never, isLoading: true });

        await get().submitChoice('scene-1', 'c1');

        expect(engine.submitChoice).not.toHaveBeenCalled();
    });

    describe('scene_completed', () => {
        beforeEach(() => {
            useGameStore.setState({ activeProgress: activeProgress() as never });
        });

        it('advances to the next scene and clamps the trust score', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: { id: 'scene-2' },
                trustScoreDelta: 500,
                totalScore: 20,
            });

            await get().submitChoice('scene-1', 'Verify first', 'Verify first');

            expect(get().activeProgress?.currentScene).toEqual({ id: 'scene-2' });
            expect(get().stats.trustScore).toBe(100);
            expect(get().isLoading).toBe(false);
        });

        it('clamps the trust score at zero', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: -500,
            });

            await get().submitChoice('scene-1', 'Share it');

            expect(get().stats.trustScore).toBe(0);
        });

        it('marks a positive delta correct and credits the skill book', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().lastChoiceCorrect).toBe(true);
            expect(get().lastTrustDelta).toBe(5);
            const skills = Object.values(get().skillBook);
            expect(skills).toHaveLength(1);
            expect(skills[0].correct).toBe(1);
            expect(skills[0].total).toBe(1);
        });

        it('marks a negative delta incorrect', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: -5,
            });

            await get().submitChoice('scene-1', 'Share it');

            expect(get().lastChoiceCorrect).toBe(false);
            expect(Object.values(get().skillBook)[0].correct).toBe(0);
            expect(Object.values(get().skillBook)[0].total).toBe(1);
        });

        it('treats a zero delta with a spread simulation as incorrect', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 0,
            });

            // "Share it" carries a spreadSimulation.
            await get().submitChoice('scene-1', 'Share it');

            expect(get().lastChoiceCorrect).toBe(false);
        });

        it('treats a zero delta with no spread as neutral and skips the ledger', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 0,
            });

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().lastChoiceCorrect).toBeNull();
            expect(get().skillBook).toEqual({});
            expect(user.saveMyLearningProfile).not.toHaveBeenCalled();
        });

        it('falls back to the choice scoreImpact when the server sends no delta', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
            });

            await get().submitChoice('scene-1', 'Share it');

            expect(get().lastTrustDelta).toBe(-5);
        });

        it('records the psychological trap of the chosen option', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: -5,
            });

            await get().submitChoice('scene-1', 'Share it');

            expect(get().lastChoiceTrap).toBe('emotional');
        });

        it('accumulates spread into the mission impact ledger', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: -5,
            });

            await get().submitChoice('scene-1', 'Share it');

            expect(get().missionImpact).toMatchObject({
                reached: 1000,
                reshares: 40,
                misinfoChoices: 1,
            });
        });

        it('prefers the explicit choice label over the key for display', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'c2', 'Verify first');

            expect(get().lastChoiceLabel).toBe('Verify first');
        });

        it('falls back to the choice key when no label is passed', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'c2');

            expect(get().lastChoiceLabel).toBe('c2');
        });

        it('books the decision into the confidence bucket when confidence is given', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'Verify first', undefined, 3 as never);

            const booked = Object.values(get().calibration).reduce((n, b) => n + b.total, 0);
            expect(booked).toBe(1);
            expect(get().lastConfidence).toBe(3);
        });

        it('leaves the calibration ledger untouched without confidence', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'Verify first');

            const booked = Object.values(get().calibration).reduce((n, b) => n + b.total, 0);
            expect(booked).toBe(0);
        });

        it('counts a correct decision toward the daily quest', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().dailyLedger?.correctDecisions).toBe(1);
        });

        it('syncs the ledgers to the server without awaiting the result', async () => {
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'Verify first');

            expect(user.saveMyLearningProfile).toHaveBeenCalledTimes(1);
        });

        it('survives a rejected ledger sync', async () => {
            user.saveMyLearningProfile.mockRejectedValue(new Error('offline'));
            engine.submitChoice.mockResolvedValue({
                status: 'scene_completed',
                nextScene: null,
                trustScoreDelta: 5,
            });

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().error).toBeNull();
        });
    });

    describe('game_completed', () => {
        beforeEach(() => {
            useGameStore.setState({ activeProgress: activeProgress() as never });
        });

        const completion = (outcome: Record<string, unknown> = {}) => ({
            status: 'game_completed',
            outcome: { score: 120, trustScoreDelta: 10, accuracyRate: 90, ...outcome },
        });

        it('clears the active mission and stores the outcome', async () => {
            engine.submitChoice.mockResolvedValue(completion());

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().activeProgress).toBeNull();
            expect(get().currentOutcome).toMatchObject({ score: 120 });
            expect(get().stats.missionsCompleted).toBe(1);
            expect(get().stats.experience).toBe(120);
        });

        it('credits a sharp mission at 80%+ accuracy', async () => {
            engine.submitChoice.mockResolvedValue(completion({ accuracyRate: 85 }));

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().dailyLedger?.sharpMissions).toBe(1);
            expect(get().dailyLedger?.missions).toBe(1);
        });

        it('does not credit a sharp mission below 80%', async () => {
            engine.submitChoice.mockResolvedValue(completion({ accuracyRate: 40 }));

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().dailyLedger?.sharpMissions).toBe(0);
        });

        it('accumulates career totals across missions', async () => {
            useGameStore.setState({ lifetimeImpact: { reached: 200, preventedReach: 50 } });
            engine.submitChoice.mockResolvedValue(completion());

            await get().submitChoice('scene-1', 'Share it');

            expect(get().lifetimeImpact.reached).toBe(200 + 1000);
        });

        it('keeps the existing role and streak when the server omits them', async () => {
            useGameStore.setState({ reputationRole: 'ANALYST', currentStreak: 4 });
            engine.submitChoice.mockResolvedValue(completion());

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().reputationRole).toBe('ANALYST');
            expect(get().currentStreak).toBe(4);
        });

        it('takes the role and streak the server sends', async () => {
            engine.submitChoice.mockResolvedValue({
                ...completion(),
                reputationRole: 'GUARDIAN',
                currentStreak: 7,
            });

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().reputationRole).toBe('GUARDIAN');
            expect(get().currentStreak).toBe(7);
        });

        it('defaults awarded badges to an empty list', async () => {
            engine.submitChoice.mockResolvedValue(completion());

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().pendingBadges).toEqual([]);
        });

        it('stores the badges the server awarded', async () => {
            engine.submitChoice.mockResolvedValue({
                ...completion(),
                badgesAwarded: [{ id: 'b1' }],
            });

            await get().submitChoice('scene-1', 'Verify first');

            expect(get().pendingBadges).toEqual([{ id: 'b1' }]);
        });

        it('refreshes history after the mission ends', async () => {
            engine.submitChoice.mockResolvedValue(completion());

            await get().submitChoice('scene-1', 'Verify first');

            expect(engine.getMyGameHistory).toHaveBeenCalled();
        });
    });

    it('records a submit failure as an error', async () => {
        useGameStore.setState({ activeProgress: activeProgress() as never });
        engine.submitChoice.mockRejectedValue(new Error('server down'));

        await get().submitChoice('scene-1', 'c1');

        expect(get().error).toBe('server down');
        expect(get().isLoading).toBe(false);
    });
});

describe('local state actions', () => {
    it('resetGame clears mission state but keeps career ledgers', () => {
        useGameStore.setState({
            activeProgress: { id: 'p' } as never,
            lastTrustDelta: -5,
            skillBook: { sourcing: { xp: 12, correct: 1, total: 1 } },
        });

        get().resetGame();

        expect(get().activeProgress).toBeNull();
        expect(get().lastTrustDelta).toBe(0);
        expect(get().missionImpact).toBeNull();
        expect(get().skillBook.sourcing).toBeDefined();
    });

    it('clearError clears only the error', () => {
        useGameStore.setState({ error: 'nope', isLoading: true });

        get().clearError();

        expect(get().error).toBeNull();
        expect(get().isLoading).toBe(true);
    });

    it('clearSpreadSimulation clears the learning-moment fields', () => {
        useGameStore.setState({
            lastSpreadSimulation: { reach: 1, reshares: 1, credibility_loss: 1 },
            lastChoiceLabel: 'x',
            lastChoiceCorrect: false,
            lastTrustDelta: -3,
            lastChoiceTrap: 'emotional',
        });

        get().clearSpreadSimulation();

        expect(get().lastSpreadSimulation).toBeNull();
        expect(get().lastChoiceLabel).toBeNull();
        expect(get().lastChoiceCorrect).toBeNull();
        expect(get().lastTrustDelta).toBe(0);
        expect(get().lastChoiceTrap).toBeNull();
    });

    it('removePendingBadge drops only the named badge', () => {
        useGameStore.setState({ pendingBadges: [{ id: 'a' }, { id: 'b' }] });

        get().removePendingBadge('a');

        expect(get().pendingBadges).toEqual([{ id: 'b' }]);
    });
});
