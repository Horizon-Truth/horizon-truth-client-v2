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

import api from './api';
import { moderationService, downloadBlob } from './moderation.service';
import { onboardingService } from '@/modules/players/services/onboarding.service';

const mockApi = api as unknown as Record<
    'get' | 'post' | 'put' | 'patch' | 'delete',
    ReturnType<typeof vi.fn>
>;

/** The query string the service built for its last GET. */
const lastQuery = () => (mockApi.get.mock.calls.at(-1)?.[0] as string).split('?')[1] ?? '';

beforeEach(() => {
    vi.clearAllMocks();
    for (const verb of ['get', 'post', 'put', 'patch', 'delete'] as const) {
        mockApi[verb].mockResolvedValue({ data: { items: [], total: 0 } });
    }
});

describe('moderationService.getCases query serialisation', () => {
    it('sends a bare path when no filters are given', async () => {
        await moderationService.getCases();

        expect(mockApi.get).toHaveBeenCalledWith('/moderation/reports?');
    });

    it('serialises a scalar filter', async () => {
        await moderationService.getCases({ page: 2 } as never);

        expect(lastQuery()).toBe('page=2');
    });

    it('repeats the key for array filters, as the backend DTO expects', async () => {
        await moderationService.getCases({ status: ['OPEN', 'ESCALATED'] } as never);

        expect(lastQuery()).toBe('status=OPEN&status=ESCALATED');
    });

    it('drops undefined, null and empty-string filters', async () => {
        await moderationService.getCases({
            page: 1,
            status: undefined,
            assignee: null,
            search: '',
        } as never);

        expect(lastQuery()).toBe('page=1');
    });

    it('keeps a zero, which is a meaningful filter value', async () => {
        await moderationService.getCases({ page: 0 } as never);

        expect(lastQuery()).toBe('page=0');
    });

    it('url-encodes values', async () => {
        await moderationService.getCases({ search: 'flood rumour' } as never);

        expect(lastQuery()).toBe('search=flood+rumour');
    });

    it('emits nothing for an empty array', async () => {
        await moderationService.getCases({ status: [] } as never);

        expect(lastQuery()).toBe('');
    });
});

describe('moderationService endpoints', () => {
    it('reads the dashboard', async () => {
        await moderationService.getDashboard();
        expect(mockApi.get).toHaveBeenCalledWith('/moderation/dashboard');
    });

    it('reads the caller permissions', async () => {
        await moderationService.getPermissions();
        expect(mockApi.get).toHaveBeenCalledWith('/moderation/permissions');
    });

    it('reads a single case by id', async () => {
        await moderationService.getCase('case-1');
        expect(mockApi.get).toHaveBeenCalledWith('/moderation/reports/case-1');
    });

    it('unwraps the response body', async () => {
        mockApi.get.mockResolvedValue({ data: { id: 'case-1' } });

        await expect(moderationService.getCase('case-1')).resolves.toEqual({
            id: 'case-1',
        });
    });
});

describe('downloadBlob', () => {
    beforeEach(() => {
        Object.defineProperty(window.URL, 'createObjectURL', {
            configurable: true,
            value: vi.fn(() => 'blob:mock-url'),
        });
        Object.defineProperty(window.URL, 'revokeObjectURL', {
            configurable: true,
            value: vi.fn(),
        });
    });

    it('clicks a download link and cleans it up', () => {
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        downloadBlob(new Blob(['a,b,c']), 'cases.csv');

        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(click).toHaveBeenCalled();
        // The link removes itself, so nothing is left behind.
        expect(document.querySelectorAll('a[download]')).toHaveLength(0);
    });

    it('names the file and releases the object url', () => {
        let captured: string | null = null;
        vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
            this: HTMLAnchorElement,
        ) {
            captured = this.getAttribute('download');
        });

        downloadBlob(new Blob(['x']), 'audit-log.csv');

        expect(captured).toBe('audit-log.csv');
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
});

describe('onboardingService', () => {
    it('reads avatars and regions', async () => {
        await onboardingService.getAvatars();
        expect(mockApi.get).toHaveBeenCalledWith('/players/avatars');

        await onboardingService.getRegions();
        expect(mockApi.get).toHaveBeenCalledWith('/players/regions');
    });

    it('initializes a player profile', async () => {
        const dto = { nickname: 'Sky', avatarId: 'a-1' };

        await onboardingService.initializeProfile(dto);

        expect(mockApi.post).toHaveBeenCalledWith('/players/initialize', dto);
    });

    it('reads the caller profile', async () => {
        await onboardingService.getMyProfile();
        expect(mockApi.get).toHaveBeenCalledWith('/players/profile/me');
    });

    it('manages avatars through the admin namespace', async () => {
        await onboardingService.getAllAvatarsAdmin({ page: 1 });
        expect(mockApi.get).toHaveBeenCalledWith('/players/admin/avatars', {
            params: { page: 1 },
        });

        await onboardingService.createAvatar({
            name: 'Sky',
            imageUrl: 'https://cdn/a.png',
            gender: 'NEUTRAL',
            ageGroup: 'ADULT',
        });
        expect(mockApi.post).toHaveBeenCalledWith(
            '/players/admin/avatars',
            expect.objectContaining({ name: 'Sky' }),
        );

        await onboardingService.updateAvatar('a-1', { name: 'Sky II' });
        expect(mockApi.patch).toHaveBeenCalledWith('/players/admin/avatars/a-1', {
            name: 'Sky II',
        });

        await onboardingService.deleteAvatar('a-1');
        expect(mockApi.delete).toHaveBeenCalledWith('/players/admin/avatars/a-1');
    });

    it('resolves to undefined when deleting an avatar', async () => {
        await expect(onboardingService.deleteAvatar('a-1')).resolves.toBeUndefined();
    });
});
