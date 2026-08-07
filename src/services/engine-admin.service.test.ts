/**
 * Endpoint contract tests for the engine and admin service wrappers.
 * The transport is mocked; these pin the paths, verbs and payload shapes.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('@/store/language.store', () => ({
    getCurrentLanguage: () => 'en',
    useLanguageStore: { getState: () => ({ language: 'en' }) },
}));

import api from './api';
import { engineService } from './engine.service';
import { adminService } from './admin.service';

const mockApi = api as unknown as Record<
    'get' | 'post' | 'put' | 'patch' | 'delete',
    ReturnType<typeof vi.fn>
>;

beforeEach(() => {
    vi.clearAllMocks();
    for (const verb of ['get', 'post', 'put', 'patch', 'delete'] as const) {
        mockApi[verb].mockResolvedValue({ data: { ok: true } });
    }
});

describe('engineService — player-facing scenarios', () => {
    it('scopes the listing to a language so content is never mixed', async () => {
        await engineService.getScenarios();

        const [url, config] = mockApi.get.mock.calls[0];
        expect(url).toBe('/engine/scenarios');
        expect(config.params).toHaveProperty('language');
    });

    it('lets an explicit language override the default', async () => {
        await engineService.getScenarios({ language: 'am' as never });

        expect(mockApi.get.mock.calls[0][1].params.language).toBe('am');
    });

    it('passes filters through alongside the language', async () => {
        await engineService.getScenarios({ difficulty: 'HARD', page: 2 });

        const params = mockApi.get.mock.calls[0][1].params;
        expect(params).toMatchObject({ difficulty: 'HARD', page: 2 });
    });

    it('fetches a single scenario by id', async () => {
        await engineService.getScenarioById('s-1');
        expect(mockApi.get).toHaveBeenCalledWith('/engine/scenarios/s-1');
    });
});

describe('engineService — gameplay', () => {
    it('starts a game with the scenario id in the body', async () => {
        await engineService.startGame('s-1');
        expect(mockApi.post).toHaveBeenCalledWith('/engine/game/start', {
            scenarioId: 's-1',
        });
    });

    it('reads progress by id', async () => {
        await engineService.getGameProgress('p-1');
        expect(mockApi.get).toHaveBeenCalledWith('/engine/game/progress/p-1');
    });

    it('submits a choice as a flat payload', async () => {
        const payload = { progressId: 'p-1', sceneId: 'sc-1', choiceKey: 'c1' };

        await engineService.submitChoice(payload);

        expect(mockApi.post).toHaveBeenCalledWith('/engine/game/choice', payload);
    });

    it('reads the outcome and the run summary', async () => {
        await engineService.getGameOutcome('p-1');
        expect(mockApi.get).toHaveBeenCalledWith('/engine/game/p-1/outcome');

        await engineService.getScenarioSummary('p-1');
        expect(mockApi.get).toHaveBeenCalledWith(
            '/engine/game/progress/p-1/summary',
        );
    });

    it('requests history unfiltered by default', async () => {
        await engineService.getMyGameHistory();

        expect(mockApi.get).toHaveBeenCalledWith('/engine/game/history/me', {
            params: { scenarioId: undefined },
        });
    });

    it('filters history by scenario when asked', async () => {
        await engineService.getMyGameHistory('s-1');

        expect(mockApi.get).toHaveBeenCalledWith('/engine/game/history/me', {
            params: { scenarioId: 's-1' },
        });
    });
});

describe('engineService — authoring', () => {
    it('uses the admin listing for authored scenarios', async () => {
        await engineService.getAdminScenarios({ search: 'flood' });

        expect(mockApi.get).toHaveBeenCalledWith('/engine/admin/scenarios', {
            params: { search: 'flood' },
        });
    });

    it('creates, updates and deletes scenarios', async () => {
        await engineService.createScenario({ title: 'New' });
        expect(mockApi.post).toHaveBeenCalledWith('/engine/admin/scenarios', {
            title: 'New',
        });

        await engineService.updateScenario('s-1', { title: 'Edited' });
        expect(mockApi.put).toHaveBeenCalledWith('/engine/admin/scenarios/s-1', {
            title: 'Edited',
        });

        await engineService.deleteScenario('s-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/engine/admin/scenarios/s-1');
    });

    it('round-trips scenarios through export and import', async () => {
        await engineService.exportScenarios(['s-1', 's-2']);
        expect(mockApi.post).toHaveBeenCalledWith(
            '/engine/admin/scenarios/export',
            { ids: ['s-1', 's-2'] },
        );

        await engineService.importScenarios([{ title: 'Imported' }]);
        expect(mockApi.post).toHaveBeenCalledWith(
            '/engine/admin/scenarios/import',
            [{ title: 'Imported' }],
        );
    });

    it('manages levels', async () => {
        await engineService.getLevels();
        expect(mockApi.get).toHaveBeenCalledWith('/engine/admin/scenarios/levels');

        await engineService.createLevel({ name: 'L1' });
        expect(mockApi.post).toHaveBeenCalledWith(
            '/engine/admin/scenarios/levels',
            { name: 'L1' },
        );

        await engineService.updateLevel('l-1', { name: 'L2' });
        expect(mockApi.put).toHaveBeenCalledWith(
            '/engine/admin/scenarios/levels/l-1',
            { name: 'L2' },
        );

        await engineService.deleteLevel('l-1');
        expect(mockApi.delete).toHaveBeenCalledWith(
            '/engine/admin/scenarios/levels/l-1',
        );
    });

    it('nests scenes under their scenario', async () => {
        await engineService.getScenes('s-1');
        expect(mockApi.get).toHaveBeenCalledWith(
            '/engine/admin/scenarios/s-1/scenes',
        );

        await engineService.createScene('s-1', { order: 1 });
        expect(mockApi.post).toHaveBeenCalledWith(
            '/engine/admin/scenarios/s-1/scenes',
            { order: 1 },
        );
    });
});

describe('adminService — users', () => {
    it('lists users with paging params', async () => {
        await adminService.getUsers({ page: 1, limit: 20 });

        expect(mockApi.get).toHaveBeenCalledWith('/users', {
            params: { page: 1, limit: 20 },
        });
    });

    it('creates a user', async () => {
        await adminService.createUser({ email: 'a@example.com' });
        expect(mockApi.post).toHaveBeenCalledWith('/users', {
            email: 'a@example.com',
        });
    });

    it('wraps a status change in an object', async () => {
        await adminService.updateUserStatus('u-1', 'SUSPENDED');

        expect(mockApi.put).toHaveBeenCalledWith('/admin/users/u-1/status', {
            status: 'SUSPENDED',
        });
    });

    it('deletes through the admin namespace', async () => {
        await adminService.deleteUser('u-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/admin/users/u-1');
    });

    it('reads player profiles', async () => {
        await adminService.getPlayerProfiles();
        expect(mockApi.get).toHaveBeenCalledWith('/admin/players');
    });
});

describe('adminService — organizations', () => {
    it('lists and reads organizations', async () => {
        await adminService.getOrganizations();
        expect(mockApi.get).toHaveBeenCalledWith('/admin/organizations');

        await adminService.getOrganizationById('o-1');
        expect(mockApi.get).toHaveBeenCalledWith('/admin/organizations/o-1');
    });

    it('creates an organization', async () => {
        await adminService.createOrganization({ name: 'Newsroom' });
        expect(mockApi.post).toHaveBeenCalledWith('/admin/organizations', {
            name: 'Newsroom',
        });
    });

    it('manages organization membership', async () => {
        await adminService.getOrganizationUsers('o-1');
        expect(mockApi.get).toHaveBeenCalledWith('/admin/organizations/o-1/users');

        await adminService.addOrganizationUser('o-1', {
            userId: 'u-1',
            role: 'EDITOR',
        });
        expect(mockApi.post).toHaveBeenCalledWith(
            '/admin/organizations/o-1/users',
            { userId: 'u-1', role: 'EDITOR' },
        );
    });

    it('wraps an organization status change in an object', async () => {
        await adminService.updateOrganizationStatus('o-1', 'ACTIVE');

        expect(mockApi.put).toHaveBeenCalledWith(
            '/admin/organizations/o-1/status',
            { status: 'ACTIVE' },
        );
    });
});

describe('adminService — content', () => {
    it('lists, reads, creates, updates and deletes blogs', async () => {
        await adminService.getBlogs({ search: 'media' });
        expect(mockApi.get).toHaveBeenCalledWith('/blogs', {
            params: { search: 'media' },
        });

        await adminService.getBlogById('b-1');
        expect(mockApi.get).toHaveBeenCalledWith('/blogs/b-1');

        await adminService.createBlog({ title: 'Post' });
        expect(mockApi.post).toHaveBeenCalledWith('/blogs', { title: 'Post' });

        await adminService.updateBlog('b-1', { title: 'Edited' });
        expect(mockApi.patch).toHaveBeenCalledWith('/blogs/b-1', {
            title: 'Edited',
        });

        await adminService.deleteBlog('b-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/blogs/b-1');
    });

    it('lists, reads, creates, updates and deletes resources', async () => {
        await adminService.getResources({ language: 'am' as never });
        expect(mockApi.get).toHaveBeenCalledWith('/resources', {
            params: { language: 'am' },
        });

        await adminService.getResourceById('r-1');
        expect(mockApi.get).toHaveBeenCalledWith('/resources/r-1');

        await adminService.createResource({ title: 'Guide' });
        expect(mockApi.post).toHaveBeenCalledWith('/resources', {
            title: 'Guide',
        });

        await adminService.updateResource('r-1', { title: 'Edited' });
        expect(mockApi.patch).toHaveBeenCalledWith('/resources/r-1', {
            title: 'Edited',
        });

        await adminService.deleteResource('r-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/resources/r-1');
    });
});
