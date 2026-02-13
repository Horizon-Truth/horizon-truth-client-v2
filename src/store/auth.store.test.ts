import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';

describe('AuthStore', () => {
    beforeEach(() => {
        // Clear store before each test
        useAuthStore.getState().logout();
    });

    it('should initialize with null user and token', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });
