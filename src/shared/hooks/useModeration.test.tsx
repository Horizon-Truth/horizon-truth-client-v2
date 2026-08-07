import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/services/moderation.service', () => ({
    moderationService: {
        getPermissions: vi.fn(),
        getDashboard: vi.fn(),
        getCases: vi.fn(),
        getCase: vi.fn(),
        getModerators: vi.fn(),
    },
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const authState = { isAuthenticated: true };
vi.mock('@/store/auth.store', () => ({
    useAuthStore: () => authState,
}));

import {
    moderationKeys,
    useModerationPermissions,
    useModerationDashboard,
    useModerationQueue,
    useModerationCase,
    useModerators,
} from './useModeration';
import { moderationService } from '@/services/moderation.service';

const svc = moderationService as unknown as Record<string, ReturnType<typeof vi.fn>>;

/** A client that fails fast so error paths don't wait on retries. */
const wrapper = () => {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client }, children);
};

beforeEach(() => {
    vi.clearAllMocks();
    authState.isAuthenticated = true;
    svc.getPermissions.mockResolvedValue({ role: 'MODERATOR', permissions: [] });
    svc.getDashboard.mockResolvedValue({ open: 0 });
    svc.getCases.mockResolvedValue({ items: [], total: 0 });
    svc.getCase.mockResolvedValue({ id: 'case-1' });
    svc.getModerators.mockResolvedValue([]);
});

describe('moderationKeys', () => {
    it('namespaces every key under "moderation" so one invalidation clears all', () => {
        const keys = [
            moderationKeys.dashboard(),
            moderationKeys.permissions(),
            moderationKeys.cases({} as never),
            moderationKeys.case('c1'),
            moderationKeys.moderators(),
            moderationKeys.flags(false),
            moderationKeys.user('u1'),
            moderationKeys.appeals({}),
            moderationKeys.appeal('a1'),
            moderationKeys.analytics({} as never),
            moderationKeys.scorecard({} as never),
            moderationKeys.audit({}),
            moderationKeys.savedFilters(),
            moderationKeys.notifications(true),
            moderationKeys.unreadCount(),
        ];

        for (const key of keys) {
            expect(key[0]).toBe('moderation');
        }
    });

    it('distinguishes cases by their query', () => {
        expect(moderationKeys.cases({ page: 1 } as never)).not.toEqual(
            moderationKeys.cases({ page: 2 } as never),
        );
    });

    it('distinguishes entities by id', () => {
        expect(moderationKeys.case('a')).not.toEqual(moderationKeys.case('b'));
        expect(moderationKeys.user('a')).not.toEqual(moderationKeys.user('b'));
        expect(moderationKeys.appeal('a')).not.toEqual(moderationKeys.appeal('b'));
    });

    it('separates flag and notification variants by their flag', () => {
        expect(moderationKeys.flags(true)).not.toEqual(moderationKeys.flags(false));
        expect(moderationKeys.notifications(true)).not.toEqual(
            moderationKeys.notifications(false),
        );
    });
});

describe('useModerationPermissions', () => {
    it('exposes the permissions the server granted', async () => {
        svc.getPermissions.mockResolvedValue({
            role: 'MODERATOR',
            permissions: ['case:read', 'case:action'],
        });

        const { result } = renderHook(() => useModerationPermissions(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.permissions).toHaveLength(2));
        expect(result.current.can('case:read' as never)).toBe(true);
        expect(result.current.can('case:delete' as never)).toBe(false);
    });

    it('answers canAny across several permissions', async () => {
        svc.getPermissions.mockResolvedValue({
            role: 'MODERATOR',
            permissions: ['case:read'],
        });

        const { result } = renderHook(() => useModerationPermissions(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.permissions).toHaveLength(1));
        expect(result.current.canAny('case:delete' as never, 'case:read' as never)).toBe(true);
        expect(result.current.canAny('case:delete' as never)).toBe(false);
        expect(result.current.canAny()).toBe(false);
    });

    it('denies everything before the response arrives', () => {
        const { result } = renderHook(() => useModerationPermissions(), {
            wrapper: wrapper(),
        });

        expect(result.current.permissions).toEqual([]);
        expect(result.current.can('case:read' as never)).toBe(false);
    });

    it('does not query at all for an anonymous visitor', () => {
        authState.isAuthenticated = false;

        const { result } = renderHook(() => useModerationPermissions(), {
            wrapper: wrapper(),
        });

        expect(svc.getPermissions).not.toHaveBeenCalled();
        expect(result.current.permissions).toEqual([]);
    });

    it('denies everything when the permissions call fails', async () => {
        svc.getPermissions.mockRejectedValue(new Error('403'));

        const { result } = renderHook(() => useModerationPermissions(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.can('case:read' as never)).toBe(false);
    });
});

describe('queue and case queries', () => {
    it('loads the dashboard overview', async () => {
        svc.getDashboard.mockResolvedValue({ open: 7 });

        const { result } = renderHook(() => useModerationDashboard(), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.data).toEqual({ open: 7 }));
    });

    it('passes the queue query straight through to the service', async () => {
        const query = { page: 2, status: ['OPEN'] } as never;

        const { result } = renderHook(() => useModerationQueue(query), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(svc.getCases).toHaveBeenCalledWith(query);
    });

    it('fetches a case when an id is known', async () => {
        const { result } = renderHook(() => useModerationCase('case-1'), {
            wrapper: wrapper(),
        });

        await waitFor(() => expect(result.current.data).toEqual({ id: 'case-1' }));
        expect(svc.getCase).toHaveBeenCalledWith('case-1');
    });

    it('stays idle until an id exists', () => {
        const { result } = renderHook(() => useModerationCase(undefined), {
            wrapper: wrapper(),
        });

        expect(svc.getCase).not.toHaveBeenCalled();
        expect(result.current.data).toBeUndefined();
    });

    it('loads the moderator roster', async () => {
        svc.getModerators.mockResolvedValue([{ id: 'm-1' }]);

        const { result } = renderHook(() => useModerators(), { wrapper: wrapper() });

        await waitFor(() => expect(result.current.data).toHaveLength(1));
    });
});
