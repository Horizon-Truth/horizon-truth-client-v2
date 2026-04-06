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
    description: string;
    country: string;
    status: string;
    createdAt: string;
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    authorName: string;
    authorRole: string;
    authorAvatar?: string;
    imageUrl?: string;
    category: string;
    readTime: string;
    language: LanguageCode;
    publishedAt: string;
    createdAt: string;
}

export interface Resource {
    id: string;
    title: string;
    slug: string;
    type: 'guide' | 'video' | 'course';
    description: string;
    duration: string;
    badge?: string;
    icon: string;
    fullContent?: string;
    linkUrl?: string;
    language: LanguageCode;
    createdAt: string;
}

export interface PlayerProfile {
    id: string;
    nickname: string;
    trustScoreInitial: number;
    onboardingCompleted: boolean;
    user?: User;
}

class AdminService {
    async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
        const response = await api.get('/users', { params });
        return response.data;
    }

    async createUser(data: any) {
        const response = await api.post('/users', data);
        return response.data;
    }

    async updateUserStatus(id: string, status: string) {
        const response = await api.put(`/admin/users/${id}/status`, { status });
        return response.data;
    }

    async deleteUser(id: string) {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    }

    async getOrganizations() {
        const response = await api.get('/admin/organizations');
        return response.data;
    }

    async getOrganizationById(id: string) {
        const response = await api.get(`/admin/organizations/${id}`);
        return response.data;
    }

    async createOrganization(data: any) {
        const response = await api.post('/admin/organizations', data);
        return response.data;
    }

    async getOrganizationUsers(orgId: string) {
        const response = await api.get(`/admin/organizations/${orgId}/users`);