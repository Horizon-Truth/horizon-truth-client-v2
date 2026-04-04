import { v4 as uuidv4 } from 'uuid';

export class GuestSessionManager {
    private static readonly GUEST_SESSION_KEY = 'guest-session-id';
    private static readonly GUEST_USER_ID_KEY = 'guest-user-id';

    static getSessionId(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.GUEST_SESSION_KEY);
    }

    static getGuestUserId(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.GUEST_USER_ID_KEY);
    }

    static createSession(): { sessionId: string; userId: string } {
        if (typeof window === 'undefined') {
            throw new Error('Cannot create guest session on server');
        }

        const sessionId = uuidv4();
        const userId = `guest_${uuidv4()}`;

        localStorage.setItem(this.GUEST_SESSION_KEY, sessionId);
        localStorage.setItem(this.GUEST_USER_ID_KEY, userId);
