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

    it('should set authentication data', () => {
        const user = { id: '1', fullName: 'Test User', role: 'PLAYER' as any };
        const token = 'test-token';
        
        useAuthStore.getState().setAuth(user, token);
        
        const state = useAuthStore.getState();
        expect(state.user).toEqual(user);
        expect(state.token).toBe(token);
        expect(state.isAuthenticated).toBe(true);
    });

    it('should update user partially', () => {