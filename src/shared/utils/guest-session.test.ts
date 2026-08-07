import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GuestSessionManager } from './guest-session';

const SESSION_KEY = 'guest-session-id';
const USER_KEY = 'guest-user-id';
const EXP_KEY = 'guest-session-id_exp';

describe('GuestSessionManager', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('getSessionId / getGuestUserId', () => {
        it('returns null when no session has been created', () => {
            expect(GuestSessionManager.getSessionId()).toBeNull();
            expect(GuestSessionManager.getGuestUserId()).toBeNull();
        });

        it('reads back the ids written by createSession', () => {
            const { sessionId, userId } = GuestSessionManager.createSession();

            expect(GuestSessionManager.getSessionId()).toBe(sessionId);
            expect(GuestSessionManager.getGuestUserId()).toBe(userId);
        });
    });

    describe('createSession', () => {
        it('persists a session id and a guest-prefixed user id', () => {
            const { sessionId, userId } = GuestSessionManager.createSession();

            expect(sessionId).toBeTruthy();
            expect(userId.startsWith('guest_')).toBe(true);
            expect(localStorage.getItem(SESSION_KEY)).toBe(sessionId);
            expect(localStorage.getItem(USER_KEY)).toBe(userId);
        });

        it('issues a distinct session on each call', () => {
            const first = GuestSessionManager.createSession();
            const second = GuestSessionManager.createSession();

            expect(second.sessionId).not.toBe(first.sessionId);
            expect(second.userId).not.toBe(first.userId);
        });

        it('sets the expiry 24 hours out', () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

            GuestSessionManager.createSession();

            const expiry = Number(localStorage.getItem(EXP_KEY));
            expect(expiry).toBe(Date.now() + 24 * 60 * 60 * 1000);
        });
    });

    describe('clearSession', () => {
        it('removes the session, user id and expiry together', () => {
            GuestSessionManager.createSession();
            GuestSessionManager.clearSession();

            expect(localStorage.getItem(SESSION_KEY)).toBeNull();
            expect(localStorage.getItem(USER_KEY)).toBeNull();
            expect(localStorage.getItem(EXP_KEY)).toBeNull();
        });

        it('is a no-op when there is nothing to clear', () => {
            expect(() => GuestSessionManager.clearSession()).not.toThrow();
        });
    });

    describe('isSessionValid', () => {
        it('is false when no expiry is recorded', () => {
            expect(GuestSessionManager.isSessionValid()).toBe(false);
        });

        it('is true for a freshly created session', () => {
            GuestSessionManager.createSession();
            expect(GuestSessionManager.isSessionValid()).toBe(true);
        });

        it('is false once the expiry has passed', () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
            GuestSessionManager.createSession();

            vi.setSystemTime(new Date('2026-01-02T00:00:01Z'));
            expect(GuestSessionManager.isSessionValid()).toBe(false);
        });

        it('treats a cleared session as invalid', () => {
            GuestSessionManager.createSession();
            GuestSessionManager.clearSession();

            expect(GuestSessionManager.isSessionValid()).toBe(false);
        });
    });

    describe('getAuthHeaders', () => {
        it('returns an empty object when there is no session', () => {
            expect(GuestSessionManager.getAuthHeaders()).toEqual({});
        });

        it('carries the session id in the X-Guest-Session header', () => {
            const { sessionId } = GuestSessionManager.createSession();

            expect(GuestSessionManager.getAuthHeaders()).toEqual({
                'X-Guest-Session': sessionId,
            });
        });
    });
});
