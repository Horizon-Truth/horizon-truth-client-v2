import { v4 as uuidv4 } from 'uuid';

export class GuestSessionManager {
    private static readonly GUEST_SESSION_KEY = 'guest-session-id';
    private static readonly GUEST_USER_ID_KEY = 'guest-user-id';
