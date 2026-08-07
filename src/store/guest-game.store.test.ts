import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@/services/engine.service', () => ({
    engineService: {
        getScenarios: vi.fn(),
        getScenarioById: vi.fn(),
    },
}));

vi.mock('@/services/api', () => ({
    default: { post: vi.fn() },
}));

import { useGuestGameStore } from './guest-game.store';
import { engineService } from '@/services/engine.service';
import api from '@/services/api';

const engine = engineService as unknown as Record<string, ReturnType<typeof vi.fn>>;
const mockPost = (api as unknown as { post: ReturnType<typeof vi.fn> }).post;

const initialState = useGuestGameStore.getState();
const get = () => useGuestGameStore.getState();

const scene = (id: string, order: number) => ({ id, order, choices: [] });

const scenario = (scenes: ReturnType<typeof scene>[] = []) => ({
    id: 'sc-1',
    title: 'Flood rumours',
    scenes,
});

/** Drives a store action that is declared sync but is async under the hood. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useGuestGameStore.setState(initialState, true);
    mockPost.mockResolvedValue({ data: {} });
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('fetchScenarios', () => {
    it('accepts a bare array response', async () => {
        engine.getScenarios.mockResolvedValue([scenario()]);

        await get().fetchScenarios();

        expect(get().scenarios).toHaveLength(1);
        expect(get().isLoading).toBe(false);
    });

    it('unwraps a paginated response', async () => {
        engine.getScenarios.mockResolvedValue({ data: [scenario()], total: 1 });

        await get().fetchScenarios();

        expect(get().scenarios).toHaveLength(1);
    });

    it('falls back to an empty list when the payload has no data', async () => {
        engine.getScenarios.mockResolvedValue({ total: 0 });

        await get().fetchScenarios();

        expect(get().scenarios).toEqual([]);
    });

    it('records the error and stops loading on failure', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        engine.getScenarios.mockRejectedValue(new Error('offline'));

        await get().fetchScenarios();

        expect(get().error).toBe('offline');
        expect(get().isLoading).toBe(false);
    });
});

describe('startGuestGame', () => {
    it('opens on the lowest-ordered scene regardless of array order', async () => {
        engine.getScenarioById.mockResolvedValue(
            scenario([scene('s2', 2), scene('s1', 1)]),
        );

        get().startGuestGame(scenario() as never);
        await settle();

        expect(get().currentScene?.id).toBe('s1');
        expect(get().isLoading).toBe(false);
    });

    it('resets trust and the choice log for a fresh run', async () => {
        useGuestGameStore.setState({
            trustScore: 12,
            choicesLog: [{ sceneId: 'x', label: 'old', trustDelta: -1, timestamp: '' }],
            isCompleted: true,
        });
        engine.getScenarioById.mockResolvedValue(scenario([scene('s1', 1)]));

        get().startGuestGame(scenario() as never);
        await settle();

        expect(get().trustScore).toBe(50);
        expect(get().choicesLog).toEqual([]);
        expect(get().isCompleted).toBe(false);
    });

    it('errors when the scenario has no scenes configured', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        engine.getScenarioById.mockResolvedValue(scenario([]));

        get().startGuestGame(scenario() as never);
        await settle();

        expect(get().error).toBe('This scenario has no scenes configured.');
        expect(get().currentScene).toBeNull();
    });

    it('records a fetch failure', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        engine.getScenarioById.mockRejectedValue(new Error('not found'));

        get().startGuestGame(scenario() as never);
        await settle();

        expect(get().error).toBe('not found');
    });
});

describe('submitGuestChoice', () => {
    const startAt = (scenes: ReturnType<typeof scene>[], current = 0) => {
        useGuestGameStore.setState({
            activeScenario: scenario(scenes) as never,
            currentScene: scenes[current] as never,
            trustScore: 50,
            isLoading: false,
            lastChoice: null,
            pendingAdvance: null,
        });
    };

    it('ignores a choice when no scene is active', async () => {
        get().submitGuestChoice({ label: 'x' });
        await settle();

        expect(get().lastChoice).toBeNull();
    });

    it('ignores a second choice while a learning moment is pending', async () => {
        startAt([scene('s1', 1), scene('s2', 2)]);
        useGuestGameStore.setState({
            lastChoice: { label: 'first', feedback: null, trustDelta: 0, trap: null, correct: null },
        });

        get().submitGuestChoice({ label: 'second' });
        await settle();

        expect(get().lastChoice?.label).toBe('first');
    });

    it('applies the outcome trust delta and clamps at 100', async () => {
        startAt([scene('s1', 1)]);

        get().submitGuestChoice({
            label: 'Verify',
            outcomes: [{ trustScoreDelta: 200 }],
        });
        await settle();

        expect(get().trustScore).toBe(100);
    });

    it('clamps the trust score at 0', async () => {
        startAt([scene('s1', 1)]);

        get().submitGuestChoice({
            label: 'Share',
            outcomes: [{ trustScoreDelta: -200 }],
        });
        await settle();

        expect(get().trustScore).toBe(0);
    });

    it('falls back to scoreImpact when the outcome carries no delta', async () => {
        startAt([scene('s1', 1)]);

        get().submitGuestChoice({ label: 'Share', scoreImpact: -10 });
        await settle();

        expect(get().trustScore).toBe(40);
        expect(get().lastChoice?.trustDelta).toBe(-10);
    });

    it('treats a missing delta as neutral', async () => {
        startAt([scene('s1', 1)]);

        get().submitGuestChoice({ label: 'Wait' });
        await settle();

        expect(get().trustScore).toBe(50);
        expect(get().lastChoice?.correct).toBeNull();
    });

    it('marks a positive delta correct and a negative one incorrect', async () => {
        startAt([scene('s1', 1)]);
        get().submitGuestChoice({ label: 'Good', scoreImpact: 5 });
        await settle();
        expect(get().lastChoice?.correct).toBe(true);

        useGuestGameStore.setState({ lastChoice: null, pendingAdvance: null });
        get().submitGuestChoice({ label: 'Bad', scoreImpact: -5 });
        await settle();
        expect(get().lastChoice?.correct).toBe(false);
    });

    it('appends to the choice log', async () => {
        startAt([scene('s1', 1)]);

        get().submitGuestChoice({ id: 'c1', label: 'Verify', scoreImpact: 5 });
        await settle();

        expect(get().choicesLog).toHaveLength(1);
        expect(get().choicesLog[0]).toMatchObject({
            sceneId: 's1',
            choiceId: 'c1',
            label: 'Verify',
            trustDelta: 5,
        });
    });

    it('surfaces the outcome message and trap as the learning moment', async () => {
        startAt([scene('s1', 1)]);

        get().submitGuestChoice({
            label: 'Share',
            psychologicalTrap: 'urgency',
            outcomes: [{ trustScoreDelta: -5, message: 'That spread fast.' }],
        });
        await settle();

        expect(get().lastChoice).toMatchObject({
            feedback: 'That spread fast.',
            trap: 'urgency',
        });
    });

    it('queues the next scene by order for linear progression', async () => {
        startAt([scene('s1', 1), scene('s2', 2)]);

        get().submitGuestChoice({ label: 'Next', scoreImpact: 0 });
        await settle();

        expect(get().pendingAdvance).toMatchObject({ completed: false });
        expect(get().pendingAdvance?.nextScene?.id).toBe('s2');
    });

    it('follows an explicit nextSceneId branch', async () => {
        startAt([scene('s1', 1), scene('s2', 2), scene('s3', 3)]);

        get().submitGuestChoice({ label: 'Branch', nextSceneId: 's3' });
        await settle();

        expect(get().pendingAdvance?.nextScene?.id).toBe('s3');
    });

    it('re-fetches the scenario when the branch target is not in state', async () => {
        startAt([scene('s1', 1)]);
        engine.getScenarioById.mockResolvedValue(
            scenario([scene('s1', 1), scene('s9', 9)]),
        );

        get().submitGuestChoice({ label: 'Branch', nextSceneId: 's9' });
        await settle();

        expect(engine.getScenarioById).toHaveBeenCalledWith('sc-1');
        expect(get().pendingAdvance?.nextScene?.id).toBe('s9');
    });

    it('completes the run when the branch target cannot be resolved', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        startAt([scene('s1', 1)]);
        engine.getScenarioById.mockRejectedValue(new Error('gone'));

        get().submitGuestChoice({ label: 'Branch', nextSceneId: 'missing' });
        await settle();

        expect(get().pendingAdvance).toMatchObject({ completed: true, nextScene: null });
    });

    it('marks the run complete when the outcome ends the scenario', async () => {
        startAt([scene('s1', 1), scene('s2', 2)]);

        get().submitGuestChoice({
            label: 'Final',
            outcomes: [{ endScenario: true, trustScoreDelta: 5 }],
        });
        await settle();

        expect(get().pendingAdvance).toMatchObject({ completed: true });
    });

    it('marks the run complete when no later scene exists', async () => {
        startAt([scene('s1', 1)]);

        get().submitGuestChoice({ label: 'Last', scoreImpact: 5 });
        await settle();

        expect(get().pendingAdvance).toMatchObject({ completed: true });
    });
});

describe('continueGuestGame', () => {
    it('is a no-op when nothing is pending', () => {
        get().continueGuestGame();

        expect(get().currentScene).toBeNull();
        expect(get().isCompleted).toBe(false);
    });

    it('advances to the queued scene and clears the learning moment', () => {
        useGuestGameStore.setState({
            pendingAdvance: { nextScene: scene('s2', 2) as never, completed: false },
            lastChoice: { label: 'x', feedback: null, trustDelta: 0, trap: null, correct: null },
        });

        get().continueGuestGame();

        expect(get().currentScene?.id).toBe('s2');
        expect(get().lastChoice).toBeNull();
        expect(get().pendingAdvance).toBeNull();
        expect(get().isCompleted).toBe(false);
    });

    it('completes the run and reports the play', async () => {
        useGuestGameStore.setState({
            activeScenario: scenario() as never,
            pendingAdvance: { nextScene: null, completed: true },
            choicesLog: [{ sceneId: 's1', label: 'x', trustDelta: 5, timestamp: '' }],
            trustScore: 55,
        });

        get().continueGuestGame();
        await settle();

        expect(get().isCompleted).toBe(true);
        expect(get().currentScene).toBeNull();
        expect(mockPost).toHaveBeenCalledWith(
            '/engine/guest/play',
            expect.objectContaining({ scenarioId: 'sc-1', finalScore: 55 }),
        );
    });

    it('reports an anonymous guest when no stored identity exists', async () => {
        useGuestGameStore.setState({
            activeScenario: scenario() as never,
            pendingAdvance: { nextScene: null, completed: true },
        });

        get().continueGuestGame();
        await settle();

        expect(mockPost.mock.calls[0][1].guestId).toBe('anonymous');
    });

    it('reports the stored guest id when one exists', async () => {
        localStorage.setItem(
            'horizon-auth-storage',
            JSON.stringify({ state: { user: { id: 'guest-77' } } }),
        );
        useGuestGameStore.setState({
            activeScenario: scenario() as never,
            pendingAdvance: { nextScene: null, completed: true },
        });

        get().continueGuestGame();
        await settle();

        expect(mockPost.mock.calls[0][1].guestId).toBe('guest-77');
    });

    it('still completes when the play report fails', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockPost.mockRejectedValue(new Error('offline'));
        useGuestGameStore.setState({
            activeScenario: scenario() as never,
            pendingAdvance: { nextScene: null, completed: true },
        });

        get().continueGuestGame();
        await settle();

        expect(get().isCompleted).toBe(true);
        expect(consoleError).toHaveBeenCalled();
    });

    it('does not report when there is no active scenario', async () => {
        useGuestGameStore.setState({
            activeScenario: null,
            pendingAdvance: { nextScene: null, completed: true },
        });

        get().continueGuestGame();
        await settle();

        expect(mockPost).not.toHaveBeenCalled();
        expect(get().isCompleted).toBe(true);
    });
});

describe('resetGuestGame', () => {
    it('returns the store to a playable blank slate', () => {
        useGuestGameStore.setState({
            activeScenario: scenario() as never,
            currentScene: scene('s1', 1) as never,
            choicesLog: [{ sceneId: 's1', label: 'x', trustDelta: 1, timestamp: '' }],
            trustScore: 90,
            isCompleted: true,
            error: 'boom',
        });

        get().resetGuestGame();

        expect(get().activeScenario).toBeNull();
        expect(get().currentScene).toBeNull();
        expect(get().choicesLog).toEqual([]);
        expect(get().trustScore).toBe(50);
        expect(get().isCompleted).toBe(false);
        expect(get().error).toBeNull();
    });

    it('keeps the fetched scenario list', () => {
        useGuestGameStore.setState({ scenarios: [scenario()] as never });

        get().resetGuestGame();

        expect(get().scenarios).toHaveLength(1);
    });
});
