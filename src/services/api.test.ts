/**
 * The axios instance's interceptors are the only place auth is attached and
 * the only place a 401 logs the user out — both worth pinning down.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const storeState = { token: null as string | null, logout: vi.fn() };

vi.mock('../store/auth.store', () => ({
    useAuthStore: { getState: () => storeState },
}));

import api from './api';

/**
 * Reach the registered handlers; axios exposes them on the manager.
 * axios-retry registers its own interceptors first, so the ones api.ts adds
 * are the last in each list.
 */
const handlers = (kind: 'request' | 'response') => {
    const list = (api.interceptors[kind] as unknown as {
        handlers: {
            fulfilled: (v: unknown) => unknown;
            rejected: (e: unknown) => unknown;
        }[];
    }).handlers;
    return list[list.length - 1];
};

beforeEach(() => {
    storeState.token = null;
    storeState.logout = vi.fn();
});

describe('api instance', () => {
    it('is configured with the JSON content type', () => {
        expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('points at the configured API url', () => {
        expect(api.defaults.baseURL).toBeTruthy();
    });
});

describe('request interceptor', () => {
    it('attaches a bearer token when the user is signed in', () => {
        storeState.token = 'jwt-123';
        const config = { headers: {} as Record<string, string> };

        const result = handlers('request').fulfilled(config) as typeof config;

        expect(result.headers.Authorization).toBe('Bearer jwt-123');
    });

    it('leaves the request unauthenticated when there is no token', () => {
        storeState.token = null;
        const config = { headers: {} as Record<string, string> };

        const result = handlers('request').fulfilled(config) as typeof config;

        expect(result.headers.Authorization).toBeUndefined();
    });

    it('treats an empty token as no token', () => {
        storeState.token = '';
        const config = { headers: {} as Record<string, string> };

        const result = handlers('request').fulfilled(config) as typeof config;

        expect(result.headers.Authorization).toBeUndefined();
    });

    it('rejects a request-setup failure rather than swallowing it', async () => {
        const boom = new Error('bad config');

        await expect(handlers('request').rejected(boom)).rejects.toThrow('bad config');
    });
});

describe('response interceptor', () => {
    it('passes a successful response straight through', () => {
        const response = { status: 200, data: { ok: true } };

        expect(handlers('response').fulfilled(response)).toBe(response);
    });

    it('logs the user out on a 401', async () => {
        const error = { response: { status: 401 } };

        await expect(handlers('response').rejected(error)).rejects.toBe(error);
        expect(storeState.logout).toHaveBeenCalledTimes(1);
    });

    it('leaves the session alone on a 403', async () => {
        const error = { response: { status: 403 } };

        await expect(handlers('response').rejected(error)).rejects.toBe(error);
        expect(storeState.logout).not.toHaveBeenCalled();
    });

    it('leaves the session alone on a 500', async () => {
        const error = { response: { status: 500 } };

        await expect(handlers('response').rejected(error)).rejects.toBe(error);
        expect(storeState.logout).not.toHaveBeenCalled();
    });

    it('survives a network error with no response at all', async () => {
        const error = { message: 'Network Error' };

        await expect(handlers('response').rejected(error)).rejects.toBe(error);
        expect(storeState.logout).not.toHaveBeenCalled();
    });
});
