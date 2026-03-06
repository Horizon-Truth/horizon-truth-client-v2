import { v4 as uuidv4 } from 'uuid';

export class GuestSessionManager {
    private static readonly GUEST_SESSION_KEY = 'guest-session-id';
    private static readonly GUEST_USER_ID_KEY = 'guest-user-id';

    static getSessionId(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.GUEST_SESSION_KEY);
    }

    static getGuestUserId(): string | null {