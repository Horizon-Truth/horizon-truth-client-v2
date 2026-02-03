import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'PLAYER' | 'MODERATOR' | 'ORG_ADMIN' | 'SYSTEM_ADMIN';

export const UserRoles = {
    PLAYER: 'PLAYER' as UserRole,
    MODERATOR: 'MODERATOR' as UserRole,