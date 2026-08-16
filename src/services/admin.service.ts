import api from './api';
import type { LanguageCode } from '@/shared/i18n/languages';
import type { UserRole } from '@/store/auth.store';

/** Mirrors the backend `UserStatus` enum — there is no `INACTIVE`. */
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'ANONYMIZED';

export interface User {
    id: string;
    email: string;
    username: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string;
    createdAt: string;
    lastLoginAt?: string | null;
}

export interface UserActivityEntry {
    id: string;
    action: string;
    createdAt: string;
    /** Partial by design — the full IP is only ever stored hashed. */
    ipAddressPartial?: string | null;
    userAgent?: string | null;
    metadata?: Record<string, unknown> | null;
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

    async getUserById(id: string) {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    }

    async getUserActivity(id: string, params?: { page?: number; limit?: number }) {
        const response = await api.get(`/users/${id}/activity`, { params });
        return response.data;
    }

    /** Profile fields, role and status. Role is how moderation access is granted. */
    async updateUser(id: string, data: Partial<Pick<User, 'fullName' | 'username' | 'email' | 'role' | 'status'>>) {
        const response = await api.patch<User>(`/users/${id}`, data);
        return response.data;
    }

    async updateUserStatus(id: string, status: UserStatus) {
        const response = await api.put(`/users/${id}/status`, { status });
        return response.data;
    }

    async deleteUser(id: string) {
        const response = await api.delete(`/users/${id}`);
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
        return response.data;
    }

    async addOrganizationUser(orgId: string, data: { userId: string; role: string }) {
        const response = await api.post(`/admin/organizations/${orgId}/users`, data);
        return response.data;
    }

    async updateOrganizationStatus(id: string, status: string) {
        const response = await api.put(`/admin/organizations/${id}/status`, { status });
        return response.data;
    }

    async getPlayerProfiles() {
        const response = await api.get('/admin/players');
        return response.data;
    }

    // Blog Methods
    async getBlogs(params?: { language?: LanguageCode; search?: string }) {
        const response = await api.get('/blogs', { params });
        return response.data;
    }

    async getBlogById(id: string) {
        const response = await api.get(`/blogs/${id}`);
        return response.data;
    }

    async createBlog(data: Partial<Blog>) {
        const response = await api.post('/blogs', data);
        return response.data;
    }

    async updateBlog(id: string, data: Partial<Blog>) {
        const response = await api.patch(`/blogs/${id}`, data);
        return response.data;
    }

    async deleteBlog(id: string) {
        const response = await api.delete(`/blogs/${id}`);
        return response.data;
    }

    // Resource Methods
    async getResources(params?: { language?: LanguageCode; search?: string }) {
        const response = await api.get('/resources', { params });
        return response.data;
    }

    async getResourceById(id: string) {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    }

    async createResource(data: Partial<Resource>) {
        const response = await api.post('/resources', data);
        return response.data;
    }

    async updateResource(id: string, data: Partial<Resource>) {
        const response = await api.patch(`/resources/${id}`, data);
        return response.data;
    }

    async deleteResource(id: string) {
        const response = await api.delete(`/resources/${id}`);
        return response.data;
    }
}

export const adminService = new AdminService();
