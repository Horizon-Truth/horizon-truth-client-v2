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