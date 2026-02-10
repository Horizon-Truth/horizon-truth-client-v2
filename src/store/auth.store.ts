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
    email: string;
    fullName: string;
    role: UserRole;
    username?: string;
    avatarUrl?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'horizon-auth-storage',
        }
    )
);
