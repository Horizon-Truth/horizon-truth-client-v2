import api from './api';
import type { LanguageCode } from '@/shared/i18n/languages';

export interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    status: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface Organization {
    id: string;
    name: string;