import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'PLAYER' | 'MODERATOR' | 'ORG_ADMIN' | 'SYSTEM_ADMIN';

export const UserRoles = {
    PLAYER: 'PLAYER' as UserRole,
    MODERATOR: 'MODERATOR' as UserRole,
    ORG_ADMIN: 'ORG_ADMIN' as UserRole,
    SYSTEM_ADMIN: 'SYSTEM_ADMIN' as UserRole,
};

interface User {
    id: string;
    email?: string;
    phone?: string;
    fullName: string;
    role: UserRole;
    username?: string;
    nickname?: string;
    avatarUrl?: string;
    onboardingCompleted?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    loading: boolean;
    error: string | null;
    setAuth: (user: User, token: string) => void;
    setGuest: (isGuest: boolean) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: false,
            loading: false,
            error: null,
            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: true,
                isGuest: false,
                loading: false,
                error: null
            }),
            setGuest: (isGuest) => set({
                isGuest,
                isAuthenticated: false,
                user: isGuest ? { id: crypto.randomUUID(), fullName: 'Guest Player', role: 'PLAYER' } as any : null,
                token: null
            }),
            updateUser: (updatedUser) => set((state) => ({
                user: state.user ? { ...state.user, ...updatedUser } : null
            })),
            logout: () => set({ user: null, token: null, isAuthenticated: false, isGuest: false }),
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error, loading: false }),
        }),
        {
            name: 'horizon-auth-storage',
            partialize: (state) => ({
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                isGuest: state.isGuest
            }),
        }
    )
);
